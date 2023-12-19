import { TodosRecord } from "@/lib/xata";
import { SelectedPick } from "@xata.io/client";

type Props = {
   tasks: SelectedPick<TodosRecord, ("title" | "id" | "is_done")[]>[];
};

export function CompletedTasks({ tasks }: Props) {
   return (
      <span className="text-sm text-slate-400 block">{`(${
         tasks.filter((task) => task.is_done).length
      }/${tasks.length}) Completed Tasks`}</span>
   );
}
