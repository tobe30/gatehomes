"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import User from "@/models/User";
import Property from "@/models/Property";
import Inquiry from "@/models/Inquiry";

const inquiryTypes = new Set(["Normal stay", "Get together", "Party"]);

function validDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function createInquiryAction(input: Record<string, unknown>) {
  const name = String(input?.name ?? "").trim();
  const phone = String(input?.phone ?? "").trim();
  const email = String(input?.email ?? "").trim().toLowerCase();
  const requestType = String(input?.requestType ?? "");
  const startDate = String(input?.startDate ?? "");
  const endDate = String(input?.endDate ?? "");
  const guests = Number(input?.guests);
  const message = String(input?.message ?? "").trim();
  const slug = String(input?.propertySlug ?? "").trim();

  if (name.length < 2 || name.length > 100) {
    return { error: "Enter a name between 2 and 100 characters." };
  }
  if (phone.length < 7 || phone.length > 30 || !/^[+\d()\s.-]+$/.test(phone)) {
    return { error: "Enter a valid phone number." };
  }
  if (email && (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { error: "Enter a valid email address." };
  }
  if (message.length > 1000) {
    return { error: "Additional details must be 1,000 characters or fewer." };
  }
  if (!slug || slug.length > 120) {
    return { error: "This listing could not be identified. Refresh and try again." };
  }

  try {
    await connectDB();
    const property = await Property.findOne({ slug, status: "Published" })
      .select("_id slug title category image images")
      .lean();
    if (!property) {
      return { error: "This listing is no longer available. Please refresh and choose another listing." };
    }

    const isShortlet = property.category === "Shortlet";
    if (isShortlet && !inquiryTypes.has(requestType)) {
      return { error: "Choose a valid purpose of booking." };
    }
    if (isShortlet && (!startDate || !endDate)) {
      return { error: "Choose both a start date and an end date." };
    }
    if (isShortlet && (!validDate(startDate) || !validDate(endDate))) {
      return { error: "Choose valid booking dates." };
    }
    if (isShortlet && endDate <= startDate) {
      return { error: "The end date must be after the start date." };
    }
    if (isShortlet && (!Number.isInteger(guests) || guests < 1 || guests > 50)) {
      return { error: "Guests or visitors must be between 1 and 50." };
    }

    const cover = (property.images || []).find((image: { isCover?: boolean }) => image.isCover)?.url;
    const propertyImage = cover || property.image || property.images?.[0]?.url || "";

    await Inquiry.create({
      property: property._id,
      propertySlug: property.slug,
      propertyTitle: property.title,
      propertyImage,
      propertyCategory: isShortlet ? "Shortlet" : "Property",
      name,
      phone,
      email,
      requestType: isShortlet ? requestType : "",
      startDate: isShortlet ? startDate : "",
      endDate: isShortlet ? endDate : "",
      guests: isShortlet ? guests : null,
      message,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true, propertyTitle: property.title, propertyImage };
  } catch (error) {
    console.error("Inquiry could not be saved:", error);
    return { error: "Your inquiry could not be saved. Please try again." };
  }
}

async function getSignedInAdmin() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session || session.role !== "admin") return null;

  await connectDB();
  const user = await User.findOne({
    _id: session.sub,
    role: "admin",
    isActive: true,
  }).select("_id");
  return user;
}

function serializeInquiry(inquiry: Record<string, any>) {
  return {
    id: String(inquiry._id),
    name: inquiry.name,
    email: inquiry.email || "",
    phone: inquiry.phone,
    property: inquiry.propertyTitle,
    propertyCategory: inquiry.propertyCategory || "Property",
    propertyId: String(inquiry.property),
    propertySlug: inquiry.propertySlug,
    propertyImage: inquiry.propertyImage || "",
    message: inquiry.message || "",
    requestType: inquiry.requestType,
    startDate: inquiry.startDate || "",
    endDate: inquiry.endDate || "",
    preferredDate: inquiry.preferredDate || "",
    guests: inquiry.guests,
    date: inquiry.createdAt instanceof Date
      ? inquiry.createdAt.toISOString()
      : new Date(inquiry.createdAt).toISOString(),
    read: Boolean(inquiry.read),
  };
}

export async function getAdminInquiriesAction() {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to view inquiries." };

    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return { inquiries: inquiries.map(serializeInquiry) };
  } catch (error) {
    console.error("Unable to load inquiries:", error);
    return { error: "Inquiries could not be loaded." };
  }
}

export async function toggleAdminInquiryReadAction(id: string) {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to update inquiries." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid inquiry ID." };

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return { error: "Inquiry not found." };
    inquiry.read = !inquiry.read;
    await inquiry.save();
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true, read: inquiry.read };
  } catch (error) {
    console.error("Unable to update inquiry:", error);
    return { error: "Inquiry status could not be updated." };
  }
}
