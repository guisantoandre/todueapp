import { getServerSession } from "next-auth";

import { getAllTodos } from "@/app/actions";
import { HomeComponent } from "@/components/home-component";

export default async function Home() {
   const session = await getServerSession();
   let allTodos = await getAllTodos();

   return <HomeComponent session={session} allTodos={allTodos} />;
}
