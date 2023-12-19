import { deleteAllTodos } from "@/actions/actions";
import { toast } from "sonner";

export function ClearAllBtn() {
   async function handleDeleteAll() {
      try {
         const confirmed = window.confirm(
            "Are you sure you want to delete all todos?"
         );
         if (confirmed) {
            await deleteAllTodos();
            toast.success("All todos deleted");
         }
      } catch (error) {
         toast.error("Something went wrong, try again");
      }
   }

   return (
      <button
         className="underline text-slate-400 hover:text-slate-50 transition"
         onClick={() => handleDeleteAll()}
      >
         Clear All
      </button>
   );
}
