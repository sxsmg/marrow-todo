import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';

const TodoDetail = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getTodo } = useTodoContext();

  useEffect(() => {
    console.log('Todo ID:', id); // Log the ID
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

    fetchTodo();
  }, [id, getTodo]);

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.includes('required') ? 'Invalid todo ID' : error}</div>;
  if (!todo) return <div>Todo not found</div>;

  const handleEdit = () => {
    navigate(`/todos/${todo._id}/edit`);
  };

  return (
    <div className="todo-detail">
      <div className="todo-header">
        <h1>{todo.title}</h1>
        <button onClick={handleEdit} className="btn-edit">
          Edit
        </button>
      </div>
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
