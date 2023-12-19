"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import Link from "next/link";

import { User } from "./user";
import { AddTodoForm } from "./add-todo-form";
import { TodosList } from "./todos-list";
import { SelectedPick } from "@xata.io/client";
import { TodosRecord } from "@/lib/xata";
import { useTodos } from "@/contexts/todos-context";

type Props = {
   session: Session | null;
   allTodos: SelectedPick<TodosRecord, ("title" | "id" | "is_done")[]>[] | [];
};

export function HomeComponent({ session, allTodos }: Props) {
   const { todos, setTodos } = useTodos();

   useEffect(() => {
      if (!session) {
         if (localStorage.getItem("todos") === null) {
            localStorage.setItem("todos", JSON.stringify([]));
         }

         if (localStorage.getItem("todos") !== null) {
            setTodos(JSON.parse(localStorage.getItem("todos")!));
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
                  className="underline rounded transition text-white hover:text-slate-300"
               >
                  Login
               </Link>
            )}
         </div>
         <AddTodoForm session={session} />
         <TodosList todosList={!session ? todos : allTodos} session={session} />
      </main>
   );
}
