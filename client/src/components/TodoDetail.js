import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import EditTodoModal from './EditTodoModal';

const TodoDetail = ({ onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { todos, getTodo } = useTodoContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('Todo ID is required');
      setLoading(false);
      return;
    }

    const fetchTodo = async () => {
      try {
        const data = await getTodo(id);
        setTodo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check if todo exists in the current context
    const existingTodo = todos.find(t => t._id === id);
    
    // If todo doesn't exist in context, fetch from server
    if (!existingTodo) {
      fetchTodo();
    } else {
      setTodo(existingTodo);
      setLoading(false);
    }
  }, [id, getTodo, todos]);

  useEffect(() => {
    // If todo is deleted and no longer exists in context
    if (!loading && todos && !todos.find(t => t._id === id)) {
      setTimeout(() => {
        navigate('/', { state: { message: 'Todo was deleted' } });
      }, 20);
    }
  }, [todos, id, loading, navigate]);

  // const navigate = useNavigate(); // Reserved for future navigation needs

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.includes('required') ? 'Invalid todo ID' : error}</div>;
  if (!todo) return <div>Todo not found, redirecting...</div>;

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className="todo-detail">
      <div className="todo-header">
        <h1>{todo.title}</h1>
        <button onClick={handleEdit} className="btn-edit">
          Edit
        </button>
      </div>
      {showEditModal && (
        <EditTodoModal 
          todo={todo} 
          onClose={handleCloseModal} 
          onUpdate={onUpdate}
        />
      )}
      <p className="description">{todo.description}</p>
      <div className="todo-info">
        <div className="meta">
          <span className={`priority ${todo.priority.toLowerCase()}`}>
            Priority: {todo.priority}
          </span>
          <span className="created-date">
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
        {todo.tags && (
          <div className="tags">
            Tags:
            {todo.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;
