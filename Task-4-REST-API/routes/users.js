const express = require('express');
const router = express.Router();

// In-memory database (array to store users)
let users = [
  { id: 1, name: 'Prathamesh Chaumwal', email: 'prathameshchaumwal123@gmail.com', age: 20 },
  { id: 2, name: 'Micheal Kaiser', email: 'kaisermicheal@gmail.com', age: 20 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', age: 19 }
];

// Helper function to generate new ID
const generateId = () => {
  return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
};

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
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// GET /users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: `No user found with ID: ${id}`
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// POST /users - Create new user
router.post('/', (req, res) => {
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
  const emailExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({
      success: false,
      error: 'Email already exists',
      message: 'A user with this email already exists'
    });
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age: parseInt(age)
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// PUT /users/:id - Update user by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, age } = req.body;

  // Find user
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: `No user found with ID: ${id}`
    });
  }

  // Validate input
  const errors = validateUser(name, email, age);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // Check if email already exists (excluding current user)
  const emailExists = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.id !== id
  );
  if (emailExists) {
    return res.status(400).json({
      success: false,
      error: 'Email already exists',
      message: 'Another user with this email already exists'
    });
  }

  // Update user
  users[userIndex] = {
    id: id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age: parseInt(age)
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

// DELETE /users/:id - Delete user by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: `No user found with ID: ${id}`
    });
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;