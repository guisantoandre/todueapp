"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import Link from "next/link";

import { User } from "./user";
import { AddTodoForm } from "./add-todo-form";
import { TodosList } from "./todos-list";
import { SelectedPick } from "@xata.io/client";
import { TodosRecord } from "@/lib/xata";
import { useTodos } from "@/contexts/localstorage-todos-context";
import { CompletedTasks } from "./completed-tasks";
import { ClearAllBtn } from "./clear-all";

type Props = {
   session: Session | null;
   allTodos: SelectedPick<TodosRecord, "*"[]>[] | [];
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
      <main className="w-[580px] my-10 px-3">
         <div className="flex flex-col gap-3 items-center md:flex-row md:justify-between mb-10">
            <h1 className="text-2xl font-semibold text-center">ToDue</h1>
            {session && <User user={session} />}
            {!session && (
               <Link
                  href={"/login"}
                  className="rounded transition text-white font-semibold hover:text-slate-300 hover:underline"
               >
                  Log in
               </Link>
            )}
         </div>
         <AddTodoForm session={session} />
         {session && (
            <div className="w-full flex items-center justify-between mb-2">
               <CompletedTasks tasks={allTodos} />
               {allTodos.length > 0 && <ClearAllBtn />}
            </div>
         )}
         <TodosList
            todosList={!session ? localStorageTodos : allTodos}
            session={session}
         />
      </main>
   );
}
