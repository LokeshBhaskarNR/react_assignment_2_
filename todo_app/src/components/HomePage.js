import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Button, Flex } from 'antd';

const HomePage = () => {
  const navigate = useNavigate();

  const goToTodos = () => {
    navigate('/todos');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Todo App</h1>
        <p className="home-description">
          Manage your tasks efficiently and stay organized with our simple and intuitive todo application.
        </p>
        <Button onClick={goToTodos} type="primary">Go to Todo List</Button>

      </div>
    </div>
  );
};

export default HomePage;