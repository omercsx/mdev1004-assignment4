/**
 * @author: Gurpreet Kaur
 * @date: 2025-03-29
 */

const Recipe = require("../model/Recipe");
const fs = require('fs');
const path = require('path');

const recipeController = {
  // Get all recipes
  getAllRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.find({}).sort({ createdAt: -1 });
      if (recipes.length === 0) {
        const filePath = path.join(__dirname, '../model/recipes.json');
        const recipesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // Extract the recipes array from the JSON structure
        const recipesToInsert = recipesData.recipes;
        await Recipe.insertMany(recipesToInsert);
        return res.json({
          success: true,
          count: recipesToInsert.length,
          data: recipesToInsert
        });
      }
      res.json({
        success: true,
        count: recipes.length,
        data: recipes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching recipes",
        error: error.message
      });
    }
  },

  // Get single recipe by ID
  getRecipeById: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: "Recipe not found"
        });
      }

      res.json({
        success: true,
        data: recipe
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({
          success: false,
          message: "Invalid recipe ID format"
        });
      }
      res.status(500).json({
        success: false,
        message: "Error fetching recipe",
        error: error.message
      });
    }
  },

  // Create new recipe
  createRecipe: async (req, res) => {
    try {
      const {
        name,
        description,
        ingredients,
        instructions,
        cookingTime,
        servings,
        difficulty,
        category,
        cuisine
      } = req.body;

      // Validation
      if (!name || !description || !ingredients || !instructions || !cookingTime || !servings || !difficulty || !category || !cuisine) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields"
        });
      }

      // Validate difficulty enum
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: "Difficulty must be either 'Easy', 'Medium', or 'Hard'"
        });
      }

      const recipe = await Recipe.create({
        name,
        description,
        ingredients,
        instructions,
        cookingTime,
        servings,
        difficulty,
        category,
        cuisine,
        averageRating: 0 // Default value
      });

      res.status(201).json({
        success: true,
        message: "Recipe created successfully",
        data: recipe
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating recipe",
        error: error.message
      });
    }
  },

  // Update recipe
  updateRecipe: async (req, res) => {
    try {
      const {
        name,
        description,
        ingredients,
        instructions,
        cookingTime,
        servings,
        difficulty,
        category,
        cuisine
      } = req.body;

      // Validate difficulty if provided
      if (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: "Difficulty must be either 'Easy', 'Medium', or 'Hard'"
        });
      }

      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: "Recipe not found"
        });
      }

      // Update only provided fields
      if (name) recipe.name = name;
      if (description) recipe.description = description;
      if (ingredients) recipe.ingredients = ingredients;
      if (instructions) recipe.instructions = instructions;
      if (cookingTime) recipe.cookingTime = cookingTime;
      if (servings) recipe.servings = servings;
      if (difficulty) recipe.difficulty = difficulty;
      if (category) recipe.category = category;
      if (cuisine) recipe.cuisine = cuisine;

      const updatedRecipe = await recipe.save();

      res.json({
        success: true,
        message: "Recipe updated successfully",
        data: updatedRecipe
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({
          success: false,
          message: "Invalid recipe ID format"
        });
      }
      res.status(500).json({
        success: false,
        message: "Error updating recipe",
        error: error.message
      });
    }
  },

  // Delete recipe
  deleteRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: "Recipe not found"
        });
      }

      await recipe.deleteOne();

      res.json({
        success: true,
        message: "Recipe deleted successfully"
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({
          success: false,
          message: "Invalid recipe ID format"
        });
      }
      res.status(500).json({
        success: false,
        message: "Error deleting recipe",
        error: error.message
      });
    }
  }
};

module.exports = recipeController;