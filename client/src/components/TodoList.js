import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const timeoutRef = useRef(null);
  const context = useTodoContext();

  const {
    todos,
    loading,
    error,
    pagination,
    changePage,
    changeFilter,
    changeSort,
    resetFilters,
    filters,
    sort,
    refreshTodos
  } = context;

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
              onChange={(e) => changeFilter('priority', e.target.value || undefined)}
              value={filters.priority || ''}
            >
              <option value="">All Priorities</option>
              <option value="High">High (Highest)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low (Lowest)</option>
            </select>
            <button
              className="btn-reset"
              onClick={() => {
                resetFilters();
                refreshTodos(1, 10, {}, sort);
              }}
              disabled={Object.keys(filters).length === 0}
            >
              Reset Filters
            </button>
            <input
              type="text"
              placeholder="Filter by tags (comma separated)"
              onChange={(e) => {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                  changeFilter('tags', e.target.value.trim().toLowerCase());
                }, 300);
              }}
            />
          </div>
          <div className="sorting">
            <select
              value={sort}
              onChange={(e) => {
                const newSort = e.target.value;
                if (sort !== newSort) {
                  changeSort(newSort);
                }
              }}
              key={sort} // Force re-render when sort changes
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              {/* <option value="priority:desc">High Priority First</option>
              <option value="priority:asc">Low Priority First</option> */}
            </select>
          </div>
          <div className="export-container">
            <button 
              className="btn-export"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:5000/api/todos/export', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  
                  if (!response.ok) throw new Error('Export failed');
                  
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'todos.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (error) {
                  console.error('Export error:', error);
                }
              }}
            >
              Export to Excel
            </button>
            <Link to="/todos/new" className="btn-new-todo">
              + New Todo
            </Link>
          </div>
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
