import Story from "../models/Story.js";

const normalizePath = (file) => {
  if (!file) return "";
  let p = file.path.replace(/\\/g, "/");
  const uploadsIndex = p.lastIndexOf("/uploads/");

  if (uploadsIndex !== -1) {
    p = p.slice(uploadsIndex);
  } else if (file.filename) {
    p = `/uploads/${file.filename}`;
  }

  if (!p.startsWith("/")) p = "/" + p;
  return p;
};

export const createStory = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, issueSummary, impact, location } = req.body;

    if (!title || !issueSummary) {
      return res
        .status(400)
        .json({ message: "Title and issue summary are required" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => normalizePath(file));
    }

    const story = await Story.create({
      user: userId,
      title,
      issueSummary,
      impact,
      location,
      images: imageUrls,
    });

    await story.populate("user", "name avatar");

    res.status(201).json({
      message: "Story created successfully",
      story,
    });
  } catch (err) {
    console.error("❌ Create story error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    console.error("❌ Get stories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyStories = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const stories = await Story.find({ user: userId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    console.error("❌ Get my stories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
