"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import User from "@/models/User";
import Property from "@/models/Property";
import Video from "@/models/Video";

function extractYouTubeId(value: string) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let id = "";

    if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      else if (/^\/(embed|shorts|live)\//.test(url.pathname)) id = url.pathname.split("/")[2] || "";
    }

    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

async function getSignedInAdmin() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session || session.role !== "admin") return null;

  await connectDB();
  return User.findOne({ _id: session.sub, role: "admin", isActive: true }).select("_id");
}

function serializeVideo(video: Record<string, any>) {
  return {
    id: String(video._id),
    title: video.title,
    description: video.description || "",
    youtubeId: video.youtubeId,
    youtubeUrl: video.youtubeUrl,
    propertyId: video.property ? String(video.property) : "",
    propertyTitle: video.propertyTitle || "",
    propertySlug: video.propertySlug || "",
    status: video.status,
    added: video.createdAt instanceof Date
      ? video.createdAt.toISOString()
      : new Date(video.createdAt).toISOString(),
  };
}

export async function getAdminVideosAction() {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to view videos." };

    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return { videos: videos.map(serializeVideo) };
  } catch (error) {
    console.error("Unable to load videos:", error);
    return { error: "Videos could not be loaded." };
  }
}

export async function createVideoAction(input: Record<string, unknown>) {
  const title = String(input?.title ?? "").trim();
  const description = String(input?.description ?? "").trim();
  const youtubeUrl = String(input?.youtubeUrl ?? "").trim();
  const youtubeId = extractYouTubeId(youtubeUrl);
  const propertyId = String(input?.propertyId ?? "").trim();
  const status = input?.status === "Published" ? "Published" : "Draft";

  if (title.length < 3 || title.length > 120) {
    return { error: "Enter a video title between 3 and 120 characters." };
  }
  if (description.length > 600) {
    return { error: "Video description must be 600 characters or fewer." };
  }
  if (!youtubeId) {
    return { error: "Enter a valid YouTube video link." };
  }

  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "Your admin session has expired. Sign in again." };

    let property: { _id: any; title: string; slug: string } | null = null;
    if (propertyId) {
      if (!/^[a-f\d]{24}$/i.test(propertyId)) return { error: "Choose a valid listing." };
      property = await Property.findOne({ _id: propertyId, status: "Published" }).select("_id title slug").lean();
      if (!property) return { error: "The selected listing could not be found." };
    }

    const video = await Video.create({
      title,
      description,
      youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      property: property?._id || null,
      propertyTitle: property?.title || "",
      propertySlug: property?.slug || "",
      status,
    });

    revalidatePath("/");
    revalidatePath("/admin/videos");
    return { video: serializeVideo(video.toObject()) };
  } catch (error) {
    console.error("Unable to save video:", error);
    return { error: "Video could not be saved. Please try again." };
  }
}

export async function updateVideoStatusAction(id: string, status: string) {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to update videos." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid video ID." };
    if (status !== "Published" && status !== "Draft") return { error: "Choose a valid video status." };

    const video = await Video.findByIdAndUpdate(id, { status }, { new: true });
    if (!video) return { error: "Video not found." };

    revalidatePath("/");
    revalidatePath("/admin/videos");
    return { video: serializeVideo(video.toObject()) };
  } catch (error) {
    console.error("Unable to update video status:", error);
    return { error: "Video status could not be updated." };
  }
}

export async function deleteVideoAction(id: string) {
  try {
    const admin = await getSignedInAdmin();
    if (!admin) return { error: "You are not authorized to delete videos." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid video ID." };

    const video = await Video.findByIdAndDelete(id);
    if (!video) return { error: "Video not found." };

    revalidatePath("/");
    revalidatePath("/admin/videos");
    return { success: true };
  } catch (error) {
    console.error("Unable to delete video:", error);
    return { error: "Video could not be deleted." };
  }
}
