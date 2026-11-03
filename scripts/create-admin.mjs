import { createInterface } from "node:readline/promises";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";
import { hashPassword } from "../lib/auth/password.js";

function promptHidden(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    return Promise.reject(new Error("Run this command in an interactive terminal."));
  }

  return new Promise((resolve, reject) => {
    let value = "";
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const finish = (error) => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(false);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (key) => {
      if (key === "\u0003") return finish(new Error("Admin setup cancelled."));
      if (key === "\r" || key === "\n") return finish();
      if (key === "\u0008" || key === "\u007f") {
        if (value.length) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      if (key >= " ") {
        value += key;
        process.stdout.write("*");
      }
    };

    process.stdin.on("data", onData);
  });
}

async function main() {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  let name;
  let email;
  try {
    name = (await prompt.question("Admin name: ")).trim();
    email = (await prompt.question("Admin email: ")).trim().toLowerCase();
  } finally {
    prompt.close();
  }

  if (name.length < 2 || name.length > 80) {
    throw new Error("Admin name must be between 2 and 80 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Enter a valid email address.");
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short. Configure it in .env first.");
  }

  const password = await promptHidden("Admin password (minimum 8 characters): ");
  const confirmation = await promptHidden("Confirm admin password: ");
  if (password.length < 8 || password.length > 128) {
    throw new Error("Password must be between 8 and 128 characters.");
  }
  if (password !== confirmation) {
    throw new Error("The passwords do not match.");
  }

  await connectDB();
  if (await User.exists({ role: "admin" })) {
    throw new Error("An admin account already exists. Admin setup can only run once.");
  }

  await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
  });

  console.log(`Admin account created for ${email}. You can now sign in at /admin/login.`);
}

main()
  .catch((error) => {
    console.error(error.message || "Admin setup failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
