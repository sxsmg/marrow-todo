import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import TodoDetail from './TodoDetail';

const TodoDetailWrapper = () => {
  const { refreshTodos } = useTodoContext();

  const handleUpdate = () => {
    refreshTodos();
  };

  return <TodoDetail onUpdate={handleUpdate} />;
};

export default TodoDetailWrapper;
