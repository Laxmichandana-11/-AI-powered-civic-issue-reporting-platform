import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    avatar: { type: String },
    totalPosts: { type: Number, default: 0 },
    totalCampaigns: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    totalReports: { type: Number, default: 0 },
    activityScore: { type: Number, default: 0 }, // composite score of contributions
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
