import React from 'react';
import { Link } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos, loading, error, pagination, changePage, changeFilter, changeSort } = useTodoContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h1>My Todos</h1>
        <div className="controls">
          <div className="filters">
            <select
              onChange={(e) => changeFilter('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="text"
              placeholder="Filter by tags (comma separated)"
              onChange={(e) => changeFilter('tags', e.target.value)}
            />
          </div>
          <div className="sorting">
            <select
              onChange={(e) => changeSort(e.target.value)}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="priority:desc">High Priority First</option>
              <option value="priority:asc">Low Priority First</option>
            </select>
          </div>
          <Link to="/todos/new" className="btn-new-todo">
            + New Todo
          </Link>
        </div>
      </div>
      {todos.length > 0 ? (
        <>
          <ul className="todo-items">
            {todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No todos found. Add one to get started!</p>
      )}
    </div>
  );
};

export default TodoList;
