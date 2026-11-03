"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import User from "@/models/User";
import Property from "@/models/Property";
import Review from "@/models/Review";

const reviewStatuses = new Set(["Pending", "Approved", "Rejected"]);

export async function createReviewAction(input: Record<string, unknown>) {
  const name = String(input?.name ?? "").trim();
  const comment = String(input?.comment ?? "").trim();
  const rating = Number(input?.rating);
  const slug = String(input?.propertySlug ?? "").trim();

  if (name.length < 2 || name.length > 80) {
    return { error: "Enter a name between 2 and 80 characters." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Choose a rating from 1 to 5 stars." };
  }
  if (comment.length < 10 || comment.length > 2000) {
    return { error: "Write a comment between 10 and 2,000 characters." };
  }
  if (!slug || slug.length > 120) {
    return { error: "This listing could not be identified. Refresh and try again." };
  }

  try {
    await connectDB();
    const property = await Property.findOne({ slug, status: "Published" })
      .select("_id slug title")
      .lean();
    if (!property) return { error: "This listing is no longer available." };

    await Review.create({
      property: property._id,
      propertySlug: property.slug,
      propertyTitle: property.title,
      name,
      rating,
      comment,
      status: "Pending",
    });

    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Review could not be submitted:", error);
    return { error: "Your review could not be submitted. Please try again." };
  }
}

async function getSignedInAdmin() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session || session.role !== "admin") return null;

  await connectDB();
  return User.findOne({ _id: session.sub, role: "admin", isActive: true }).select("_id");
}

function serializeReview(review: Record<string, any>) {
  return {
    id: String(review._id),
    propertyId: String(review.property),
    propertySlug: review.propertySlug,
    propertyTitle: review.propertyTitle,
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt instanceof Date
      ? review.createdAt.toISOString()
      : new Date(review.createdAt).toISOString(),
  };
}

export async function getAdminReviewsAction() {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to view reviews." };

    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return { reviews: reviews.map(serializeReview) };
  } catch (error) {
    console.error("Unable to load reviews:", error);
    return { error: "Reviews could not be loaded." };
  }
}

export async function updateReviewStatusAction(id: string, status: string) {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to update reviews." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid review ID." };
    if (!reviewStatuses.has(status)) return { error: "Choose a valid review status." };

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) return { error: "Review not found." };

    revalidatePath(`/properties/${review.propertySlug}`);
    revalidatePath("/admin/reviews");
    return { review: serializeReview(review.toObject()) };
  } catch (error) {
    console.error("Unable to update review status:", error);
    return { error: "Review status could not be updated." };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to delete reviews." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid review ID." };

    const review = await Review.findByIdAndDelete(id);
    if (!review) return { error: "Review not found." };

    revalidatePath(`/properties/${review.propertySlug}`);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Unable to delete review:", error);
    return { error: "Review could not be deleted." };
  }
}
