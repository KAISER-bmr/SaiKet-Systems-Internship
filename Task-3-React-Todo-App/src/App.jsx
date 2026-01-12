import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  // Add new task
  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task!')
      return
    }

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleString()
    }

    setTasks([...tasks, newTask])
    setInputValue('')
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // Start editing
  const startEdit = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  // Save edit
  const saveEdit = (id) => {
    if (editingText.trim() === '') {
      alert('Task cannot be empty!')
      return
    }

    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editingText } : task
    ))
    setEditingId(null)
    setEditingText('')
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  // Task statistics
  const totalTasks = tasks.length
  const activeTasks = tasks.filter(task => !task.completed).length
  const completedTasks = tasks.filter(task => task.completed).length

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="title">
            <span className="icon">✓</span>
            My To-Do List
          </h1>
          <p className="subtitle">Stay organized and productive</p>
        </header>

        {/* Statistics */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card active">
            <div className="stat-number">{activeTasks}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="add-btn" onClick={addTask}>
            <span>+</span> Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Tasks List */}
        <div className="tasks-section">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">
                {filter === 'all' && 'No tasks yet. Add one to get started!'}
                {filter === 'active' && 'No active tasks. Great job!'}
                {filter === 'completed' && 'No completed tasks yet.'}
              </p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  {editingId === task.id ? (
                    // Edit Mode
                    <div className="edit-mode">
                      <input
                        type="text"
                        className="edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button className="save-btn" onClick={() => saveEdit(task.id)}>
                          ✓
                        </button>
                        <button className="cancel-btn" onClick={cancelEdit}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="task-content">
                        <input
                          type="checkbox"
                          className="task-checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task.id)}
                        />
                        <div className="task-text-container">
                          <span className="task-text">{task.text}</span>
                          <span className="task-date">{task.createdAt}</span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => startEdit(task.id, task.text)}
                          disabled={task.completed}
                        >
                          ✎
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteTask(task.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Created for SaiKet Systems Internship - Task 3</p>
          <p className="footer-tip">💡 Tip: Click on a task to mark it as complete</p>
        </footer>
      </div>
    </div>
  )
}

export default App