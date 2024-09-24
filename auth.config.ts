import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { verifyPassword } from "./lib/auth/auth";
import { connectToDatabase } from "./lib/auth/db";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const connection = await connectToDatabase();

          const { username, password, role }: any = credentials;

          if (!credentials) return null;

          // Find user by studentId

          // Query to find the user by email
          const [users]: any = await connection.execute(
            "SELECT * FROM ayala WHERE username = ? AND role = ?",
            [username, role]
          );

          // Check if user was found
          if (users.length === 0) {
            throw new Error("No user found with the username.");
          }

          const user = users[0];

          if (user.pword && password) {
            const isValid = await verifyPassword(password, user.pword);
            if (!isValid) throw new Error("Password is incorrect.");

            // Return user if the password is correct
            return user;
          } else {
            throw new Error("Passwords must not be null.");
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
