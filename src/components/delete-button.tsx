import React from "react";
import { Trash2 } from "lucide-react";

import { Todo } from "@/contexts/localstorage-todos-context";
import { TodosRecord } from "@/lib/xata";

type Props = React.ComponentProps<"button"> & {
   todo: Todo | TodosRecord;
   onDelete: (id: string) => void;
};

export function DeleteButton({ todo, onDelete }: Props) {
   return (
      <button
         className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:opacity-70 active:opacity-100 transition"
         onClick={() => onDelete(todo.id)}
      >
         <Trash2 className="w-4 h-4" />
      </button>
   );
}
