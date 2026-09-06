import Discussion from "../models/Discussion.js";

export const createDiscussion = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const discussion = await Discussion.create({
      user: req.user._id,
      content,
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error("createDiscussion error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (err) {
    console.error("getDiscussions error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const likeDiscussion = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Login required" });
    }

    const userId = req.user._id;
    let post = await Discussion.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const userIdStr = userId.toString();
    const index = post.likedBy.findIndex((id) => id.toString() === userIdStr);

    let liked;

    if (index !== -1) {
      post.likedBy.splice(index, 1);
      post.likes = Math.max(0, post.likes - 1);
      liked = false;
    } else {
      post.likedBy.push(userId);
      post.likes = post.likes + 1;
      liked = true;
    }

    await post.save();

    return res.status(200).json({
      likes: post.likes,
      liked,
    });
  } catch (err) {
    console.error("likeDiscussion error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Login required" });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    let post = await Discussion.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user._id,
      content,
    });

    await post.save();

    post = await Discussion.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    res.status(201).json(post);
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Login required" });
    }

    const { id: postId, commentId } = req.params;

    let post = await Discussion.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = post.comments[index];
    const userIdStr = req.user._id.toString();

    const isCommentOwner = comment.user.toString() === userIdStr;
    const isPostOwner = post.user.toString() === userIdStr;

    if (!isCommentOwner && !isPostOwner) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete comment" });
    }

    post.comments.splice(index, 1);
    await post.save();

    post = await Discussion.findById(postId)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    return res.status(200).json(post);
  } catch (err) {
    console.error("deleteComment error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Login required" });
    }

    const post = await Discussion.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this discussion" });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Discussion deleted", id: post._id });
  } catch (err) {
    console.error("deleteDiscussion error:", err);
    res.status(500).json({ message: err.message });
  }
};
