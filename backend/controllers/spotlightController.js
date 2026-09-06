import Spotlight from "../models/Spotlight.js";
import User from "../models/User.js";
import Discussion from "../models/Discussion.js";
export const createSpotlight = async (req, res) => {
  try {
    const { user, category, title, description, score, post, milestoneKey } =
      req.body;

    if (!user || !category || !title)
      return res.status(400).json({ message: "Missing required fields" });

    const spotlight = await Spotlight.create({
      user,
      category,
      title,
      description,
      score,
      post: post || null,
      milestoneKey,
    });

    res
      .status(201)
      .json({ message: "Spotlight created successfully", spotlight });
  } catch (err) {
    console.error("❌ Spotlight create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCommonSpotlights = async (req, res) => {
  try {
    const spotlights = await Spotlight.find()
      .populate("user", "name avatar followersCount")
      .sort({ score: -1, createdAt: -1 })
      .limit(20);

    res.json(spotlights);
  } catch (err) {
    console.error("❌ Get common spotlights error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySpotlights = async (req, res) => {
  try {
    const mySpotlights = await Spotlight.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(mySpotlights);
  } catch (err) {
    console.error("❌ Get my spotlights error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAndCreateSpotlightsForPost = async (userId, postDoc) => {
  try {
    if (!userId || !postDoc?._id) return;

    const postCount = await Discussion.countDocuments({ user: userId });

    if (postCount >= 1000) {
      const milestoneKey = "1K_POSTS";

      const existing = await Spotlight.findOne({
        user: userId,
        milestoneKey,
      });

      if (!existing) {
        await Spotlight.create({
          user: userId,
          category: "achievement",
          title: "1K Posts Completed 🎯",
          description:
            "You’ve created 1,000 posts on Meri Awaaj. Your voice truly matters!",
          score: postCount,
          milestoneKey,
        });
      }
    }
    const likes = postDoc.likesCount || postDoc.likes || 0;
    const createdAt = postDoc.createdAt || new Date();

    const likeMilestones = [
      { value: 100, key: "POST_100_LIKES" },
      { value: 1000, key: "POST_1K_LIKES" },
      { value: 10000, key: "POST_10K_LIKES" },
    ];

    for (const milestone of likeMilestones) {
      if (likes >= milestone.value) {
        const milestoneKey = `${milestone.key}_${postDoc._id}`;

        const exists = await Spotlight.findOne({
          user: userId,
          milestoneKey,
        });

        if (!exists) {
          const minutesSincePost =
            (Date.now() - new Date(createdAt).getTime()) / (1000 * 60);
          const likesPerMinute =
            minutesSincePost > 0 ? likes / minutesSincePost : likes;
          const engagementScore = Math.round(likesPerMinute * 10 + likes);

          await Spotlight.create({
            user: userId,
            category: "trending_post",
            post: postDoc._id,
            title: `Post reached ${milestone.value.toLocaleString()} likes 🚀`,
            description:
              "Your post is trending in the community with amazing engagement.",
            score: engagementScore,
            milestoneKey,
          });
        }
      }
    }
  } catch (err) {
    console.error("❌ Auto spotlight generation error:", err);
  }
};
