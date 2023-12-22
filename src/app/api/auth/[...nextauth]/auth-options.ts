import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { getXataClient } from "@/lib/xata";
const xata = getXataClient();

export const authOptions: NextAuthOptions = {
   secret: process.env.NEXTAUTH_SECRET as string,
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_ID as string,
         clientSecret: process.env.GOOGLE_SECRET as string,
      }),
   ],
   callbacks: {
      async signIn({ profile }) {
         if (!profile?.email) {
            throw new Error("User not found");
         }

         // Verify if user already exists
         const user = await xata.db.users
            .filter({ email: profile.email })
            .getFirst();
         // Just to update the name of user (if its needed)
         // if (user) {
         //    await xata.db.users.update(user.id, {
         //       name: profile.name,
         //    });
         // }

         // If user not exists, create it
         if (!user) {
            await xata.db.users.create({
               name: profile.name ?? profile.email.split("@")[0],
               email: profile.email,
            });
         }

         return true;
      },
   },
};
