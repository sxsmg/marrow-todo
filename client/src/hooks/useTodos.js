import { useState, useEffect } from 'react';
import todoService from '../services/todoService';
import { useAuth } from '../context/AuthContext';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const fetchTodos = async () => {
    if (!isAuthenticated || !user) {
      setTodos([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  const createTodo = async (todoData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      throw err;
    }
  };

  const updateTodo = async (id, todoData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      setTodos(prev =>
        prev.map(todo => todo._id === id ? updatedTodo : todo)
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      throw err;
    }
  };

  const getTodo = async (id) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const data = await todoService.getTodo(id);
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodo,
    refreshTodos: fetchTodos
  };
};

export default useTodos;
