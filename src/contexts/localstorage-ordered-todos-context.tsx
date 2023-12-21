"use client";

import React, { createContext, useContext, useState } from "react";

import { TodosRecord } from "@/lib/xata";
import { SelectedPick } from "@xata.io/client";

export type Todo = {
   id: string;
   title: string;
   is_done: boolean;
};

type TodosContextType = {
   localStorageOrderedTodos: SelectedPick<TodosRecord, "*"[]>[];
   setLocalStorageOrderedTodos: React.Dispatch<
      React.SetStateAction<SelectedPick<TodosRecord, "*"[]>>[]
   >;
};

const TodosContext = createContext<TodosContextType>({} as TodosContextType);

export const LocalStorageOrderedTodosProvider = ({
   children,
}: React.PropsWithChildren) => {
   const [localStorageOrderedTodos, setLocalStorageOrderedTodos] = useState(
      typeof window !== "undefined" && localStorage.getItem("orderedTodos")
         ? JSON.parse(localStorage.getItem("orderedTodos")!)
         : []
   );

   return (
      <TodosContext.Provider
         value={{ localStorageOrderedTodos, setLocalStorageOrderedTodos }}
      >
         {children}
      </TodosContext.Provider>
   );
};

export function useOrderedTodos() {
   const context = useContext(TodosContext);

   return context;
}
