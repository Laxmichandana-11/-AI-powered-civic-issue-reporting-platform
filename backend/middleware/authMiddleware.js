import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("authorization"); // case-insensitive
  console.log("🔍 Auth header received:", authHeader);

  const token = authHeader ? authHeader.replace("Bearer ", "") : null;

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    console.log("🔐 Incoming token:", token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("User not found for token ID:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      if (user.blockedUntil && user.blockedUntil < new Date()) {
        user.isBlocked = false;
        user.blockedUntil = null;
        user.blockedReason = null;
        await user.save();
      } else {
        return res.status(403).json({
          message: user.blockedUntil
            ? `Your account is blocked until ${user.blockedUntil.toDateString()}`
            : "Your account is blocked.",
        });
      }
    }
    req.user = { _id: user._id, role: user.role || "user" };
    req.userObj = user;

    console.log("Authenticated user:", user.name || user.email);
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
