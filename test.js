const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// Example usage
(async () => {
  const password = "54321";
  const hashedPassword = await hashPassword(password);
  console.log("Hashed Password:", hashedPassword);
})();
