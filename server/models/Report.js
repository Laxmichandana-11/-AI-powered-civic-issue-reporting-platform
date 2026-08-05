import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String,
});

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, default: "low" },
    status: { type: String, default: "open" },
    location: LocationSchema,
    imagePath: { type: String },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    archived: { type: Boolean, default: false },
    archivedAt: { type: Date },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);

export default Report;
