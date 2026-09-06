import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String },
    population: { type: Number },
    cleanlinessScore: { type: Number, default: 0 },
    infrastructureScore: { type: Number, default: 0 },
    safetyScore: { type: Number, default: 0 },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Area", areaSchema);
