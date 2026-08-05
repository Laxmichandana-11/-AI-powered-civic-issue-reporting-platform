import Report from "../models/Report.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Middleware helper to check admin role inside controllers
const ensureAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return false;
  }
  return true;
};

// List reports with optional filters (admin)
const listReportsAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Admin list reports error", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update status of a report (admin)
const updateReportStatus = async (req, res) => {
  if (!ensureAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    report.status = status;
    await report.save();
    return res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Update status error", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Delete report (admin) - also delete uploaded file if exists
const deleteReportAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    // Soft-delete: mark as archived instead of permanent removal
    report.archived = true;
    report.archivedAt = new Date();
    report.archivedBy = req.user.id;
    await report.save();
    return res.status(200).json({ success: true, message: "Report archived" });
  } catch (error) {
    console.error("Delete report error", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Restore an archived report (admin)
const restoreReportAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    report.archived = false;
    report.archivedAt = undefined;
    report.archivedBy = undefined;
    await report.save();
    return res.status(200).json({ success: true, message: "Report restored", report });
  } catch (error) {
    console.error("Restore report error", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// List users (admin)
const listUsersAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;
  try {
    const users = await User.find().select("-password").lean();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("List users error", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Delete a user (admin)
const deleteUserAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await user.remove();
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Delete user error", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export { listReportsAdmin, updateReportStatus, deleteReportAdmin, listUsersAdmin, deleteUserAdmin, restoreReportAdmin };
