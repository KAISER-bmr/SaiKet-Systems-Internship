const express = require('express');
const { testConnection } = require('./config/database');
const usersRouter = require('./routes/users');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to User Management API with MySQL Database',
    version: '2.0.0',
    database: 'MySQL',
    endpoints: {
      'GET /users': 'Get all users',
      'GET /users/:id': 'Get user by ID',
      'POST /users': 'Create new user',
      'PUT /users/:id': 'Update user by ID',
      'DELETE /users/:id': 'Delete user by ID'
    },
    author: 'Prathamesh Chaumwal',
    internship: 'SaiKet Systems - Task 5: Database Integration'
  });
});

// Use users routes
app.use('/users', usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    await testConnection();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 REST API Server Running with MySQL!                 ║
║                                                           ║
║   📍 Server: http://localhost:${PORT}                     ║
║   📚 API Docs: http://localhost:${PORT}/                  ║
║   👤 Users Endpoint: http://localhost:${PORT}/users       ║
║                                                           ║
║   🗄️  Database: MySQL Connected ✅                         ║
║   💾 Persistent Storage: Enabled                         ║
║                                                           ║
║   💻 Task 5: Database Integration                        ║
║   🏢 SaiKet Systems Internship                           ║
║   👨‍💻 Developer: Prathamesh Chaumwal                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
      console.log('✅ Press Ctrl+C to stop the server\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();