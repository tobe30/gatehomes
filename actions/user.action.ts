'use server';

import { cookies } from "next/headers";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";

type AdminProfile = {
  name: string;
  email: string;
  phone: string;
};

type ProfileActionState = {
  profile?: AdminProfile;
  error?: string;
  success?: string;
};

async function getSignedInAdmin() {
  const cookieStore = await cookies();
  const session = verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );

  if (!session || session.role !== "admin") return null;

  await connectDB();
  const user = await User.findOne({ _id: session.sub, role: "admin", isActive: true })
    .select("name email phone")
    .lean();

  return user
    ? {
        session,
        user,
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
        },
      }
    : null;
}

export async function getAdminProfileAction(): Promise<AdminProfile | null> {
  try {
    return (await getSignedInAdmin())?.profile ?? null;
  } catch (error) {
    console.error("Unable to load admin profile:", error);
    return null;
  }
}

export async function updateAdminProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 2 || name.length > 80) {
    return { error: "Enter a name between 2 and 80 characters." };
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (phone.length > 30) {
    return { error: "Phone number must be 30 characters or fewer." };
  }

  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "Your admin session has expired. Sign in again." };

    const user = await User.findOne({
      _id: admin.session.sub,
      role: "admin",
      isActive: true,
    });
    if (!user) return { error: "Admin account not found." };

    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();

    return {
      profile: { name: user.name, email: user.email, phone: user.phone ?? "" },
      success: "Your profile has been updated.",
    };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return { error: "That email address is already used by another account." };
    }

    console.error("Admin profile update failed:", error);
    return { error: "We could not save your profile. Please try again." };
  }
}

export async function changeAdminPasswordAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Complete all password fields." };
  }

  if (newPassword.length < 8 || newPassword.length > 128) {
    return { error: "Your new password must be between 8 and 128 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "The new passwords do not match." };
  }

  if (currentPassword === newPassword) {
    return { error: "Choose a new password that differs from your current one." };
  }

  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "Your admin session has expired. Sign in again." };

    const user = await User.findOne({
      _id: admin.session.sub,
      role: "admin",
      isActive: true,
    }).select("+passwordHash");

    if (!user) return { error: "Admin account not found." };

    const currentPasswordIsValid = await verifyPassword(
      currentPassword,
      user.passwordHash,
    );
    if (!currentPasswordIsValid) {
      return { error: "Your current password is incorrect." };
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return { success: "Your password has been changed." };
  } catch (error) {
    console.error("Admin password change failed:", error);
    return { error: "We could not change your password. Please try again." };
  }
}
