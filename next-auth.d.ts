import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  user_id: string;
  fullname: string;
  username: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    expires: any;
  }
}
