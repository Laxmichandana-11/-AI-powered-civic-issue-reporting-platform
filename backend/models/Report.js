import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Harassment",
        "Abusive Language",
        "Violent Content",
        "Threats",
        "Cyberbullying",
        "Fake News",
        "Nudity",
        "Spam",
        "Suicidal Things",
        "Other",
      ],
    },
    
    details: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending",
    },
  },
  { timestamps: true }
);

reportSchema.index({ reportedUser: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
