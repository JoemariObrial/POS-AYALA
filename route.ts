/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = ["/"];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */

export const authRoutes: string[] = ["/"];

/**
 * The prefix for API authentication routes
 * @type {string}
 */

export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/admin";
