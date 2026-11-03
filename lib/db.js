import mongoose from "mongoose";

const globalForMongoose = globalThis;

const cached = globalForMongoose.mongoose ?? {
  connection: null,
  promise: null,
};

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}

export async function connectDB() {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not configured");
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUrl).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  cached.connection = await cached.promise;
  return cached.connection;
}
