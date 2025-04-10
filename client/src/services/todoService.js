import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api/todos' 
  : '/api/todos';

const getTodos = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getTodo = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const createTodo = async (todoData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, todoData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateTodo = async (id, todoData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/${id}`, todoData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const deleteTodo = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
};
