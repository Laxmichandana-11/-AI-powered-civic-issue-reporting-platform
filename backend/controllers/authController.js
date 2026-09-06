
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const getSafeUserPayload = (user) => ({
  _id: user._id,
  username: user.username,
  name: user.name,
  email: user.email,
  phone: user.phone,
  birth: user.birth,
  gender: user.gender,
  avatar: user.avatar,
  role: user.role || "user",
});

const getAvatarByGender = (gender = "male") => {
  gender = (gender || "male").toLowerCase();
  if (gender === "female") return "https://avatar.iran.liara.run/public/girl?random=1";
  if (gender === "male") return "https://avatar.iran.liara.run/public/boy?random=1";
  return "https://avatar.iran.liara.run/public";
};

export const register = async (req, res) => {
  try {
    const { username, name, email, password, phone, birth, gender } = req.body;
    const requestedRole = req.body.role === "admin" ? "admin" : "user";

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "username, name, email and password are required" });
    }

    const emailNorm = email.toLowerCase().trim();
    const usernameNorm = username.trim();

    const existingEmail = await User.findOne({ email: emailNorm });
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    const existingUsername = await User.findOne({ username: usernameNorm });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = getAvatarByGender(gender);

    const user = await User.create({
      username: usernameNorm,
      name: name.trim(),
      email: emailNorm,
      password: hashedPassword,
      phone,
      birth,
      gender,
      avatar: avatarUrl,
      role: requestedRole,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: getSafeUserPayload(user),
    });
  } catch (err) {
    console.error(" Register error:", err);

    if (err.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0];
      return res.status(400).json({ message: `${key} already exists` });
    }

    res.status(500).json({ message: "Server error while registering" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      message: "Login successful",
      token,
      user: getSafeUserPayload(user),
    });
  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({ message: "Server error while logging in" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.avatar = `uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
