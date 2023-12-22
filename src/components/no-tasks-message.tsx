import { Session } from "next-auth";

export function NoTasksMessage({ session }: { session: Session | null }) {
   return (
      <div className="mt-16 text-center text-neutral-400">
         <img
            src="/add-tasks-image.svg"
            alt="Add Tasks Image"
            className="m-auto mb-5"
         />
         <p className="font-semibold text-lg mb-2">Your Tasks List is Empty!</p>
         {!session ? (
            <p>
               <a
                  href="/login"
                  className="font-semibold text-neutral-300 hover:underline hover:text-slate-50 transition"
               >
                  Log in
               </a>{" "}
               to access all features or simply start adding new tasks.
            </p>
         ) : (
            <p>You don't have any tasks right now. Try to add some.</p>
         )}
      </div>
   );
}
