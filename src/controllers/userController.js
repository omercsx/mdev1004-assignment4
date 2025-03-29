/**
 * @author: Gurpreet Kaur
 * @date: 2025-03-29
 */

const User = require("../model/User");

const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Simple validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields"
        });
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password, // Note: In a real app, you should hash this password
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Simple validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password"
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Simple password check (Note: In a real app, you should compare hashed passwords)
      if (password !== user.password) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      res.json({
        success: true,
        message: "Login successful",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error logging in",
        error: error.message
      });
    }
  },

  // Logout user (simple implementation)
  logout: async (req, res) => {
    try {
      // In a real implementation, you might handle tokens or sessions
      res.json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error logging out",
        error: error.message
      });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).select("-password");
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching users",
        error: error.message
      });
    }
  }
};

module.exports = userController;