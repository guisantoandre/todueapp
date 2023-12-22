"use client";

import React, { createContext, useContext, useState } from "react";

import { TodosRecord } from "@/lib/xata";
import { SelectedPick } from "@xata.io/client";
import { Session } from "next-auth";

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
   session,
}: {
   children: React.ReactNode;
   session: Session | null;
}) => {
   let userName = session?.user?.email?.split("@")[0];
   const [localStorageOrderedTodos, setLocalStorageOrderedTodos] = useState(
      typeof window !== "undefined" &&
         localStorage.getItem(`orderedTodos_${userName}`)
         ? JSON.parse(localStorage.getItem(`orderedTodos_${userName}`)!)
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
