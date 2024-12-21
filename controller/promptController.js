const express = require('express');
const bodyParser = require('body-parser');
const catchAsyncError = require('../middleware/catchAsyncError');
const fs = require('fs');
const path = require('path');
const spawner = require('child_process').spawn;
const axios = require('axios'); // For HTTP requests
// Replace with your actual API key fetching mechanism (e.g., environment variable)
const GOOGLE_API_KEY = process.env.gemini;

// Error handling (consider a more robust error handling approach)
if (!GOOGLE_API_KEY) {
  throw new Error('Missing Google API key. Please set the GOOGLE_API_KEY environment variable.');
}

// Initialize chat history and model (outside the request handler for efficiency)
let chatHistory = [];

const { GoogleGenerativeAI } = require('@google/generative-ai'); // Assuming the correct package name

const genAI = new GoogleGenerativeAI(process.env.gemini);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function extractTasteFromPrompt(prompt) {
  const chat = await model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(`User said: "${prompt}". What taste preference does the user have? The options are sweet, savory, spicy, creamy, tangy.... also use any more options you want to add`);
  const response = result.response;
  chatHistory = chat.history; // Update chat history

  // Assuming Gemini will respond with the taste preference (e.g., "sweet")
  return response.text().trim() || 'any'; // Return 'any' if no specific preference is identified
}

// Function to fetch recipes from the API
async function fetchRecipes() {
  try {
    const response = await axios.get('http://localhost:5000/api/recipes');
    return response.data.recipes; // Assuming the response structure has a 'recipes' field
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Unable to fetch recipes');
  }
}
// Function to fetch ingredients from the API
async function fetchIngredients() {
  try {
    const response = await axios.get('http://localhost:5000/api/ingredients');
    return response.data.ingredients; // Returns an array of ingredients
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
}
/// Function to filter recipes based on available ingredients and taste preferences using Gemini
async function filterRecipesByPreferences(recipes, ingredients, taste) {
  // Ensure the recipes contain the necessary data for filtering
  const ingredientsList = ingredients.map(ingredient => ingredient.name).join(', ');

  // Construct the prompt with proper validation
  const prompt = `
    The user has the following ingredients: ${ingredientsList}.
    They want a recipe that matches their taste preference: ${taste}.
    Here are some available recipes with their details:
    ${recipes.map(recipe => {
    // Ensure recipe has ingredients and map over them if valid
    const recipeIngredients = recipe.ingredients && Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ingredient => ingredient.name).join(', ') : 'No ingredients listed';

    return `
        Recipe Name: ${recipe.recipe_name}
        Taste: ${recipe.taste}
        Ingredients: ${recipeIngredients}
        Cuisine: ${recipe.cuisine}
        Preparation Time: ${recipe.preparation_time}
      `;
  }).join('\n')}
    Based on this information, recommend a recipe that best matches the user's taste and available ingredients.
  `;

  const chat = await model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  chatHistory = chat.history; // Update chat history

  // Parse the response to extract recommended recipe names
  const recommendedRecipeNames = response.text().split('\n').map(name => name.trim()).filter(Boolean);

  // Filter recipes based on the recommended names
  const recommendedRecipes = recipes.filter(recipe => recommendedRecipeNames.includes(recipe.recipe_name));

  return recommendedRecipes;
}

// Controller function to handle the prompt request and fetch the filtered recipes
exports.promptGenerate = catchAsyncError(async (req, res, next) => {
  const prompt = req.body.prompt;  // e.g., "I want something sweet today"

  // Fetch ingredients and recipes
  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  // Get the user's taste preference from Gemini
  const taste = await extractTasteFromPrompt(prompt);

  console.log("taste is ",taste);
  console.log("recipes are ", recipes);
  console.log("ingredients are ", ingredients);
  // Filter recipes based on taste and available ingredients using Gemini
  const filteredRecipes = await filterRecipesByPreferences(recipes, ingredients, taste);

  // Return the filtered recipes as response
  res.status(200).json({
    success: true,
    message: 'Here are the best recipes based on your preferences and available ingredients:',
    recipes: filteredRecipes
  });
});