"use server";

import { signIn, signOut } from "@/auth";

import { AuthError } from "next-auth";

export async function logins(username: string, password: string, role: string) {
  try {
    await signIn("credentials", {
      username,
      password,
      role,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error:
              error.cause?.err?.message === "No user found with the username."
                ? "User not found. Please check your username."
                : error.cause?.err?.message === "Password is incorrect."
                ? "Incorrect password. Please try again."
                : "Server Error.",
            type: "error",
          };
        case "CallbackRouteError":
          return {
            error:
              error.cause?.err?.message === "No user found with the username."
                ? "User not found. Please check your username."
                : error.cause?.err?.message === "Password is incorrect."
                ? "Incorrect password. Please try again."
                : "Server Error.",
            type: "error",
          };
        default:
          return { error: "Something went wrong.", type: "error" };
      }
    }
    throw error;
  }
}

export async function logout() {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
}
