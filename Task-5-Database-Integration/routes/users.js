const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate user data
const validateUser = (name, email, age) => {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!age) {
    errors.push('Age is required');
  } else if (isNaN(age) || age < 1 || age > 150) {
    errors.push('Age must be a number between 1 and 150');
  }

  return errors;
};

// GET /users - Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: 'Failed to fetch users'
    });
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: 'Failed to fetch user'
    });
  }
});

// POST /users - Create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validate input
    const errors = validateUser(name, email, age);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'A user with this email already exists'
      });
    }

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), parseInt(age)]
    );

    // Fetch the newly created user
    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: 'Failed to create user'
    });
  }
});

// PUT /users/:id - Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    // Validate input
    const errors = validateUser(name, email, age);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with ID: ${id}`
      });
    }

    // Check if email already exists (excluding current user)
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email.toLowerCase(), id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'Another user with this email already exists'
      });
    }

    // Update user
    await pool.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name.trim(), email.trim().toLowerCase(), parseInt(age), id]
    );

    // Fetch updated user
    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: 'Failed to update user'
    });
  }
});

// DELETE /users/:id - Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with ID: ${id}`
      });
    }

    const deletedUser = users[0];

    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: 'Failed to delete user'
    });
  }
});

module.exports = router;