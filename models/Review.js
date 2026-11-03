import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    propertySlug: { type: String, required: true, trim: true, index: true },
    propertyTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true },
);

ReviewSchema.index({ propertySlug: 1, status: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
