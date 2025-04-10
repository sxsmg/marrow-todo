import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/todos`;

const getTodos = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    params: {
      page,
      limit
    },
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

const todoService = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
};

export default todoService;
