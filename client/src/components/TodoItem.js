import React from 'react';
import { Link } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const { deleteTodo } = useTodoContext();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo._id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };
  return (
    <li className="todo-item">
      <div className="todo-content">
        {/* <button onClick={handleDelete} className="btn-delete">
          Delete
        </button> */}
        <h3>
          <Link to={`/todos/${todo._id}`}>{todo.title}</Link>
        </h3>
        <p>{todo.description}</p>
        <div className="todo-meta">
          <span className={`priority ${todo.priority.toLowerCase()}`}>
            {todo.priority}
          </span>
          {todo.tags && (
            <div className="tags">
              {todo.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
