import { TodosProvider } from "@/contexts/todos-context";
import "./globals.css";
import type { Metadata } from "next";
import { Blinker } from "next/font/google";
import { Toaster } from "sonner";

const blinker = Blinker({
   subsets: ["latin"],
   weight: ["400", "600"],
   variable: "--font-blinker",
   display: "swap",
});

export const metadata: Metadata = {
   title: "ToDue | A simple app to manage your todos",
   description: "A Todo App to manage yours daily tasks.",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body
            className={`${blinker.variable} flex justify-center bg-slate-900 text-white`}
         >
            <Toaster richColors closeButton />
            <TodosProvider>{children}</TodosProvider>
         </body>
      </html>
   );
}
