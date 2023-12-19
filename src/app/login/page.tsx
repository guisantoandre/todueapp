import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { GoogleSiginButton } from "@/components/google-sigin-button";

export default async function LoginPage() {
   const session = await getServerSession();

   if (session) redirect("/");

   return (
      <main className="w-[500px] my-10 px-3">
         <h1 className="text-2xl font-semibold mb-10 text-center">Login</h1>
         <Link
            href={"/"}
            className="inline-block mb-5 underline text-white hover:text-slate-300 transition"
         >
            &lt; Back
         </Link>
         <p className="text-sm grid grid-cols-[auto_1fr] gap-x-2 p-5 bg-slate-800 text-slate-400 rounded mb-5">
            <ShieldAlert className="w-5 h-5" />
            Logging in with Google is secure and simple. Click the button below
            to proceed, and you'll be redirected to select your Google account.
            Once selected, you're all set.
         </p>
         <GoogleSiginButton />
      </main>
   );
}
