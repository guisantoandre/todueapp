"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { toast } from "sonner";

import { SelectedPick } from "@xata.io/client";
import { TodosRecord } from "@/lib/xata";
import { deleteTodo, updateTodoTitle } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { Todo, useTodos } from "@/contexts/localstorage-todos-context";
import { NoTasksMessage } from "./no-tasks-message";
import { InputCheckbox } from "./input-checkbox";
import { EditButton } from "./edit-button";
import { DeleteButton } from "./delete-button";
import {
   DragDropContext,
   Draggable,
   DropResult,
   Droppable,
} from "@hello-pangea/dnd";
import { useOrderedTodos } from "@/contexts/localstorage-ordered-todos-context";
import { GripVertical } from "lucide-react";

type Props = {
   todosList: SelectedPick<TodosRecord, "*"[]>[] | Todo[];
   session: Session | null;
};

export function TodosList({ todosList, session }: Props) {
   const [isMounted, setIsMounted] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [newTodo, setNewTodo] = useState({ id: "", title: "" });
   const { localStorageTodos, setLocalStorageTodos } = useTodos();
   const { localStorageOrderedTodos, setLocalStorageOrderedTodos } =
      useOrderedTodos();
   const router = useRouter();
   const userName = session?.user?.email?.split("@")[0];

   function handleShowEditTodo(id: string) {
      const filteredTodo = todosList.find((todo) => todo.id === id);

      if (filteredTodo && filteredTodo.title) {
         setIsEditing(true);
         setNewTodo({
            id: filteredTodo.id,
            title: filteredTodo.title,
         });
      }
   }

   async function handleUpdateTodo(id: string, title: string) {
      try {
         if (id && title) {
            await updateTodoTitle(newTodo.id, newTodo.title.trim());

            if (localStorage.getItem(`orderedTodos_${userName}`)) {
               const listOrderedTodos = [...localStorageOrderedTodos];

               const index = listOrderedTodos.findIndex(
                  (item) => item.id === id
               );
               listOrderedTodos[index].title = title.trim();

               localStorage.setItem(
                  `orderedTodos_${userName}`,
                  JSON.stringify(listOrderedTodos)
               );

               setLocalStorageOrderedTodos(listOrderedTodos);
            }

            router.refresh();
            toast.success("Todo updated");
         } else {
            toast.info("Task title is required");
         }
      } catch (error) {
         toast.error("Something went wrong, try again");
      } finally {
         setIsEditing(false);
      }
   }

   async function handleDelete(id: string) {
      if (!session) {
         const confirmed = window.confirm(
            "Are you sure you want to delete this todo?"
         );

         if (id && confirmed) {
            let listTodos = [...localStorageTodos];
            let filteredList = listTodos.filter((item) => item.id !== id);
            setLocalStorageTodos(filteredList);
            localStorage.setItem("todos", JSON.stringify(filteredList));
         }
      }

      if (session) {
         try {
            const confirmed = window.confirm(
               "Are you sure you want to delete this todo?"
            );

            if (id && confirmed) {
               await deleteTodo(id);

               if (localStorage.getItem(`orderedTodos_${userName}`)) {
                  let listOrderedTodos = [...localStorageOrderedTodos];
                  let filteredList = listOrderedTodos.filter(
                     (item) => item.id !== id
                  );
                  setLocalStorageOrderedTodos(filteredList);
                  localStorage.setItem(
                     `orderedTodos_${userName}`,
                     JSON.stringify(filteredList)
                  );
               }

               router.refresh();
               toast.success("Todo deleted");
            }
         } catch (error) {
            toast.error("Something went wrong, try again");
         }
      }
   }

   function reorderList<T>(list: T[], startIndex: number, endIndex: number) {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
   }

   function handleDragEnd(result: DropResult) {
      if (!result.destination) return;

      if (session) {
         const newOrderList = reorderList(
            (localStorageOrderedTodos.length > 0
               ? localStorageOrderedTodos
               : todosList) as SelectedPick<TodosRecord, "*"[]>[],
            result.source.index,
            result.destination.index
         );

         localStorage.setItem(
            `orderedTodos_${userName}`,
            JSON.stringify(newOrderList)
         );

         setLocalStorageOrderedTodos(newOrderList);
      }

      if (!session) {
         const newOrderList = reorderList(
            (localStorageTodos.length > 0
               ? localStorageTodos
               : todosList) as Todo[],
            result.source.index,
            result.destination.index
         );

         setLocalStorageTodos(newOrderList);
      }
   }

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      return null;
   }

   return (
      <div>
         {todosList.length === 0 && localStorageTodos.length === 0 && (
            <NoTasksMessage session={session} />
         )}
         {!isEditing && (
            <DragDropContext onDragEnd={handleDragEnd}>
               <Droppable droppableId="todotasks" type="list">
                  {(provided) => (
                     <ul ref={provided.innerRef} {...provided.droppableProps}>
                        {(localStorageOrderedTodos.length > 0 && session
                           ? localStorageOrderedTodos
                           : todosList
                        ).map((todo, index) => (
                           <Draggable
                              key={todo.id}
                              index={index}
                              draggableId={todo.id}
                           >
                              {(provided) => (
                                 <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`group grid grid-cols-[auto_1fr_auto] gap-3 items-center bg-bg-todos border border-neutral-900 rounded-md py-4 px-2 mb-3 ${
                                       todo.is_done && "opacity-50"
                                    }`}
                                 >
                                    {session ? (
                                       <InputCheckbox
                                          todo={todo}
                                          isAuthenticated={true}
                                          session={session}
                                       />
                                    ) : (
                                       <InputCheckbox
                                          todo={todo}
                                          isAuthenticated={false}
                                       />
                                    )}
                                    <label
                                       htmlFor={todo.id}
                                       className={`${
                                          todo.is_done && "line-through"
                                       } ${
                                          !session && "pointer-events-none"
                                       } font-semibold break-all cursor-pointer`}
                                    >
                                       {todo.title}
                                    </label>
                                    <div className="flex items-center gap-2">
                                       <GripVertical className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:text-neutral-500" />
                                       {session ? (
                                          <EditButton
                                             isAuthenticated={true}
                                             todo={todo}
                                             onShowEditTodo={handleShowEditTodo}
                                          />
                                       ) : (
                                          <EditButton
                                             isAuthenticated={false}
                                             todo={todo}
                                          />
                                       )}
                                       <DeleteButton
                                          todo={todo}
                                          onDelete={handleDelete}
                                       />
                                    </div>
                                 </li>
                              )}
                           </Draggable>
                        ))}

                        {provided.placeholder}
                     </ul>
                  )}
               </Droppable>
            </DragDropContext>
         )}

         {isEditing && (
            <form
               className="flex items-center gap-5"
               onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateTodo(newTodo.id, newTodo.title);
               }}
            >
               <input
                  id="editTodoInput"
                  type="text"
                  value={newTodo.title}
                  onChange={({ target }) =>
                     setNewTodo({
                        ...newTodo,
                        title: target.value,
                     })
                  }
                  className="w-full h-[65px] p-2 rounded-md bg-bg-add-form placeholder:text-neutral-400
                  focus:bg-bg-add-form/60 text-white outline-none focus:ring-1"
                  autoFocus
               />

               <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm hover:opacity-80 transition"
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="text-sm hover:opacity-80 transition"
               >
                  Save
               </button>
            </form>
         )}
      </div>
   );
}
