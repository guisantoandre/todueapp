"use client";

import React from "react";
import { Session } from "next-auth";

import { Tooltip } from "./tooltip";
import { Todo } from "@/contexts/localstorage-todos-context";
import { TodosRecord } from "@/lib/xata";
import { updateTodoIsDone } from "@/actions/actions";
import { useOrderedTodos } from "@/contexts/localstorage-ordered-todos-context";

type Props = React.ComponentProps<"input"> & {
   isAuthenticated: boolean;
   todo: Todo | TodosRecord;
   session?: Session | null;
};

export function InputCheckbox({ isAuthenticated, todo, session }: Props) {
   const { localStorageOrderedTodos, setLocalStorageOrderedTodos } =
      useOrderedTodos();
   const userName = session?.user?.email?.split("@")[0];

   function updateTodoIsDoneAtLocalStorageOrderedTodos(
      id: string,
      is_done: boolean
   ) {
      if (localStorage.getItem(`orderedTodos_${userName}`)) {
         const listOrderedTodos = [...localStorageOrderedTodos];
         const index = listOrderedTodos.findIndex(
            (item) => item.id === todo.id
         );
         listOrderedTodos[index].is_done = !listOrderedTodos[index].is_done;

         localStorage.setItem(
            `orderedTodos_${userName}`,
            JSON.stringify(listOrderedTodos)
         );

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
               className="appearance-none cursor-pointer bg-slate-700 w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark focus:ring-bg-btn checked:bg-bg-btn checked:text-bg-btn"
            />
         ) : (
            <Tooltip
               text="You must be logged in to check a task."
               className="left-0"
            >
               <input
                  type="checkbox"
                  id={todo.id}
                  className="opacity-30 pointer-events-none cursor-pointer w-4 h-4 bg-slate-600 rounded"
               />
            </Tooltip>
         )}
      </>
   );
}
