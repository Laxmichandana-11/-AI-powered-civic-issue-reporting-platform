
import Issue from "../models/Issues.js";
export const createIssue = async (req, res) => {
  try {
    console.log("📸 Uploaded file info:", req.file);

    let imageUrl = "";
    if (req.file) {
      if (req.file.secure_url) {
        imageUrl = req.file.secure_url;
      } else if (req.file.path) {
        const normalizedPath = req.file.path.replace(/\\/g, "/");
        const uploadIndex = normalizedPath.lastIndexOf("/uploads/");
        imageUrl = uploadIndex !== -1 ? normalizedPath.slice(uploadIndex) : `/uploads/${req.file.filename}`;
      } else if (req.file.filename) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const issue = new Issue({
      ...req.body,
      user: req.user._id,
      image: imageUrl,
    });

    await issue.save();
    console.log("Issue created with image:", imageUrl);
    res.status(201).json(issue);
  } catch (error) {
    console.error(" Create Issue Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).populate("user", "name avatar");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const userId = req.user._id.toString();
    issue.dislikes = issue.dislikes.filter((id) => id.toString() !== userId);

    if (issue.likes.some((id) => id.toString() === userId)) {
      issue.likes = issue.likes.filter((id) => id.toString() !== userId);
    } else {
      issue.likes.push(userId);
    }

    await issue.save();
    res.json({ likes: issue.likes, dislikes: issue.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dislikeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const userId = req.user._id.toString();
    issue.likes = issue.likes.filter((id) => id.toString() !== userId);

    if (issue.dislikes.some((id) => id.toString() === userId)) {
      issue.dislikes = issue.dislikes.filter((id) => id.toString() !== userId);
    } else {
      issue.dislikes.push(userId);
    }

    await issue.save();
    res.json({ likes: issue.likes, dislikes: issue.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    issue.comments.push(comment);
    await issue.save();

    const populated = await issue.populate("comments.user", "name");
    res.json(populated.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getComments = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "comments.user",
      "name"
    );
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json(issue.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.comments = issue.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    await issue.save();

    res.json(issue.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (issue.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this issue" });
    }

    await issue.deleteOne();
    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error("Delete issue error:", err);
    res.status(500).json({ message: "Server error while deleting issue" });
  }
};
