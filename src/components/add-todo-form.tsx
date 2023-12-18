"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { createTodo } from "@/actions/actions";

export function AddTodoForm() {
   const [title, setTitle] = useState("");

   return (
      <div className="w-full mb-5">
         <form
            onSubmit={(e) => {
               e.preventDefault();
               createTodo(title);
               setTitle("");
            }}
            className="flex items-center gap-x-3"
         >
            <input
               type="text"
               onChange={({ target }) => setTitle(target.value)}
               value={title}
               placeholder="What needs to be done?"
               className="w-full h-[40px] p-2 rounded-[2px] bg-slate-600 placeholder:text-slate-400 outline-none focus:ring-1"
               autoFocus
            />
            <button
               type="submit"
               className="rounded-[2px] bg-blue-600 h-[40px] py-2 px-4 font-bold hover:opacity-90 active:opacity-100 transition"
            >
               <Plus className="w-5 h-5" />
            </button>
         </form>
      </div>
   );
}
