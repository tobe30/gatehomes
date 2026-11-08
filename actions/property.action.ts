"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";
import User from "@/models/User";
import Property from "@/models/Property";

const IMAGE_TRANSFORMATION = "c_limit,h_1600,w_2000";
const MAX_PROPERTY_IMAGES = 30;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

type PropertyImageInput = {
  url?: unknown;
  publicId?: unknown;
  width?: unknown;
  height?: unknown;
  format?: unknown;
  bytes?: unknown;
  isCover?: unknown;
};

type PropertyInput = Record<string, unknown>;
type ImageValidation =
  | { ok: false; error: string }
  | { ok: true; images: PropertyImageInput[] };
type PropertyValidation =
  | { ok: false; error: string }
  | { ok: true; data: Record<string, any> };

async function getAdmin() {
  const cookieStore = await cookies();
  const session = verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );
  if (!session || session.role !== "admin") return null;

  await connectDB();
  const user = await User.findOne({
    _id: session.sub,
    role: "admin",
    isActive: true,
  }).select("_id");

  return user;
}

function serializeProperty(property: Record<string, any>) {
  const { _id, ...safeProperty } = property;
  return {
    ...safeProperty,
    id: String(_id),
    added: safeProperty.added instanceof Date
      ? safeProperty.added.toISOString().slice(0, 10)
      : String(safeProperty.added || ""),
    images: (property.images || []).map((image: PropertyImageInput) => ({
      ...image,
      src: image.url,
    })),
  };
}

function validateImages(
  images: unknown,
  adminId: string,
  required: boolean,
): ImageValidation {
  if (!Array.isArray(images) || images.length > MAX_PROPERTY_IMAGES) {
    return { ok: false, error: "Add no more than 30 property images." };
  }
  if (required && images.length < 5) {
    return { ok: false, error: "Add at least 5 property images before publishing." };
  }

  const ownerFolder = `gatehomes/properties/${adminId}/`;
  for (const candidate of images) {
    const image = candidate as PropertyImageInput;
    if (!image || typeof image !== "object") {
      return { ok: false, error: "One of the selected images is invalid." };
    }
    let imageHost = "";
    try {
      imageHost = new URL(String(image.url || "")).hostname;
    } catch {
      return { ok: false, error: "One of the selected images has an invalid URL." };
    }
    if (
      imageHost !== "res.cloudinary.com" ||
      !String(image.publicId || "").startsWith(ownerFolder) ||
      !Number.isFinite(Number(image.bytes)) ||
      Number(image.bytes) <= 0 ||
      Number(image.bytes) > MAX_IMAGE_BYTES
    ) {
      return { ok: false, error: "An image failed validation. Please upload it again." };
    }
  }

  return { ok: true, images: images as PropertyImageInput[] };
}

function normalizeProperty(input: PropertyInput, adminId: string): PropertyValidation {
  const title = String(input?.title ?? "").trim();
  const category = input?.category === "Shortlet" ? "Shortlet" : "Property";
  const status = input?.status === "Draft" ? "Draft" : "Published";
  const price = Number(input?.price) || 0;
  const discountPrice = Number(input?.discountPrice) || null;
  const imagesResult = validateImages(
    input?.images,
    adminId,
    status === "Published",
  );

  if (!imagesResult.ok) return imagesResult;
  if (!title || title.length > 140) {
    return { ok: false, error: "Enter a title of no more than 140 characters." };
  }
  if (status === "Published") {
    if (!String(input?.type ?? "").trim()) return { ok: false, error: "Choose a property type." };
    if (price <= 0) return { ok: false, error: "Enter a price greater than zero." };
    if (!String(input?.location ?? "").trim()) return { ok: false, error: "Enter the listing location." };
    if (!String(input?.address ?? "").trim()) return { ok: false, error: "Enter the full address." };
    if (!String(input?.description ?? "").trim()) return { ok: false, error: "Add a description." };
    if (category === "Shortlet" && Number(input?.guests) < 1) {
      return { ok: false, error: "Enter the shortlet's maximum guest capacity." };
    }
  }
  if (category === "Shortlet" && Number(input?.guests) > 50) {
    return { ok: false, error: "Shortlet guest capacity cannot exceed 50." };
  }
  if (discountPrice && price && discountPrice >= price) {
    return { ok: false, error: "Discounted price must be lower than the regular price." };
  }
  if (input?.discountPrice && discountPrice === null) {
    return { ok: false, error: "Enter a valid discounted price." };
  }
  if (input?.isDeal && !discountPrice) {
    return { ok: false, error: "Add a discounted price before marking this as a deal." };
  }
  if (
    category === "Shortlet" &&
    input?.checkin &&
    input?.checkout &&
    String(input.checkout) <= String(input.checkin)
  ) {
    return { ok: false, error: "Check-out must be after check-in." };
  }

  const hasCoverSelection = imagesResult.images.some((image) => Boolean(image.isCover));
  const images = imagesResult.images.map((image, index) => ({
    url: String(image.url),
    publicId: String(image.publicId),
    width: Number(image.width) || 0,
    height: Number(image.height) || 0,
    format: String(image.format || "webp"),
    bytes: Number(image.bytes),
    isCover: hasCoverSelection ? Boolean(image.isCover) : index === 0,
  }));
  const coverImage = images.find((image) => image.isCover) || images[0];

  return {
    ok: true,
    data: {
      title,
      category,
      type: String(input?.type ?? "").trim(),
      purpose: input?.purpose === "For Rent" ? "For Rent" : "For Sale",
      price,
      discountPrice,
      isDeal: Boolean(input?.isDeal),
      isFeatured: Boolean(input?.isFeatured),
      guests: category === "Shortlet" ? Number(input?.guests) || null : null,
      checkin: category === "Shortlet" ? String(input?.checkin ?? "") : "",
      checkout: category === "Shortlet" ? String(input?.checkout ?? "") : "",
      location: String(input?.location ?? "").trim(),
      address: String(input?.address ?? "").trim(),
      beds: Number(input?.beds) || 0,
      baths: Number(input?.baths) || 0,
      toilets: Number(input?.toilets) || 0,
      description: String(input?.description ?? "").trim(),
      amenities: Array.isArray(input?.amenities)
        ? input.amenities.map((item) => String(item).slice(0, 60)).slice(0, 30)
        : [],
      images,
      image: coverImage?.url || "",
      status,
    },
  };
}

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${base || "property"}-${randomUUID().slice(0, 8)}`;
}

export async function signPropertyImageUploadAction() {
  try {
    const admin = await getAdmin();
    if (!admin) return { error: "Sign in as an admin to upload property images." };

    const { api_key: apiKey, api_secret: apiSecret, cloud_name: cloudName } =
      cloudinary.config();
    if (!apiKey || !apiSecret || !cloudName) {
      return { error: "Cloudinary is not configured on the server." };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `gatehomes/properties/${admin._id}/${randomUUID()}`;
    const params = {
      timestamp,
      public_id: publicId,
      transformation: IMAGE_TRANSFORMATION,
    };

    return {
      signature: cloudinary.utils.api_sign_request(params, apiSecret),
      timestamp,
      publicId,
      transformation: IMAGE_TRANSFORMATION,
      apiKey,
      cloudName,
    };
  } catch (error) {
    console.error("Unable to authorize property image upload:", error);
    return { error: "Image upload is temporarily unavailable." };
  }
}

export async function getAdminPropertiesAction() {
  try {
    const admin = await getAdmin();
    if (!admin) return { error: "You are not authorized to view properties." };
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
    return { properties: properties.map(serializeProperty) };
  } catch (error) {
    console.error("Unable to load properties:", error);
    return { error: "Properties could not be loaded." };
  }
}

export async function createPropertyAction(input: PropertyInput) {
  try {
    const admin = await getAdmin();
    if (!admin) return { error: "You are not authorized to add properties." };
    const normalized = normalizeProperty(input, String(admin._id));
    if (!normalized.ok) return { error: normalized.error };

    const property = await Property.create({
      ...normalized.data,
      slug: makeSlug(String(normalized.data.title)),
    });
    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath("/properties/[slug]", "page");
    revalidatePath("/admin/properties");
    return { property: serializeProperty(property.toObject()) };
  } catch (error) {
    console.error("Property creation failed:", error);
    return { error: "Property could not be saved. Please try again." };
  }
}

export async function updatePropertyAction(id: string, input: PropertyInput) {
  try {
    const admin = await getAdmin();
    if (!admin) return { error: "You are not authorized to edit properties." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid property ID." };

    const normalized = normalizeProperty(input, String(admin._id));
    if (!normalized.ok) return { error: normalized.error };

    const property = await Property.findById(id);
    if (!property) return { error: "Property not found." };
    const previousImageIds = property.images.map((image: { publicId: string }) => image.publicId);

    Object.assign(property, normalized.data);
    await property.save();

    const retainedImageIds = new Set(normalized.data.images.map((image: { publicId: string }) => image.publicId));
    const removedImageIds = previousImageIds.filter((publicId: string) => !retainedImageIds.has(publicId));
    if (removedImageIds.length) {
      await Promise.allSettled(removedImageIds.map((publicId: string) => cloudinary.uploader.destroy(publicId)));
    }

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath("/properties/[slug]", "page");
    revalidatePath("/admin/properties");
    return { property: serializeProperty(property.toObject()) };
  } catch (error) {
    console.error("Property update failed:", error);
    return { error: "Property could not be updated. Please try again." };
  }
}

export async function deletePropertyAction(id: string) {
  try {
    const admin = await getAdmin();
    if (!admin) return { error: "You are not authorized to delete properties." };
    if (!/^[a-f\d]{24}$/i.test(String(id))) return { error: "Invalid property ID." };

    const property = await Property.findByIdAndDelete(id).lean();
    if (!property) return { error: "Property not found." };

    await Promise.allSettled(
      (property.images || []).map((image: { publicId: string }) => cloudinary.uploader.destroy(image.publicId)),
    );
    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath("/properties/[slug]", "page");
    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Property deletion failed:", error);
    return { error: "Property could not be deleted. Please try again." };
  }
}
