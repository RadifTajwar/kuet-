const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: String, required: true },  // e.g., "2 cups", "500g"
  category: { type: String, enum: ['Vegetable', 'Meat', 'Spices', 'Grains', 'Dairy'], required: true },
  addedAt: { type: Date, default: Date.now }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
