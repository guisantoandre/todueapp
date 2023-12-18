"use client";

import { signIn } from "next-auth/react";

export function GoogleSiginButton() {
   function handleClick() {
      signIn("google", { callbackUrl: window.location.origin });
   }

   return (
      <button
         onClick={handleClick}
         className="bg-white w-full rounded text-black px-5 py-3 flex items-center justify-center gap-2 font-bold hover:opacity-90 transition"
      >
         <img src="/google-logo.svg" alt="Google Logo" className="w-5 h-5" />
         Sign in with Google
      </button>
   );
}
