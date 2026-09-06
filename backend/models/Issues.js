import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Road", "Garbage", "Water", "Electricity", "Other"],
      required: true,
    },
    image: { type: String },
    location: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "action_taken", "dismissed"],
      default: "pending",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
