import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 600 },
    youtubeId: { type: String, required: true, match: /^[A-Za-z0-9_-]{11}$/ },
    youtubeUrl: { type: String, required: true, trim: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: null },
    propertyTitle: { type: String, default: "", trim: true },
    propertySlug: { type: String, default: "", trim: true },
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
  },
  { timestamps: true },
);

VideoSchema.index({ createdAt: -1 });

const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);

export default Video;
