import mongoose from "mongoose";
import Report from "../models/Report.js";
import User from "../models/User.js";

export const createReport = async (req, res) => {
  try {
    const { reporterId, reportedUsername, reason, details } = req.body;

    if (!reporterId || !reportedUsername || !reason) {
      return res.status(400).json({
        message:
          "reporterId, reportedUsername and reason are required fields.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reporterId)) {
      return res.status(400).json({ message: "Invalid reporterId." });
    }
    const reporter = await User.findById(reporterId);
    if (!reporter) {
      return res.status(404).json({ message: "Reporter user not found." });
    }
    const usernameTrimmed = reportedUsername.trim();
    const reportedUser = await User.findOne({ username: usernameTrimmed });

    if (!reportedUser) {
      return res
        .status(404)
        .json({ message: "Reported user (by username) not found." });
    }
    if (String(reporter._id) === String(reportedUser._id)) {
      return res
        .status(400)
        .json({ message: "You cannot report your own account." });
    }
    const report = await Report.create({
      reporter: reporter._id,
      reportedUser: reportedUser._id,
      reason,
      details: details || "",
    });
    const reportCount = await Report.countDocuments({
      reportedUser: reportedUser._id,
    });
    let userBlocked = false;
    if (reportCount >= 3 && !reportedUser.isBlocked) {
      reportedUser.isBlocked = true;
      await reportedUser.save().catch(() => {});
      userBlocked = true;
    }

    return res.status(201).json({
      message: userBlocked
        ? "Report submitted. The user has been blocked due to multiple reports."
        : "Report submitted successfully.",
      report,
      reportCount,
      userBlocked,
    });
  } catch (error) {
    console.error("Create report error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating report." });
  }
};
export const getMyReports = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const reports = await Report.find({ reporter: userId })
      .populate("reportedUser", "username isBlocked")
      .sort({ createdAt: -1 });

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Get My Reports error:", error);
    return res.status(500).json({ message: "Failed to load reports" });
  }
};