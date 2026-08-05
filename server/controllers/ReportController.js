import mongoose from "mongoose";
import Report from "../models/Report.js";
import Comment from "../models/Comment.js";

// Toggle like for a report
const likeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    const likedIndex = report.likes.findIndex((u) => u.toString() === userId);
    if (likedIndex === -1) {
      report.likes.push(userId);
    } else {
      report.likes.splice(likedIndex, 1);
    }

    await report.save();

    return res.status(200).json({ success: true, likes: report.likes.length });
  } catch (error) {
    console.error("Like Report Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Delete a comment (author or admin)
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params; // id is report id
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // allow deletion if author or admin
    if (comment.author.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await comment.remove();
    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Create a new report (expects multipart/form-data)
const createReport = async (req, res) => {
  try {
    const { title, description, category, severity, location } = req.body;

    const newReport = new Report({
      title,
      description,
      category,
      severity: severity || "low",
      reporter: req.user?.id,
    });

    // parse location if sent as JSON string
    if (location) {
      try {
        newReport.location = typeof location === "string" ? JSON.parse(location) : location;
      } catch (e) {
        newReport.location = { address: location };
      }
    }

    if (req.file) {
      newReport.imagePath = `/uploads/${req.file.filename}`;
    }

    await newReport.save();

    return res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    console.error("Create Report Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get reports with pagination and optional filters
const getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const category = req.query.category;
    const status = req.query.status;
    const search = req.query.search;
    // archived query: default exclude archived unless explicitly asked
    const archivedQuery = req.query.archived === "true" ? true : req.query.archived === "false" ? false : undefined;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (typeof archivedQuery !== "undefined") query.archived = archivedQuery;
    else query.archived = false;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];

    const total = await Report.countDocuments(query);
    const pages = Math.ceil(total / limit);

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true, reports, page, pages, total });
  } catch (error) {
    console.error("Get Reports Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get single report with comments
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id).lean();
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    const comments = await Comment.find({ report: id }).populate("author", "fullName email").sort({ createdAt: -1 }).lean();

    return res.status(200).json({ success: true, report, comments });
  } catch (error) {
    console.error("Get Report Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Add comment to a report (protected)
const addComment = async (req, res) => {
  try {
    const { id } = req.params; // report id
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content required" });
    }

    const comment = await Comment.create({ report: id, author: req.user.id, content });

    const populated = await comment.populate("author", "fullName email");

    return res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// (old export removed — consolidated at end)

// Get aggregated stats for dashboard
const getStats = async (req, res) => {
  try {
    const total = await Report.countDocuments({ archived: { $ne: true } });

    const byCategory = await Report.aggregate([
      { $match: { archived: { $ne: true } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const byStatus = await Report.aggregate([
      { $match: { archived: { $ne: true } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const bySeverity = await Report.aggregate([
      { $match: { archived: { $ne: true } } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({ success: true, total, byCategory, byStatus, bySeverity });
  } catch (error) {
    console.error("Get Stats Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get recent reports (public)
const getRecentReports = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);
    const reports = await Report.find({ archived: { $ne: true } }).sort({ createdAt: -1 }).limit(limit).lean();
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Get Recent Reports Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get recent activity including reports and comments
const getActivity = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 50);

    const reports = await Report.find({ archived: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("reporter", "fullName")
      .lean();

    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "fullName")
      .populate({ path: "report", select: "title" })
      .lean();

    const combined = [
      ...reports.map((report) => ({
        type: "report",
        createdAt: report.createdAt,
        title: report.title,
        category: report.category,
        reporter: report.reporter?.fullName || "Unknown",
        reportId: report._id,
      })),
      ...comments.map((comment) => ({
        type: "comment",
        createdAt: comment.createdAt,
        content: comment.content,
        author: comment.author?.fullName || "Unknown",
        reportTitle: comment.report?.title || "Unknown report",
        reportId: comment.report?._id,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return res.status(200).json({ success: true, activity: combined });
  } catch (error) {
    console.error("Get Activity Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get authenticated user's recent reports with counts
const getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);

    const reports = await Report.aggregate([
      { $match: { reporter: new mongoose.Types.ObjectId(userId), archived: { $ne: true } } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "report",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likesCount: { $size: "$likes" },
        },
      },
      { $project: { comments: 0 } },
    ]);

    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Get My Reports Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get authenticated user's activity
const getMyActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);

    const reports = await Report.find({ reporter: userId, archived: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const comments = await Comment.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "report", select: "title status" })
      .lean();

    return res.status(200).json({ success: true, reports, comments });
  } catch (error) {
    console.error("Get My Activity Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export { createReport, getReports, getReportById, addComment, likeReport, deleteComment, getStats, getRecentReports, getMyReports, getActivity, getMyActivity };

