import React from 'react';
import './TodoDetails.css';

const TodoDetails = ({ todo, onClose, onToggle }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate < today;
  };

  const getDaysUntilDue = () => {
    if (!todo.dueDate) return null;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <div className="todo-details-overlay" onClick={onClose}>
      <div className="todo-details" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <h2>{todo.title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close details">
            ×
          </button>
        </div>
        
        <div className="details-content">
          <div className="status-section">
            <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
              {todo.completed ? '✓ Completed' : '○ Pending'}
            </span>
            {isOverdue() && <span className="overdue-badge">Overdue</span>}
          </div>
          
          <div className="description-section">
            <h3>Description</h3>
            <p>{todo.description || 'No description available'}</p>
          </div>
          
          <div className="date-section">
            <h3>Due Date</h3>
            <p className="due-date-detail">
              {formatDate(todo.dueDate)}
            </p>
            <p className="days-remaining">
              {getDaysUntilDue()}
            </p>
          </div>
          
          <div className="meta-section">
            <p><strong>Task ID:</strong> {todo.id}</p>
            <p><strong>User ID:</strong> {todo.userId}</p>
          </div>
        </div>
        
        <div className="details-actions">
          <button 
            className={`toggle-button ${todo.completed ? 'mark-pending' : 'mark-completed'}`}
            onClick={onToggle}
          >
            {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;