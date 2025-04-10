import React, { useState } from 'react';
import axios from 'axios';
import { useTodoContext } from '../context/TodoContext';
import { useAuth } from '../context/AuthContext';
import './EditTodoModal.css';

const EditTodoModal = ({ todo, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    tags: todo.tags?.join(', ') || '',
    notes: todo.notes || ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateTodo, deleteTodo } = useTodoContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setMentionQuery = (query) => {
    // This function is used implicitly in handleTagInput
  };
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const { user: currentUser } = useAuth();

  const fetchMentionSuggestions = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        params: {
          search: query,
          exclude: currentUser._id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMentionSuggestions(response.data);
    } catch (err) {
      console.error('Error fetching mention suggestions:', err);
    }
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      tags: value
    }));

    // Handle user mention suggestions
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const query = value.slice(atIndex + 1);
      setMentionQuery(query);
      fetchMentionSuggestions(query);
    } else {
      setMentionQuery('');
      setMentionSuggestions([]);
    }
  };

  const handleSelectMention = (username) => {
    const tags = formData.tags.split(',');
    const lastTag = tags[tags.length - 1];
    const atIndex = lastTag.lastIndexOf('@');
    const newTag = lastTag.slice(0, atIndex + 1) + username;
    tags[tags.length - 1] = newTag;
    
    setFormData(prev => ({
      ...prev,
      tags: tags.join(',')
    }));
    setMentionQuery('');
    setMentionSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedTodo = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await updateTodo(todo._id, updatedTodo);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Todo</h2>
        <form onSubmit={handleSubmit}>
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
            <label>Tags (comma separated, use @ to mention users)</label>
            <div className="tags-input-container">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleTagInput}
              />
              {mentionSuggestions.length > 0 && (
                <div className="mention-suggestions">
                  {mentionSuggestions.map(user => (
                    <div
                      key={user._id}
                      className="suggestion-item"
                      onClick={() => handleSelectMention(user.username)}
                    >
                      {user.username}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-delete"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this todo?')) {
                  try {
                    await deleteTodo(todo._id);
                    onUpdate();
                    onClose();
                  } catch (err) {
                    setError(err.message);
                  }
                }
              }}
              disabled={isSubmitting}
            >
              Delete
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
