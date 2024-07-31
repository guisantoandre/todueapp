"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";
import { v4 as randomID } from "uuid";
import { Session } from "next-auth";
import { toast } from "sonner";

import { createTodo } from "@/app/actions";
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

      const trimmedTitle = title.trim();

      if (trimmedTitle === "" || trimmedTitle === null) {
         toast.info("Task title is required");
         return;
      }

      if (!session && title !== "" && title !== null) {
         const newList = [...localStorageTodos];

         newList.push({ id: randomID(), title: trimmedTitle, is_done: false });

         setLocalStorageTodos(newList);

         localStorage.setItem("todos", JSON.stringify(newList));

         setTitle("");
      }

      if (session && title !== "") {
         const newTodo = await createTodo(title.trim());

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
      <div className="z-20 fixed bottom-0 left-0 w-full py-6 bg-bg-dark/60 backdrop-blur-sm md:static md:py-0 md:bg-none">
         <form
            onSubmit={(e) => handleCreate(e)}
            className="flex items-center gap-x-3 px-3 sm-custom:w-[580px] mx-auto md:static md:w-full md:px-0 md:mb-5"
         >
            <input
               id="addTodoInput"
               type="text"
               onChange={({ target }) => setTitle(target.value)}
               value={title}
               placeholder="What needs to be done?"
               className="w-full h-[50px] p-2 rounded-md bg-bg-add-form placeholder:text-neutral-400 outline-none focus:ring-1"
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
