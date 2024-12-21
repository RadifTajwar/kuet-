const mongoose = require('mongoose');
const Ingredient = require('../models/ingredientModel');  // Path to your Ingredient model
const Recipe = require('../models/recipeModel');  // Path to your Recipe model
const dotenv = require('dotenv');
// Sample data for Ingredients
const ingredients = [
  { name: 'Tomato', quantity: '3', category: 'Vegetable' },
  { name: 'Chicken Breast', quantity: '2', category: 'Meat' },
  { name: 'Cumin', quantity: '1 tsp', category: 'Spices' },
  { name: 'Rice', quantity: '500g', category: 'Grains' },
  { name: 'Cheese', quantity: '200g', category: 'Dairy' }
];

// Sample data for Recipes
const recipes = [
  {
    name: 'Chicken Curry',
    ingredients: [
      { name: 'Chicken Breast', quantity: '2' },
      { name: 'Cumin', quantity: '1 tsp' },
      { name: 'Tomato', quantity: '2' }
    ],
    instructions: 'Cook chicken with cumin and chopped tomatoes until done.',
    taste: 'Spicy',
    reviews: 5,
    cuisine: 'Indian',
    preparationTime: 30
  },
  {
    name: 'Cheese Rice',
    ingredients: [
      { name: 'Rice', quantity: '200g' },
      { name: 'Cheese', quantity: '100g' }
    ],
    instructions: 'Cook rice and mix with melted cheese.',
    taste: 'Savory',
    reviews: 4,
    cuisine: 'Italian',
    preparationTime: 20
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://radiftajwarmahi420:qhhmB4gc7j33MJ4Y@home.huden.mongodb.net/bitFest', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB...');

    // Clear existing data
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});

    console.log('Old data deleted...');

    // Seed Ingredients
    await Ingredient.insertMany(ingredients);
    console.log('Ingredients seeded...');

    // Seed Recipes
    await Recipe.insertMany(recipes);
    console.log('Recipes seeded...');

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed...');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
