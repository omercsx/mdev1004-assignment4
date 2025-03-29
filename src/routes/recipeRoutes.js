/**
 * @author: Omer Cagri Sayir
 * @date: 2025-03-29
 */

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET all recipes
router.get('/', recipeController.getAllRecipes);

// GET single recipe by ID
router.get('/:id', recipeController.getRecipeById);

// POST create new recipe
router.post('/', recipeController.createRecipe);

// PUT update recipe
router.put('/:id', recipeController.updateRecipe);

// DELETE recipe
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router; 