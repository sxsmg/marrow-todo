import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';

const TodoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    tags: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const { getTodo } = useTodoContext();

  useEffect(() => {
    if (id) {
      const fetchTodo = async () => {
        try {
          const todo = await getTodo(id);
          setFormData({
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
            tags: todo.tags?.join(', ') || ''
          });
          setIsEditMode(true);
        } catch (error) {
          console.error('Error fetching todo:', error);
        }
      };
      fetchTodo();
    }
  }, [id, getTodo]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { createTodo, updateTodo, refreshTodos } = useTodoContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (isEditMode) {
        await updateTodo(id, data);
      } else {
        await createTodo(data);
        // Refresh todos after creation
        await refreshTodos();
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label>Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default TodoForm;
