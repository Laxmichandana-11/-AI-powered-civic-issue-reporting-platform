import Compare from "../models/compare.js";

export const createCompare = async (req, res) => {
  try {
    const { title, area1, area2, categories } = req.body;

    if (!title || !area1 || !area2) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const compare = await Compare.create({
      title,
      area1,
      area2,
      createdBy: req.user?._id,
      categories: (categories || []).map((c) => ({
        name: c,
        area1Votes: 0,
        area2Votes: 0,
        votes: [],
      }))
    });

    res.status(201).json(compare);
  } catch (err) {
    console.error("Create Compare Error:", err);
    res.status(500).json({ message: "Failed to create comparison" });
  }
};

export const getAllCompares = async (req, res) => {
  try {
    const compares = await Compare.find().sort({ createdAt: -1 });
    res.json(compares);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comparisons" });
  }
};

export const getCompareById = async (req, res) => {
  try {
    const compare = await Compare.findById(req.params.id);
    if (!compare) return res.status(404).json({ message: "Not found" });

    res.json(compare);
  } catch {
    res.status(500).json({ message: "Failed to fetch comparison" });
  }
};

export const voteCategory = async (req, res) => {
  try {
    const { categoryIndex, area } = req.body;
    const { id } = req.params;
    const userId = req.user?._id;

    const compare = await Compare.findById(id);
    if (!compare) return res.status(404).json({ message: "Comparison not found" });

    const category = compare.categories[categoryIndex];
    if (!category) return res.status(400).json({ message: "Invalid category index" });

    if (!category.votes) category.votes = [];

    const existingVote = category.votes.find((v) => v.user.toString() === userId.toString());

    if (existingVote) {
      if (existingVote.area === area) {
        category.votes = category.votes.filter((v) => v.user.toString() !== userId.toString());

        if (area === "area1" && category.area1Votes > 0) category.area1Votes--;
        if (area === "area2" && category.area2Votes > 0) category.area2Votes--;
      } else {
        if (existingVote.area === "area1") {
          category.area1Votes--;
          category.area2Votes++;
        } else {
          category.area2Votes--;
          category.area1Votes++;
        }
        existingVote.area = area;
      }
    } else {
      category.votes.push({ user: userId, area });
      if (area === "area1") category.area1Votes++;
      else category.area2Votes++;
    }

    await compare.save();
    res.json(compare);
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: "Vote failed" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const compare = await Compare.findById(req.params.id);
    if (!compare) return res.status(404).json({ message: "Compare not found" });

    const userId = req.user?._id;

    const index = compare.likes.findIndex((id) => id.toString() === userId.toString());

    if (index === -1) compare.likes.push(userId);
    else compare.likes.splice(index, 1);

    await compare.save();
    res.json(compare);
  } catch (err) {
    res.status(500).json({ message: "Like toggle failed" });
  }
};

export const deleteCompare = async (req, res) => {
  try {
    const compare = await Compare.findById(req.params.id);
    if (!compare) return res.status(404).json({ message: "Compare not found" });
    if (!compare.createdBy || compare.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await compare.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};



