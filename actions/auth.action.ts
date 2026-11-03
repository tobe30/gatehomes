"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth/session";

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

export async function adminLoginAction(
  _previousState: { error?: string },
  formData: FormData,
) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email }).select("+passwordHash");

    if (
      !user ||
      !user.isActive ||
      user.role !== "admin" ||
      !(await verifyPassword(password, user.passwordHash))
    ) {
      return { error: "The email or password is incorrect." };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      SESSION_COOKIE_NAME,
      createSessionToken(user),
      sessionCookieOptions(),
    );
  } catch (error) {
    console.error("Admin sign-in failed:", error);
    return {
      error: "Sign-in is temporarily unavailable. Check the server configuration and try again.",
    };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
