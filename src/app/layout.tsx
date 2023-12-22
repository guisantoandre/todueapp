import { LocalStorageTodosProvider } from "@/contexts/localstorage-todos-context";
import "./globals.css";
import type { Metadata } from "next";
import { Blinker } from "next/font/google";
import { Toaster } from "sonner";
import { LocalStorageOrderedTodosProvider } from "@/contexts/localstorage-ordered-todos-context";
import { getServerSession } from "next-auth";

const blinker = Blinker({
   subsets: ["latin"],
   weight: ["400", "600"],
   variable: "--font-blinker",
   display: "swap",
});

export const metadata: Metadata = {
   title: "ToDue | A Simple App To Manage Your Todos",
   description: "A Todo App to manage yours daily tasks.",
};

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const session = await getServerSession();

   return (
      <html lang="en">
         <body
            className={`${blinker.variable} flex justify-center bg-bg-dark text-white`}
         >
            <Toaster richColors closeButton />
            <LocalStorageTodosProvider>
               <LocalStorageOrderedTodosProvider session={session}>
                  {children}
               </LocalStorageOrderedTodosProvider>
            </LocalStorageTodosProvider>
         </body>
      </html>
   );
}
