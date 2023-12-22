"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";
import { v4 as randomID } from "uuid";
import { Session } from "next-auth";

import { createTodo } from "@/actions/actions";
import { useTodos } from "@/contexts/localstorage-todos-context";
import { useOrderedTodos } from "@/contexts/localstorage-ordered-todos-context";

type Props = {
   session: Session | null;
};

export function AddTodoForm({ session }: Props) {
   const [title, setTitle] = useState("");
   const { localStorageTodos, setLocalStorageTodos } = useTodos();
   const { localStorageOrderedTodos, setLocalStorageOrderedTodos } =
      useOrderedTodos();
   const userEmail = session?.user?.email?.split("@")[0];

   async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (!session) {
         const newList = [...localStorageTodos];

         newList.push({ id: randomID(), title: title, is_done: false });

         setLocalStorageTodos(newList);

         localStorage.setItem("todos", JSON.stringify(newList));

         setTitle("");
      }

      if (session) {
         const newTodo = await createTodo(title);
         if (localStorage.getItem(`orderedTodos_${userEmail}`)) {
            const newOrderedList = [...localStorageOrderedTodos];

            newOrderedList.push(newTodo);

            setLocalStorageOrderedTodos(newOrderedList);

            localStorage.setItem(
               `orderedTodos_${userEmail}`,
               JSON.stringify(newOrderedList)
            );
            console.log(newTodo);
         }
         setTitle("");
      }
   }

   return (
      <div className="w-full my-5 px-3 sm-custom:w-[580px] fixed bottom-0 left-1/2 transform -translate-x-1/2 md:static md:w-full md:transform-none md:px-0 md:mb-5">
         <form
            onSubmit={(e) => handleCreate(e)}
            className="flex items-center gap-x-3"
         >
            <input
               id="addTodoInput"
               type="text"
               onChange={({ target }) => setTitle(target.value)}
               value={title}
               placeholder="What needs to be done?"
               className="w-full h-[50px] p-2 rounded-md bg-bg-add-form placeholder:text-neutral-400 outline-none focus:ring-1 focus:bg-bg-add-form/60"
               autoFocus
            />
            <button
               type="submit"
               className="rounded-md bg-bg-btn text-black h-[50px] py-2 px-4 font-bold hover:opacity-90 active:opacity-100 transition"
            >
               <Plus className="w-5 h-5" />
            </button>
         </form>
      </div>
   );
}
