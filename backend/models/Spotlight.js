import mongoose from "mongoose";

const spotlightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    category: {
      type: String,
      enum: ["followers", "trending_post", "engagement", "achievement"],
      required: true,
    },

    
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion", 
      default: null,
    },

    title: { type: String, required: true },
    description: { type: String },

    
    score: { type: Number, default: 0 },

    
    milestoneKey: { type: String, index: true }, 

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Spotlight", spotlightSchema);
