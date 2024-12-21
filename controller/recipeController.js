const fs = require('fs');
const path = require('path');

// Function to read and parse the recipes from the .txt file
const getRecipesFromFile = () => {
  const filePath = path.join(__dirname, 'my_fav_recipes.txt'); // Adjust the path to the file
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    
    // Split the data by recipes, assuming each recipe is separated by an empty line
    const recipes = data.trim().split(/\n\s*\n/).map(recipeText => {  // Updated regex for splitting
      const recipeLines = recipeText.split('\n');
      const recipe = {};
      
      recipeLines.forEach(line => {
        const [key, value] = line.split(':').map(str => str.trim());
        if (key && value) {
          recipe[key.toLowerCase().replace(/\s/g, '_')] = value; // Use snake_case for keys
        }
      });
      
      return recipe;
    });
    
    return recipes;
  } catch (error) {
    console.error('Error reading the file:', error.message);
    return [];
  }
};

// Controller to get all recipes
const getAllRecipes = (req, res) => {
  try {
    const recipes = getRecipesFromFile();
    if (recipes.length > 0) {
      res.status(200).json({
        message: 'Recipes retrieved successfully',
        recipes: recipes
      });
    } else {
      res.status(404).json({
        message: 'No recipes found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving recipes',
      error: error.message
    });
  }
};

module.exports = { getAllRecipes };
