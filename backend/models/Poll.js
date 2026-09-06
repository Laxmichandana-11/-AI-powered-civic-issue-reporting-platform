import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    options: [
      {
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voters: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        optionIndex: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
