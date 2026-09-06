import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const discussionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },

    likes: { type: Number, default: 0 },

    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);
