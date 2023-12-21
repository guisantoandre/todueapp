import { Todo } from "@/contexts/localstorage-todos-context";
import { TodosRecord } from "@/lib/xata";
import { SelectedPick } from "@xata.io/client";
import { Trash2 } from "lucide-react";
import React from "react";

type Props = React.ComponentProps<"button"> & {
   todo: Todo | SelectedPick<TodosRecord, "*"[]>;
   onDelete: (id: string) => void;
};

export function DeleteButton({ todo, onDelete }: Props) {
   return (
      <button
         className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:opacity-80 transition"
         onClick={() => onDelete(todo.id)}
      >
         <Trash2 className="w-4 h-4" />
      </button>
   );
}