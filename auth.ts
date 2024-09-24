import NextAuth from "next-auth";

import { connectToDatabase } from "./lib/auth/db";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        // User account information
        session.user.fullname = token.fullname as string;
        session.user.username = token.username as string;
      }

      return session;
    },
    async jwt({ token }: any) {
      if (!token.sub) return token;

      const connection = await connectToDatabase();

      // Query to find the user by email
      const [users]: any = await connection.execute(
        "SELECT * FROM ayala WHERE user_id = ?",
        [token.sub]
      );

      const currentUser = users[0];

      if (!currentUser) return token;

      token.fullname = currentUser.fullname;
      token.username = currentUser.username;
      token.role = currentUser.role;

      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
    updateAge: 30 * 60, // 30 minutes
  },
  ...authConfig,
});
