import React from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onClick, onToggle }) => {
  const handleToggleClick = (e) => {
    e.stopPropagation(); // Prevent triggering onClick when clicking the status button
    onToggle();
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate < today;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      
      <div className="todo-item-content" onClick={onClick}>
        <div className="todo-header">
          <img style={{width:"30px", height:"30px"}} src="/icon.jpg" alt="App Icon" />
          <h3 className="todo-title">{todo.title}</h3>
          <button 
            className={`status-icon ${todo.completed ? 'completed' : 'pending'}`}
            onClick={handleToggleClick}
            aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {todo.completed ? '✓' : '○'}
          </button>
        </div>
        <div className="todo-meta">
          <span className="due-date">
            Due: {formatDate(todo.dueDate)}
            {isOverdue() && <span className="overdue-text"> (Overdue)</span>}
          </span>
          <span className="click-hint">Click to view details</span>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;