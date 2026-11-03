import { connectDB } from "@/lib/db";

export async function POST() {
  try {
    await connectDB();

    return Response.json({
      status: "ok",
      message: "MongoDB connection is working.",
    });
  } catch (error) {
    console.error("MongoDB connection check failed:", error);

    return Response.json(
      {
        status: "error",
        message: "Could not connect to MongoDB. Check the server configuration.",
      },
      { status: 503 },
    );
  }
}
