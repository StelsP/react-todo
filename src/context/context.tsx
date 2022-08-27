import React, { createContext, FC, FormEventHandler, useContext, useEffect, useState } from 'react';
import { IData, IDataProvider, ITodo } from './types';
import useSavedTodosHook from './useSavedTodosHook';

const Data = createContext<IData | null>(null);

export const useData = () => {
  return useContext(Data);
};

const DataProvider: FC<IDataProvider> = ({ children }) => {
  const { todos, setTodos } = useSavedTodosHook();
  const [currentTodo, setCurrentTodo] = useState<ITodo | null>(null);

  useEffect(() => {
    if (todos.length === 0) {
      setCurrentTodo(null);
    }
  }, [todos]);

  const createTodo = () => {
    return {
      title: 'new todo',
      body: '',
      id: Date.now(),
      status: 'waiting'
    };
  };
  const handleAddFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setTodos([createTodo(), ...todos]);
  };

  const handleDeleteClick = (id: number) => {
    setTodos(todos.filter((el) => el.id !== id));
  };

  const handleSetCurrentTodo = (id: number) => {
    const todo = todos.find((el) => el.id === id);
    if (!todo) return null;
    setCurrentTodo(todo);
  };

  const handleEditTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!currentTodo) return null;
    setCurrentTodo({ ...currentTodo, title: e.target.value });
  };

  const handleEditBodyChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (!currentTodo) return null;
    setCurrentTodo({ ...currentTodo, body: e.target.value });
  };

  const handleStatusChange = (status: string) => {
    if (!currentTodo) return null;
    setCurrentTodo({ ...currentTodo, status });
  };

  const handleEditSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setTodos(todos.map((el) => (el.id === currentTodo?.id ? currentTodo : el)));
  };

  return (
    <Data.Provider
      value={{
        todos,
        currentTodo,
        handleAddFormSubmit,
        handleDeleteClick,
        handleSetCurrentTodo,
        handleEditTitleChange,
        handleEditBodyChange,
        handleEditSubmit,
        handleStatusChange
      }}
    >
      {children}
    </Data.Provider>
  );
};

export default DataProvider;
