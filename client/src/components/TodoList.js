import React from 'react';
import { Link } from 'react-router-dom';
import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos, loading, error } = useTodoContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h1>My Todos</h1>
        <Link to="/todos/new" className="btn-new-todo">
          + New Todo
        </Link>
      </div>
      {todos.length > 0 ? (
        <ul className="todo-items">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </ul>
      ) : (
        <p>No todos found. Add one to get started!</p>
      )}
    </div>
  );
};

export default TodoList;
