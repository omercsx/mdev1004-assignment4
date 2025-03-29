/**
 * @author: Omer Cagri Sayir 200597579
 * @date: 2025-03-29
 */

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Import routes
const recipeRoutes = require('./src/routes/recipeRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Enable CORS for all requests
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to database
connectDB();

// Use routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API accessible at http://localhost:${port}/api`);
});