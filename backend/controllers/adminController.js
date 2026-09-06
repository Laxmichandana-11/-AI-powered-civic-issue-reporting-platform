import Issue from "../models/Issues.js";
import User from "../models/User.js";
import Report from "../models/Report.js";

export const getAdminSummary = async (req, res) => {
  try {
    if ((req.userObj?.role || req.user?.role) !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const statusList = ["pending", "reviewed", "action_taken", "dismissed"];
    const reportStatusList = ["pending", "reviewed", "dismissed", "action_taken"];

    const [totalUsers, totalIssues, pendingIssues, totalReports, allUsers, recentIssues, recentReports] = await Promise.all([
      User.countDocuments(),
      Issue.countDocuments(),
      Issue.countDocuments({ status: "pending" }),
      Report.countDocuments(),
      User.find({}).select("name username email role isBlocked createdAt").sort({ createdAt: -1 }).limit(100).lean(),
      Issue.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .populate("user", "name username email")
        .lean(),
      Report.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .populate("reportedUser", "name email")
        .populate("reporter", "name email")
        .lean(),
    ]);

    const issueStatusBreakdown = await Promise.all(
      statusList.map(async (status) => {
        const count = await Issue.countDocuments({ status });
        return { status, count };
      })
    );

    const reportStatusBreakdown = await Promise.all(
      reportStatusList.map(async (status) => {
        const count = await Report.countDocuments({ status });
        return { status, count };
      })
    );

    res.json({
      summary: {
        totalUsers,
        totalIssues,
        pendingIssues,
        totalReports,
      },
      issueStatusBreakdown,
      reportStatusBreakdown,
      recentIssues,
      recentReports,
      users: allUsers,
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    if ((req.userObj?.role || req.user?.role) !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue status updated", issue });
  } catch (error) {
    console.error("Update issue status error:", error);
    res.status(500).json({ message: "Failed to update issue status" });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    if ((req.userObj?.role || req.user?.role) !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("reportedUser", "name email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report status updated", report });
  } catch (error) {
    console.error("Update report status error:", error);
    res.status(500).json({ message: "Failed to update report status" });
  }
};

export const blockUser = async (req, res) => {
  try {
    if ((req.userObj?.role || req.user?.role) !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { isBlocked, blockedReason, blockedUntil } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked, blockedReason, blockedUntil },
      { new: true }
    ).select("name email isBlocked blockedReason blockedUntil");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User status updated", user });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};
