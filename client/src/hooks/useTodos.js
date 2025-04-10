import { useState, useEffect, useCallback } from 'react';
import todoService from '../services/todoService';
import { useAuth } from '../context/AuthContext';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalTodos: 0
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('createdAt:desc');

  const fetchTodos = useCallback(async (page = 1, limit = 10, filters = {}, sort = 'createdAt:desc') => {
    if (!isAuthenticated || !user) {
      setTodos([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { todos, page: currentPage, totalPages, totalTodos } = await todoService.getTodos({
        page,
        limit,
        filters,
        sort
      });
      setTodos(todos);
      setPagination({
        page: currentPage,
        totalPages,
        totalTodos
      });
    } catch (err) {
      setError(err.message);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTodos(newPage);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated, fetchTodos]);

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

  const changeFilter = (type, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[type] = value;
      } else {
        delete newFilters[type];
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({});
  };

  const changeSort = useCallback((newSort) => {
    setSort(newSort);
    fetchTodos(pagination.page, 10, filters, newSort);
  }, [fetchTodos, pagination.page, filters]);

  useEffect(() => {
    fetchTodos(pagination.page, 10, filters, sort);
  }, [fetchTodos, pagination.page, filters, sort]);

  return {
    todos,
    loading,
    error,
    pagination,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodo,
    refreshTodos: fetchTodos,
    changePage,
    changeFilter,
    changeSort,
    resetFilters,
    filters,
    sort
  };
};

export default useTodos;
