import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';
import TodoForm from './components/TodoForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <TodoProvider>
        <div className="app-container">
          <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />}
          />
          <Route
            path="/todos/new"
            element={isAuthenticated ? <TodoForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/todos/:id/edit"
            element={isAuthenticated ? <TodoForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/todos/:id"
            element={isAuthenticated ? <TodoDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginForm setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterForm setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
          />
          </Routes>
        </div>
      </TodoProvider>
    </Router>
  );
}

export default App;
