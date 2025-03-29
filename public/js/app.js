// DOM Elements
const homeLink = document.getElementById('home-link');
const recipesLink = document.getElementById('recipes-link');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const homeSection = document.getElementById('home-section');
const recipesSection = document.getElementById('recipes-section');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const exploreBtn = document.getElementById('explore-btn');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const featuredRecipesContainer = document.getElementById('featured-recipes-container');
const allRecipesContainer = document.getElementById('all-recipes-container');
const recipeModal = document.getElementById('recipe-modal');
const recipeFormModal = document.getElementById('recipe-form-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const recipeForm = document.getElementById('recipe-form');
const searchRecipes = document.getElementById('search-recipes');
const filterDifficulty = document.getElementById('filter-difficulty');
const filterCuisine = document.getElementById('filter-cuisine');

// API Base URL
const API_URL = 'http://localhost:3000/api';

// State
let currentUser = null;
let recipes = [];
let filteredRecipes = [];
let currentPage = 1;
let itemsPerPage = 6;

// Navigation
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
  });

  // Show the selected section
  section.classList.add('active');

  // Update active link
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });
}

// Event Listeners for Navigation
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(homeSection);
  homeLink.classList.add('active');
  closeMenu();
});

recipesLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(recipesSection);
  recipesLink.classList.add('active');
  loadAllRecipes();
  closeMenu();
});

loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(loginSection);
  loginLink.classList.add('active');
  closeMenu();
});

registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(registerSection);
  registerLink.classList.add('active');
  closeMenu();
});

exploreBtn.addEventListener('click', () => {
  showSection(recipesSection);
  recipesLink.classList.add('active');
  loadAllRecipes();
});

goToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(registerSection);
  registerLink.classList.add('active');
});

goToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(loginSection);
  loginLink.classList.add('active');
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav.classList.toggle('active');

  // Create overlay if it doesn't exist
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Close menu when overlay is clicked
    overlay.addEventListener('click', closeMenu);
  }

  overlay.classList.toggle('active');
});

function closeMenu() {
  menuToggle.classList.remove('active');
  nav.classList.remove('active');
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Modal Functions
function openModal(modal) {
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

// Close modal when clicking outside the content
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal(e.target);
  }
});

// API Functions
async function fetchRecipes() {
  try {
    console.log('Fetching all recipes...');
    const response = await fetch(`${API_URL}/recipes`);

    if (!response.ok) {
      console.error('Failed to fetch recipes:', response.status, response.statusText);
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API response:', result);

    if (result.success && result.data) {
      console.log('Recipes fetched successfully:', result.data.length);
      return result.data;
    } else {
      console.warn('API returned success:false or no data');
      return [];
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

async function fetchRecipeById(id) {
  try {
    console.log(`Fetching recipe with ID: ${id}`);
    const response = await fetch(`${API_URL}/recipes/${id}`);

    if (!response.ok) {
      console.error(`Failed to fetch recipe ${id}:`, response.status, response.statusText);
      throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API response for single recipe:', result);

    if (result.success && result.data) {
      return result.data;
    } else {
      console.warn('API returned success:false or no data for recipe');
      return null;
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

async function createRecipe(recipeData) {
  try {
    console.log('Creating new recipe:', recipeData);
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });

    const result = await response.json();
    console.log('Create recipe API response:', result);

    if (!response.ok) {
      console.error('Failed to create recipe:', result);
      throw new Error(result.message || 'Failed to create recipe');
    }

    if (result.success && result.data) {
      return result.data;
    } else {
      console.warn('API returned success:false or no data for create recipe');
      return null;
    }
  } catch (error) {
    console.error('Error creating recipe:', error);
    return null;
  }
}

async function updateRecipe(id, recipeData) {
  try {
    console.log(`Updating recipe ${id}:`, recipeData);
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });

    const result = await response.json();
    console.log('Update recipe API response:', result);

    if (!response.ok) {
      console.error('Failed to update recipe:', result);
      throw new Error(result.message || 'Failed to update recipe');
    }

    if (result.success && result.data) {
      return result.data;
    } else {
      console.warn('API returned success:false or no data for update recipe');
      return null;
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    return null;
  }
}

async function deleteRecipe(id) {
  try {
    console.log(`Deleting recipe ${id}`);
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    console.log('Delete recipe API response:', result);

    if (!response.ok) {
      console.error('Failed to delete recipe:', result);
      throw new Error(result.message || 'Failed to delete recipe');
    }

    return result.success;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
}

// Auth Functions
async function login(email, password) {
  try {
    console.log('Attempting to login user:', { email });
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Login failed:', data);
      throw new Error(data.message || 'Login failed');
    }

    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
}

async function register(name, email, password) {
  try {
    console.log('Attempting to register user:', { name, email });
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Registration failed:', data);
      throw new Error(data.message || 'Registration failed');
    }

    console.log('Registration successful:', data);
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    return null;
  }
}

// UI Functions
function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = 'recipe-card';

  const difficultyClass = recipe.difficulty.toLowerCase();

  card.innerHTML = `
        <div class="recipe-image">Recipe Image</div>
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.recipeName}</h3>
            <span class="recipe-difficulty ${difficultyClass}">${recipe.difficulty}</span>
            <div class="recipe-info">
                <span>${recipe.cuisine}</span>
                <span>${recipe.cookingTime} mins</span>
            </div>
            <div class="recipe-actions">
                <button class="btn secondary view-recipe" data-id="${recipe._id}">View</button>
                <button class="btn primary edit-recipe" data-id="${recipe._id}">Edit</button>
            </div>
        </div>
    `;

  // Add event listeners
  card.querySelector('.view-recipe').addEventListener('click', () => {
    viewRecipe(recipe._id);
  });

  card.querySelector('.edit-recipe').addEventListener('click', () => {
    editRecipe(recipe._id);
  });

  return card;
}

async function loadFeaturedRecipes() {
  console.log('Loading featured recipes...');
  const allRecipes = await fetchRecipes();
  console.log('Number of recipes received:', allRecipes.length);

  if (allRecipes.length > 0) {
    // Get 3 random recipes for featured section
    const featuredRecipes = allRecipes.sort(() => 0.5 - Math.random()).slice(0, 3);
    console.log('Selected featured recipes:', featuredRecipes);

    featuredRecipesContainer.innerHTML = '';
    featuredRecipes.forEach(recipe => {
      featuredRecipesContainer.appendChild(createRecipeCard(recipe));
    });
  } else {
    console.warn('No recipes available for featured section');
    featuredRecipesContainer.innerHTML = '<p class="no-recipes">No featured recipes available.</p>';
  }
}

async function loadAllRecipes() {
  console.log('Loading all recipes...');
  recipes = await fetchRecipes();
  filteredRecipes = [...recipes];
  console.log('All recipes loaded:', recipes.length);

  // Populate cuisine filter
  const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))];
  console.log('Available cuisines:', cuisines);

  filterCuisine.innerHTML = '<option value="">All Cuisines</option>';
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.value = cuisine;
    option.textContent = cuisine;
    filterCuisine.appendChild(option);
  });

  renderRecipes();
}

function renderRecipes() {
  allRecipesContainer.innerHTML = '';

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  if (paginatedRecipes.length === 0) {
    allRecipesContainer.innerHTML = '<p class="no-recipes">No recipes found. Try a different search.</p>';
  } else {
    paginatedRecipes.forEach(recipe => {
      allRecipesContainer.appendChild(createRecipeCard(recipe));
    });
  }

  renderPagination();
}

function renderPagination() {
  const paginationContainer = document.getElementById('recipes-pagination');
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  if (totalPages <= 1) {
    return;
  }

  // Previous button
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderRecipes();
    });
    paginationContainer.appendChild(prevButton);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPage = i;
      renderRecipes();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderRecipes();
    });
    paginationContainer.appendChild(nextButton);
  }
}

async function viewRecipe(id) {
  const recipe = await fetchRecipeById(id);
  if (recipe) {
    const recipeDetailContent = document.getElementById('recipe-detail-content');

    const ingredientsList = recipe.ingredients.map(ingredient =>
      `<li>${ingredient}</li>`
    ).join('');

    recipeDetailContent.innerHTML = `
            <div class="recipe-detail">
                <div class="recipe-detail-header">
                    <h2 class="recipe-detail-title">${recipe.recipeName}</h2>
                    <div class="recipe-detail-meta">
                        <span><strong>Cuisine:</strong> ${recipe.cuisine}</span>
                        <span><strong>Cooking Time:</strong> ${recipe.cookingTime} minutes</span>
                        <span><strong>Difficulty:</strong> ${recipe.difficulty}</span>
                        <span><strong>Rating:</strong> ${recipe.averageRating || 'Not rated'}</span>
                    </div>
                </div>
                
                <div class="recipe-detail-section">
                    <h3>Description</h3>
                    <p>${recipe.description}</p>
                </div>
                
                <div class="recipe-detail-section">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list">
                        ${ingredientsList}
                    </ul>
                </div>
                
                <div class="recipe-actions">
                    <button class="btn primary edit-recipe" data-id="${recipe._id}">Edit Recipe</button>
                    <button class="btn secondary delete-recipe" data-id="${recipe._id}">Delete Recipe</button>
                </div>
            </div>
        `;

    // Add event listeners
    recipeDetailContent.querySelector('.edit-recipe').addEventListener('click', () => {
      closeModal(recipeModal);
      editRecipe(recipe._id);
    });

    recipeDetailContent.querySelector('.delete-recipe').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this recipe?')) {
        deleteRecipe(recipe._id).then(success => {
          if (success) {
            closeModal(recipeModal);
            loadAllRecipes();
            loadFeaturedRecipes();
          }
        });
      }
    });

    openModal(recipeModal);
  }
}

function editRecipe(id) {
  const recipe = recipes.find(r => r._id === id);
  if (recipe) {
    document.getElementById('recipe-form-title').textContent = 'Edit Recipe';
    document.getElementById('recipe-name').value = recipe.recipeName;
    document.getElementById('recipe-ingredients').value = recipe.ingredients.join('\n');
    document.getElementById('recipe-cooking-time').value = recipe.cookingTime;
    document.getElementById('recipe-difficulty').value = recipe.difficulty;
    document.getElementById('recipe-cuisine').value = recipe.cuisine;
    document.getElementById('recipe-description').value = recipe.description;
    document.getElementById('recipe-id').value = recipe._id;

    openModal(recipeFormModal);
  }
}

function addNewRecipe() {
  document.getElementById('recipe-form-title').textContent = 'Add New Recipe';
  document.getElementById('recipe-form').reset();
  document.getElementById('recipe-id').value = '';

  openModal(recipeFormModal);
}

// Create "Add Recipe" button
function createAddRecipeButton() {
  const addButton = document.createElement('div');
  addButton.className = 'add-recipe-btn';
  addButton.innerHTML = '+';
  addButton.title = 'Add New Recipe';
  addButton.addEventListener('click', addNewRecipe);
  document.body.appendChild(addButton);
}

// Form Submissions
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const result = await login(email, password);
  if (result && result.success) {
    currentUser = result.data;
    updateAuthUI();
    showSection(homeSection);
    homeLink.classList.add('active');
    loginForm.reset();
  } else {
    const errorMessage = result && result.message
      ? result.message
      : 'Login failed. Please check your credentials.';
    alert(errorMessage);
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  const result = await register(name, email, password);
  if (result && result.success) {
    alert('Registration successful! Please log in.');
    showSection(loginSection);
    loginLink.classList.add('active');
    registerForm.reset();
  } else {
    const errorMessage = result && result.message
      ? result.message
      : 'Registration failed. Please try again.';
    alert(errorMessage);
  }
});

recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipeId = document.getElementById('recipe-id').value;
  const recipeName = document.getElementById('recipe-name').value;
  const ingredients = document.getElementById('recipe-ingredients').value.split('\n').filter(i => i.trim() !== '');
  const cookingTime = parseInt(document.getElementById('recipe-cooking-time').value);
  const difficulty = document.getElementById('recipe-difficulty').value;
  const cuisine = document.getElementById('recipe-cuisine').value;
  const description = document.getElementById('recipe-description').value;

  const recipeData = {
    recipeName,
    ingredients,
    cookingTime,
    difficulty,
    cuisine,
    description
  };

  let result;
  if (recipeId) {
    // Update existing recipe
    result = await updateRecipe(recipeId, recipeData);
  } else {
    // Create new recipe
    result = await createRecipe(recipeData);
  }

  if (result) {
    closeModal(recipeFormModal);
    loadAllRecipes();
    loadFeaturedRecipes();
    recipeForm.reset();
  } else {
    alert('Failed to save recipe. Please try again.');
  }
});

// Search and Filter
searchRecipes.addEventListener('input', filterRecipesList);
filterDifficulty.addEventListener('change', filterRecipesList);
filterCuisine.addEventListener('change', filterRecipesList);

function filterRecipesList() {
  const searchTerm = searchRecipes.value.toLowerCase();
  const difficultyFilter = filterDifficulty.value;
  const cuisineFilter = filterCuisine.value;

  filteredRecipes = recipes.filter(recipe => {
    // Search term filter
    const matchesSearch = recipe.recipeName.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm);

    // Difficulty filter
    const matchesDifficulty = difficultyFilter === '' || recipe.difficulty === difficultyFilter;

    // Cuisine filter
    const matchesCuisine = cuisineFilter === '' || recipe.cuisine === cuisineFilter;

    return matchesSearch && matchesDifficulty && matchesCuisine;
  });

  currentPage = 1;
  renderRecipes();
}

// Update UI based on auth state
function updateAuthUI() {
  if (currentUser) {
    loginLink.textContent = 'Logout';
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentUser = null;
      updateAuthUI();
      showSection(homeSection);
      homeLink.classList.add('active');
    });
    registerLink.style.display = 'none';

    // Show add recipe button
    if (!document.querySelector('.add-recipe-btn')) {
      createAddRecipeButton();
    }
  } else {
    loginLink.textContent = 'Login';
    registerLink.style.display = 'block';

    // Remove add recipe button
    const addButton = document.querySelector('.add-recipe-btn');
    if (addButton) {
      addButton.remove();
    }
  }
}

// Initialize the application
function init() {
  // Show home section by default
  showSection(homeSection);
  homeLink.classList.add('active');

  // Load recipes
  loadFeaturedRecipes();

  // Update UI based on auth state
  updateAuthUI();
}

// Start the application
init(); 