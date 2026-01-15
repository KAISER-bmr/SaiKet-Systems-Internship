const express = require('express');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to User Management API',
    version: '1.0.0',
    endpoints: {
      'GET /users': 'Get all users',
      'GET /users/:id': 'Get user by ID',
      'POST /users': 'Create new user',
      'PUT /users/:id': 'Update user by ID',
      'DELETE /users/:id': 'Delete user by ID'
    },
    author: 'Prathamesh Chaumwal',
    internship: 'SaiKet Systems - Task 4'
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
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 REST API Server Running!                            ║
║                                                           ║
║   📍 Server: http://localhost:${PORT}                       ║
║   📚 API Docs: http://localhost:${PORT}/                    ║
║   👤 Users Endpoint: http://localhost:${PORT}/users         ║
║                                                           ║
║   💻 Task 4: REST API Development                        ║
║   🏢 SaiKet Systems Internship                           ║
║   👨‍💻 Developer: Prathamesh Chaumwal                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log('✅ Press Ctrl+C to stop the server\n');
});