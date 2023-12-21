"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { getXataClient } from "@/lib/xata";

const xata = getXataClient();

// CREATE //
export async function createTodo(title: string) {
   if (!title || title === "") return;

   const session = await getServerSession();

   if (session) {
      // Get user from session
      const user = await xata.db.users
         .filter({ email: session?.user?.email })
         .getFirst();

      try {
         const newTodo = await xata.db.todos.create({
            user: user?.id,
            title,
         });
         revalidatePath("/");
         return JSON.parse(JSON.stringify(newTodo));
      } catch (err) {
         console.log("[TODOS_CREATE_USERLOGGEDIN]", err);
      }
   }

   if (!session) {
      try {
         await xata.db.todos.create({ title });
         revalidatePath("/");
      } catch (err) {
         console.log("[TODOS_CREATE]", err);
      }
   }
}

// READ //
export async function getAllTodos() {
   const session = await getServerSession();

   if (session) {
      const user = await xata.db.users
         .filter({ email: session?.user?.email })
         .getFirst();

      try {
         const data = await xata.db.todos
            .filter({ user: user?.id })
            .select(["id", "title", "is_done"])
            .getAll();
         return JSON.parse(JSON.stringify(data));
      } catch (err) {
         console.log("[TODOS_READ_USERLOGGEDIN]", err);
      }
   }

   try {
      const data = await xata.db.todos
         .select(["id", "title", "is_done"])
         .getAll();
      return JSON.parse(JSON.stringify(data));
   } catch (err) {
      console.log("[TODOS_READ]", err);
      return [];
   }
}

// UPDATES //
export async function updateTodoIsDone(id: string, is_done: boolean) {
   if (!id) return;

   is_done === false ? (is_done = true) : (is_done = false);

   try {
      await xata.db.todos.update({ id, is_done });
      revalidatePath("/");
   } catch (err) {
      console.log("[TODO_UPDATE_ISDONE]", err);
   }
}

export async function updateTodoTitle(id: string, title: string) {
   if (!id) return;

   try {
      await xata.db.todos.update(id, { title });
   } catch (err) {
      console.log("[TODO_UPDATE_TITLE]", err);
   }
}

// DELETE //
export async function deleteTodo(id: string) {
   if (!id) return;

   try {
      await xata.db.todos.delete(id);
      revalidatePath("/");
   } catch (err) {
      console.log("[TODOS_DELETE]", err);
   }
}

export async function deleteAllTodos() {
   const session = await getServerSession();

   if (session) {
      const user = await xata.db.users
         .filter({ email: session?.user?.email })
         .getFirst();

      try {
         const data = await xata.db.todos.filter({ user: user?.id }).getAll();
         await xata.db.todos.delete(data);
         revalidatePath("/");
      } catch (err) {
         console.log("[TODOS_READ_USERLOGGEDIN]", err);
      }
   }
}
