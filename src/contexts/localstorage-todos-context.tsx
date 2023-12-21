"use client";

import React, { createContext, useContext, useState } from "react";

export type Todo = {
   id: string;
   title: string;
   is_done: boolean;
};

type TodosContextType = {
   localStorageTodos: Todo[];
   setLocalStorageTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodosContext = createContext<TodosContextType>({} as TodosContextType);

export const LocalStorageTodosProvider = ({
   children,
}: React.PropsWithChildren) => {
   const [localStorageTodos, setLocalStorageTodos] = useState<Todo[]>([]);

   return (
      <TodosContext.Provider
         value={{ localStorageTodos, setLocalStorageTodos }}
      >
         {children}
      </TodosContext.Provider>
   );
};

export function useTodos() {
   const context = useContext(TodosContext);

   return context;
}
