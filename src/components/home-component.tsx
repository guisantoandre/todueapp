"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import Link from "next/link";

import { User } from "./user";
import { AddTodoForm } from "./add-todo-form";
import { TodosList } from "./todos-list";
import { TodosRecord } from "@/lib/xata";
import { useTodos } from "@/contexts/localstorage-todos-context";
import { CompletedTasks } from "./completed-tasks";
import { ClearAllBtn } from "./clear-all";

type Props = {
   session: Session | null;
   allTodos: TodosRecord[] | [];
};

export function HomeComponent({ session, allTodos }: Props) {
   const { localStorageTodos, setLocalStorageTodos } = useTodos();

   useEffect(() => {
      if (!session) {
         if (localStorage.getItem("todos") === null) {
            localStorage.setItem("todos", JSON.stringify([]));
         }

         if (localStorage.getItem("todos") !== null) {
            setLocalStorageTodos(JSON.parse(localStorage.getItem("todos")!));
         }
      }
   }, []);

   return (
      <main className="w-[580px] mt-10 mb-28 px-3">
         <div className="flex flex-col gap-y-6 items-center md:flex-row md:justify-between mb-10">
            <img src="/todue-logo.svg" alt="ToDue Logo" className="w-24" />
            {session && <User user={session} />}
            {!session && (
               <Link
                  href={"/login"}
                  className="rounded text-black py-2 px-4 bg-bg-btn font-semibold hover:opacity-80 transition"
               >
                  Log in
               </Link>
            )}
         </div>
         <AddTodoForm session={session} />
         {session && (
            <div className="w-full flex items-center justify-between mb-2">
               {allTodos.length > 0 && <CompletedTasks tasks={allTodos} />}
               {allTodos.length > 0 && <ClearAllBtn session={session} />}
            </div>
         )}
         <TodosList
            todosList={!session ? localStorageTodos : allTodos}
            session={session}
         />
      </main>
   );
}
