import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoItem from './TodoItem';
import TodoDetails from './TodoDetails';
import './TodoPage.css';
import { Button } from 'antd';

const TodoPage = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/todos.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array');
        }
        
        const validTodos = data.filter(todo => {
          return todo && 
                 typeof todo.id !== 'undefined' && 
                 typeof todo.title === 'string' && 
                 typeof todo.completed === 'boolean';
        });
        
        if (validTodos.length === 0) {
          throw new Error('No valid todos found in the data');
        }
        
        setTodos(validTodos);
      } catch (err) {
        console.error('Error loading todos:', err);
        setError(`Failed to load todos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const toggleTodoCompletion = (id) => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      
      if (selectedTodo && selectedTodo.id === id) {
        setSelectedTodo(prev => ({ ...prev, completed: !prev.completed }));
      }
    } catch (err) {
      setError('Failed to update todo status');
    }
  };

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
  };

  const closeDetails = () => {
    setSelectedTodo(null);
  };

  const getFilteredTodos = () => {
    try {
      switch (filter) {
        case 'completed':
          return todos.filter(todo => todo.completed);
        case 'pending':
          return todos.filter(todo => !todo.completed);
        case 'all':
        default:
          return todos;
      }
    } catch (err) {
      setError('Failed to filter todos');
      return [];
    }
  };

  const goHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="todo-container">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-container">
        <div className="error">
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()}>Retry</button>
            <button onClick={goHome} className="secondary">Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todo-container">
      <header className="todo-header">

        <Button onClick={goHome} type="primary">← Back to Home</Button>
        <h1>Todo List</h1>
        <div className="todo-stats">
          <span>Total: {todos.length}</span>
          <span>Completed: {completedCount}</span>
          <span>Pending: {pendingCount}</span>
        </div>
      </header>

      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Tasks ({todos.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="todo-content">
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="no-todos">
              {filter === 'all' ? 'No todos available' : 
               filter === 'pending' ? 'No pending todos' : 'No completed todos'}
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onClick={() => handleTodoClick(todo)}
                onToggle={() => toggleTodoCompletion(todo.id)}
              />
            ))
          )}
        </div>
        
        {selectedTodo && (
          <TodoDetails
            todo={selectedTodo}
            onClose={closeDetails}
            onToggle={() => toggleTodoCompletion(selectedTodo.id)}
          />
        )}
      </div>
    </div>
  );
};

export default TodoPage;