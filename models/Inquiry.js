import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    propertySlug: { type: String, required: true, trim: true },
    propertyTitle: { type: String, required: true, trim: true },
    propertyImage: { type: String, default: "" },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 150 },
    requestType: {
      type: String,
      enum: ["Normal stay", "Get together", "Party"],
      required: true,
    },
    preferredDate: { type: String, default: "", trim: true, maxlength: 10 },
    guests: { type: Number, required: true, min: 1, max: 50 },
    message: { type: String, default: "", trim: true, maxlength: 1000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

InquirySchema.index({ createdAt: -1 });

const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);

export default Inquiry;
