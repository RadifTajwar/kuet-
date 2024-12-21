const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ name: String, quantity: String }],
  instructions: { type: String, required: true },
  taste: { type: String, enum: ['Sweet', 'Savory', 'Spicy', 'Sour', 'Salty'] },
  reviews: { type: Number, default: 0 },  // Reviews rating
  cuisine: { type: String },
  preparationTime: { type: Number, required: true },  // in minutes
  addedAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
