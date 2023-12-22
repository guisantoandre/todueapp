"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

type Props = {
   user: Session;
};

export function User({ user }: Props) {
   return (
      <div className="flex items-center gap-2">
         <div className="flex items-center gap-2">
            <img
               src={`${user.user?.image}`}
               alt="User Avatar"
               className="w-8 h-8 rounded-full"
            />{" "}
            <span className="font-semibold">{user?.user?.name}</span>
         </div>
         <button
            onClick={() => signOut()}
            className="underline text-neutral-400 transition hover:text-neutral-50"
         >
            Logout
         </button>
      </div>
   );
}
