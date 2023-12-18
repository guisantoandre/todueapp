import { getServerSession } from "next-auth";

import { getAllTodos } from "@/actions/actions";
import { AddTodoForm } from "@/components/add-todo-form";
import { TodosList } from "@/components/todos-list";
import { User } from "@/components/user";
import Link from "next/link";

export default async function Home() {
   const session = await getServerSession();
   const allTodos = await getAllTodos();

   return (
      <>
         <main className="w-[580px] my-10 px-3">
            <div className="flex flex-col gap-3 items-center md:flex-row md:justify-between mb-10">
               <h1 className="text-2xl font-bold text-center">Todo App</h1>
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
            <AddTodoForm />
            <TodosList todos={allTodos} session={session} />
         </main>
      </>
   );
}
