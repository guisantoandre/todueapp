"use client";

import { Session } from "next-auth";
import { toast } from "sonner";

import { deleteAllTodos } from "@/app/actions";
import { useOrderedTodos } from "@/contexts/localstorage-ordered-todos-context";

export function ClearAllBtn({ session }: { session: Session | null }) {
   const { localStorageOrderedTodos, setLocalStorageOrderedTodos } =
      useOrderedTodos();
   const userName = session?.user?.email?.split("@")[0];

   async function handleDeleteAll() {
      try {
         const confirmed = window.confirm(
            "Are you sure you want to delete all todos?"
         );
         if (confirmed) {
            await deleteAllTodos();

            if (localStorage.getItem(`orderedTodos_${userName}`)) {
               localStorage.removeItem(`orderedTodos_${userName}`);
               setLocalStorageOrderedTodos([]);
            }

            toast.success("All todos deleted");
         }
      } catch (error) {
         toast.error("Something went wrong, try again");
      }
   }

   return (
      <button
         className="underline text-neutral-400 hover:text-neutral-50 transition"
         onClick={() => handleDeleteAll()}
      >
         Clear All
      </button>
   );
}
