"use client";

import { Pencil, X } from "lucide-react";

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

type Props = {
   todos: SelectedPick<TodosRecord, ("title" | "id" | "is_done")[]>[];
   session: Session | null;
};

export function TodosList({ todos, session }: Props) {
   const [isEditing, setIsEditing] = useState(false);
   const [newTodo, setNewTodo] = useState({ id: "", title: "" });
   const router = useRouter();

   function handleEdit(id: string) {
      const filteredTodo = todos.find((todo) => todo.id === id);

      if (filteredTodo && filteredTodo.title) {
         setIsEditing(true);
         setNewTodo({
            id: filteredTodo.id,
            title: filteredTodo.title,
         });
      }
   }

   return (
      <>
         {!isEditing && (
            <ul>
               {todos.map((todo) => (
                  <li
                     key={todo.id}
                     className={`grid grid-cols-[auto_1fr_auto] items-center bg-slate-800 border border-slate-700 rounded-sm p-2 mb-2 ${
                        todo.is_done && "opacity-50"
                     }`}
                     draggable
                  >
                     <input
                        type="checkbox"
                        id={todo.id}
                        checked={todo.is_done}
                        onChange={() => updateTodoIsDone(todo.id, todo.is_done)}
                        className="mr-3 cursor-pointer w-4 h-4 bg-slate-600 rounded focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
                     />
                     <label
                        htmlFor={todo.id}
                        className={`${
                           todo.is_done && "line-through"
                        } break-all cursor-pointer`}
                     >
                        {todo.title}
                     </label>
                     <div className="flex items-center gap-2">
                        {!session ? (
                           <Tooltip text="You must be logged in to edit.">
                              <button
                                 className={`${
                                    !session && "opacity-30"
                                 } w-7 h-7 bg-slate-700 rounded-[2px] flex items-center justify-center hover:bg-amber-200 hover:text-amber-600 active:opacity-100 transition`}
                              >
                                 <Pencil className="w-4 h-4" />
                              </button>
                           </Tooltip>
                        ) : (
                           <button
                              className="w-7 h-7 bg-slate-700 rounded-[2px] flex items-center justify-center hover:opacity-80 active:opacity-100 transition"
                              onClick={() => handleEdit(todo.id)}
                           >
                              <Pencil className="w-4 h-4" />
                           </button>
                        )}
                        <button
                           className="w-7 h-7 bg-slate-700 rounded-[2px] flex items-center justify-center hover:opacity-80 transition"
                           onClick={() => deleteTodo(todo.id)}
                        >
                           <X className="w-4 h-4" />
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
                  updateTodoTitle(newTodo.id, newTodo.title).then(() => {
                     router.refresh();
                     toast.success("Todo updated");
                     setIsEditing(false);
                  });
               }}
            >
               <input
                  type="text"
                  value={newTodo.title}
                  onChange={({ target }) =>
                     setNewTodo({
                        ...newTodo,
                        title: target.value,
                     })
                  }
                  className="w-full h-[45px] p-2 rounded-[2px] bg-slate-600 text-white outline-none focus:ring-1"
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
