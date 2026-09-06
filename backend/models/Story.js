import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issueSummary: {
      type: String,
      required: true,
      trim: true,
    },
    impact: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
