"use client";

import React, { createContext, useContext, useState } from "react";

export type Todo = {
   id: string;
   title: string;
   is_done: boolean;
};

type TodosContextType = {
   todos: Todo[];
   setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodosContext = createContext<TodosContextType>({} as TodosContextType);

export const TodosProvider = ({ children }: React.PropsWithChildren) => {
   const [todos, setTodos] = useState<Todo[]>([]);

   return (
      <TodosContext.Provider value={{ todos, setTodos }}>
         {children}
      </TodosContext.Provider>
   );
};

export function useTodos() {
   const context = useContext(TodosContext);

   return context;
}
