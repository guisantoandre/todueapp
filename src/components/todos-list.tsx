"use client";

import { Pencil, Trash2 } from "lucide-react";

import { SelectedPick } from "@xata.io/client";
import { TodosRecord } from "@/lib/xata";
import {
   deleteTodo,
   updateTodoIsDone,
   updateTodoTitle,
} from "@/actions/actions";
import { Session } from "next-auth";
import { Tooltip } from "./tooltip";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Todo, useTodos } from "@/contexts/todos-context";

type Props = {
   todosList:
      | SelectedPick<TodosRecord, ("title" | "id" | "is_done")[]>[]
      | Todo[];
   session: Session | null;
};

export function TodosList({ todosList, session }: Props) {
   const [isEditing, setIsEditing] = useState(false);
   const [newTodo, setNewTodo] = useState({ id: "", title: "" });
   const { todos, setTodos } = useTodos();
   const router = useRouter();

   function handleShowEditTodo(id: string) {
      const filteredTodo = todosList.find((todo) => todo.id === id);

      if (filteredTodo && filteredTodo.title) {
         setIsEditing(true);
         setNewTodo({
            id: filteredTodo.id,
            title: filteredTodo.title,
         });
      }
   }

   async function handleUpdateTodo(id: string, title: string) {
      try {
         if (id && title) {
            await updateTodoTitle(newTodo.id, newTodo.title);
            router.refresh();
            toast.success("Todo updated");
         } else {
            toast.info("Title is required");
         }
      } catch (error) {
         toast.error("Something went wrong, try again");
      } finally {
         setIsEditing(false);
      }
   }

   async function handleDelete(id: string) {
      if (!session) {
         const confirmed = window.confirm(
            "Are you sure you want to delete this todo?"
         );

         if (id && confirmed) {
            let listTodos = [...todos];
            let filteredList = listTodos.filter((item) => item.id !== id);
            setTodos(filteredList);
            localStorage.setItem("todos", JSON.stringify(filteredList));
         }
      }

      if (session) {
         try {
            const confirmed = window.confirm(
               "Are you sure you want to delete this todo?"
            );

            if (id && confirmed) {
               await deleteTodo(id);
               router.refresh();
               toast.success("Todo deleted");
            }
         } catch (error) {
            toast.error("Something went wrong, try again");
         }
      }
   }

   return (
      <>
         {todosList.length === 0 && todos.length === 0 && (
            <div className="mt-20 text-center text-slate-400">
               <img
                  src="/add-tasks-image.svg"
                  alt="Add Tasks Image"
                  className="m-auto mb-5"
               />
               <p className="font-semibold text-lg mb-2">
                  Your tasks List is Empty!
               </p>
               {!session ? (
                  <p>
                     <a
                        href="/login"
                        className="underline font-semibold text-slate-300"
                     >
                        Log in
                     </a>{" "}
                     to access all features or simply start adding new tasks.
                  </p>
               ) : (
                  <p>You don't have any tasks right now. Try to add some.</p>
               )}
            </div>
         )}
         {!isEditing && (
            <ul>
               {todosList.map((todo) => (
                  <li
                     key={todo.id}
                     className={`grid grid-cols-[auto_1fr_auto] gap-3 items-center bg-slate-800 border border-slate-700 rounded-md py-4 px-2 mb-3 ${
                        todo.is_done && "opacity-40"
                     }`}
                  >
                     {!session ? (
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
                     ) : (
                        <input
                           type="checkbox"
                           id={todo.id}
                           checked={todo.is_done}
                           onChange={() =>
                              updateTodoIsDone(todo.id, todo.is_done)
                           }
                           className="cursor-pointer w-4 h-4 bg-slate-600 rounded focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
                        />
                     )}
                     <label
                        htmlFor={todo.id}
                        className={`${todo.is_done && "line-through"} ${
                           !session && "pointer-events-none"
                        } font-semibold break-all cursor-pointer`}
                     >
                        {todo.title}
                     </label>
                     <div className="flex items-center gap-2">
                        {!session ? (
                           <Tooltip text="You must be logged in to edit.">
                              <button
                                 className={`${
                                    !session && "opacity-30"
                                 } w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-amber-200 hover:text-amber-600 active:opacity-100 transition`}
                              >
                                 <Pencil className="w-4 h-4" />
                              </button>
                           </Tooltip>
                        ) : (
                           <button
                              className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:opacity-80 active:opacity-100 transition"
                              onClick={() => handleShowEditTodo(todo.id)}
                           >
                              <Pencil className="w-4 h-4" />
                           </button>
                        )}
                        <button
                           className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:opacity-80 transition"
                           onClick={() => handleDelete(todo.id)}
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </li>
               ))}
            </ul>
         )}

         {isEditing && (
            <form
               className="flex items-center gap-5"
               onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateTodo(newTodo.id, newTodo.title);
               }}
            >
               <input
                  id="editTodoInput"
                  type="text"
                  value={newTodo.title}
                  onChange={({ target }) =>
                     setNewTodo({
                        ...newTodo,
                        title: target.value,
                     })
                  }
                  className="w-full h-[65px] p-2 rounded-md bg-slate-600 text-white outline-none focus:ring-1"
                  autoFocus
               />

               <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm hover:opacity-80 transition"
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="text-sm hover:opacity-80 transition"
               >
                  Save
               </button>
            </form>
         )}
      </>
   );
}
