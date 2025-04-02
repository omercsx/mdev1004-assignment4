/**
 * @author: Omer Cagri Sayir
 * @date: 2025-03-29
 */

import express from 'express';
import Recipe from '../model/Recipe.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all recipes
router.get('/', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET single recipe by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create new recipe
router.post('/', protect, async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT update recipe
router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE recipe
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;