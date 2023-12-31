import { Pencil } from "lucide-react";

import { Tooltip } from "./tooltip";
import { Todo } from "@/contexts/localstorage-todos-context";
import { TodosRecord } from "@/lib/xata";

type Props = React.ComponentProps<"input"> & {
   isAuthenticated: boolean;
   todo: Todo | TodosRecord;
   onShowEditTodo?: (id: string) => void;
};

export function EditButton({ isAuthenticated, todo, onShowEditTodo }: Props) {
   return (
      <>
         {isAuthenticated ? (
            <button
               className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:opacity-70 active:opacity-100 transition"
               onClick={() => onShowEditTodo!(todo.id)}
            >
               <Pencil className="w-4 h-4" />
            </button>
         ) : (
            <Tooltip text="You must be logged in to edit.">
               <button
                  className={`${
                     !isAuthenticated && "opacity-30"
                  } w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center`}
               >
                  <Pencil className="w-4 h-4" />
               </button>
            </Tooltip>
         )}
      </>
   );
}
