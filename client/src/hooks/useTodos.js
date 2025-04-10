import { useState, useEffect } from 'react';
import todoService from '../services/todoService';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      throw err;
    }
  };

  const updateTodo = async (id, todoData) => {
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
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const getTodo = async (id) => {
    if (!id) {
      throw new Error('Todo ID is required');
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
