import mongoose from "mongoose";

const PropertyImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    format: { type: String, default: "webp" },
    bytes: { type: Number, default: 0 },
    isCover: { type: Boolean, default: false },
  },
  { _id: false },
);

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ["Property", "Shortlet"], default: "Property" },
    type: { type: String, trim: true, default: "" },
    purpose: { type: String, enum: ["For Sale", "For Rent"], default: "For Sale" },
    price: { type: Number, min: 0, default: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    isDeal: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    guests: { type: Number, min: 0, max: 50, default: null },
    checkin: { type: String, default: "" },
    checkout: { type: String, default: "" },
    location: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    beds: { type: Number, min: 0, default: 0 },
    baths: { type: Number, min: 0, default: 0 },
    toilets: { type: Number, min: 0, default: 0 },
    description: { type: String, trim: true, default: "" },
    amenities: { type: [String], default: [] },
    images: { type: [PropertyImageSchema], default: [] },
    image: { type: String, default: "" },
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
    added: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Property =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

export default Property;
