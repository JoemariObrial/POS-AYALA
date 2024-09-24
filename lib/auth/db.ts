import mysql from "mysql2/promise";

export async function connectToDatabase() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pos",
  });
}
