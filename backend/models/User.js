import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    birth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    avatar: { type: String, default: "" },
    darkMode: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    likedIssues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
    joinedCommunities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    ],

    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String },
    blockedUntil: { type: Date, default: null },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
