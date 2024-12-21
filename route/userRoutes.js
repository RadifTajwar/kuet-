const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');  // Cloudinary utility (if you are uploading images)
const upload = require('../middleware/multer');  // Multer middleware for handling file uploads
// Import controller functions
const { promptGenerate } = require('../controller/promptController');
const { getAllRecipes} = require('../controller/recipeController');
const { addIngredient, updateIngredient,getAllIngredients } = require('../controller/ingredientController');
// const { processRecipeImage } = require('../controller/ocrController');  // OCR functionality (if applicable)

// Define routes

// Home route
router.get('/', (req, res) => {
  res.send('Welcome to Mofa’s Kitchen Buddy API');
});

// Recipe Routes
// Get all recipes

// Recipe image upload and OCR
// router.post('/recipes/image', upload.single('image'), processRecipeImage);

// Ingredient Routes
// Add a new ingredient
router.post('/ingredients', addIngredient);

// Update ingredient (e.g., after shopping)
router.put('/ingredients/:id', updateIngredient);
// Route for getting all ingredients
router.get('/ingredients', getAllIngredients);

// Prompt Generation for Chatbot (Example for LLM interaction)
router.post('/prompt/generate', promptGenerate);

router.get('/recipes', getAllRecipes);

module.exports = router;
