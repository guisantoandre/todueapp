"use client";

import React from "react";

import { Tooltip } from "./tooltip";
import { Todo } from "@/contexts/localstorage-todos-context";
import { SelectedPick } from "@xata.io/client";
import { TodosRecord } from "@/lib/xata";
import { updateTodoIsDone } from "@/actions/actions";
import { useOrderedTodos } from "@/contexts/localstorage-ordered-todos-context";

type Props = React.ComponentProps<"input"> & {
   isAuthenticated: boolean;
   todo: Todo | SelectedPick<TodosRecord, "*"[]>;
};

export function InputCheckbox({ isAuthenticated, todo }: Props) {
   const { localStorageOrderedTodos, setLocalStorageOrderedTodos } =
      useOrderedTodos();

   function updateTodoIsDoneAtLocalStorageOrderedTodos(
      id: string,
      is_done: boolean
   ) {
      if (localStorage.getItem("orderedTodos")) {
         const listOrderedTodos = [...localStorageOrderedTodos];
         const index = listOrderedTodos.findIndex(
            (item) => item.id === todo.id
         );
         listOrderedTodos[index].is_done = !listOrderedTodos[index].is_done;

         localStorage.setItem("orderedTodos", JSON.stringify(listOrderedTodos));

         setLocalStorageOrderedTodos(listOrderedTodos);
      }
   }

   return (
      <>
         {isAuthenticated ? (
            <input
               type="checkbox"
               id={todo.id}
               checked={todo.is_done}
               onChange={() =>
                  updateTodoIsDone(todo.id, todo.is_done).then(() => {
                     updateTodoIsDoneAtLocalStorageOrderedTodos(
                        todo.id,
                        todo.is_done
                     );
                  })
               }
               className="cursor-pointer w-4 h-4 bg-slate-600 rounded focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
            />
         ) : (
            <Tooltip
               text="You must be logged in to check a task."
               className="left-0"
            >
               <input
                  type="checkbox"
                  id={todo.id}
                  className="opacity-30 pointer-events-none cursor-pointer w-4 h-4 bg-slate-600 rounded focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
               />
            </Tooltip>
         )}
      </>
   );
}
