const Ingredient = require('../models/ingredientModel');

// Add a new ingredient
const addIngredient = async (req, res) => {
    const { name, quantity, category } = req.body;

    try {
        const newIngredient = new Ingredient({ name, quantity, category });
        await newIngredient.save();
        res.status(201).json({ message: 'Ingredient added successfully', ingredient: newIngredient });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add ingredient', error: error.message });
    }
};

const updateIngredient = async (req, res) => {
    const { name, quantity, category } = req.body;

    // Create an object with the fields to update, but only include those that are provided
    const updateFields = {};
    if (name) updateFields.name = name;
    if (quantity) updateFields.quantity = quantity;
    if (category) updateFields.category = category;

    try {
        // Find the ingredient by ID and update only the fields present in the request body
        const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedIngredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.status(200).json({ message: 'Ingredient updated successfully', ingredient: updatedIngredient });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update ingredient', error: error.message });
    }
};


// Get all ingredients
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();  // Fetch all ingredients from the database

        if (ingredients.length === 0) {
            return res.status(200).json({ message: 'No ingredients found' });
        }

        res.status(200).json({ message: 'All ingredients retrieved successfully', ingredients });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ingredients', error: error.message });
    }
};

module.exports = { addIngredient, updateIngredient, getAllIngredients };
