import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';
import TodoForm from './components/TodoForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TodoProvider>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
              <Route path="/todos/new" element={<ProtectedRoute><TodoForm /></ProtectedRoute>} />
              <Route path="/todos/:id/edit" element={<ProtectedRoute><TodoForm /></ProtectedRoute>} />
              <Route path="/todos/:id" element={<ProtectedRoute><TodoDetail /></ProtectedRoute>} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </div>
        </TodoProvider>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Wait for authentication check to complete
  if (user === null && localStorage.getItem('token')) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
