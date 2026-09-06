import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  area1Votes: { type: Number, default: 0 },
  area2Votes: { type: Number, default: 0 },
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      area: { type: String, enum: ["area1", "area2"] },
    },
  ],
});

const compareSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    area1: { type: String, required: true },
    area2: { type: String, required: true },
    categories: [categorySchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Compare", compareSchema);
