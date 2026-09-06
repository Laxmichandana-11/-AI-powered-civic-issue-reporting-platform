import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Monitor,
  Heart,
  Globe,
  Trash2,
  Bell,
  LogOut,
  Edit,
  Users,
  BookOpen,
  Flag,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [stats, setStats] = useState({ posts: 0, likes: 0, communities: 0 });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);

 
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      else {
        toast.error("Please login first");
        navigate("/login");
      }
    }
  }, [user, setUser, navigate]);

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:4000/api/user/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Stats error:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, []);

  const getAvatar = () => {
    if (user?.avatar) return user.avatar;

    const gender = user?.gender?.toString().toLowerCase();
    if (gender === "female" || gender === "f") {
      return "https://cdn-icons-png.flaticon.com/512/4140/4140046.png";
    } else if (gender === "male" || gender === "m") {
      return "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
    } else {
      return null;
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

 
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:4000/api/user/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Account deleted successfully!");
      navigate("/signup");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 text-gray-900 flex flex-col items-center px-6 py-10">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center text-purple-600 hover:text-purple-800 font-medium transition"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      {/* 👤 Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-10"
      >
        <motion.div
          className="relative w-32 h-32 mx-auto mb-4"
          whileHover={{ scale: 1.05 }}
        >
          {getAvatar() ? (
            <img
              src={getAvatar()}
              alt="profile"
              className="w-full h-full rounded-full border-4 border-purple-400 object-cover shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-purple-400 bg-purple-100 text-purple-700 flex items-center justify-center shadow-lg">
              <User size={54} />
            </div>
          )}
          <motion.button
            onClick={() => navigate("/edit-profile")}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-1 right-1 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 shadow-md transition"
          >
            <Edit size={14} />
          </motion.button>
        </motion.div>

        <h2 className="text-2xl font-extrabold text-purple-800">@{user.username}</h2>
        <p className="text-gray-500">{user.email}</p>

        {/* 📊 Stats */}
        <motion.div
          className="flex justify-center gap-8 mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard label="Posts" value={stats.posts} icon={<BookOpen />} />
          <StatCard label="Likes" value={stats.likes} icon={<Heart />} />
          <StatCard
            label="Communities"
            value={stats.communities}
            icon={<Users />}
          />
        </motion.div>
      </motion.div>

      {/* ⚙️ Options List */}
      <motion.div
        className="mt-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-purple-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="space-y-4">
          <ProfileRow
            icon={<Monitor size={20} />}
            label="My Posts"
            onClick={() => navigate("/myposts")}
          />
          <ProfileRow
            icon={<Heart size={20} />}
            label="My Likes"
            onClick={() => navigate("/mylikes")}
          />

          {/* ✅ NEW: My Reports */}
          <ProfileRow
            icon={<Flag size={20} />}
            label="My Reports"
            onClick={() => navigate("/my-reports")}
          />

          {/* 🔔 Notification Toggle */}
          <div
            onClick={() => setNotificationsOn(!notificationsOn)}
            className="flex items-center justify-between border-b border-gray-200 pb-3 cursor-pointer hover:text-purple-700 transition"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <Bell className="text-purple-500" size={20} />
              <span className="font-medium">Notifications</span>
            </div>
            <motion.div
              className="w-11 h-6 rounded-full flex items-center p-1"
              animate={{
                backgroundColor: notificationsOn ? "#7C3AED" : "#E5E7EB",
              }}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: notificationsOn ? 20 : 0 }}
              />
            </motion.div>
          </div>

          <ProfileRow
            icon={<Trash2 size={20} />}
            label="Delete Account"
            onClick={() => setShowDeleteModal(true)}
          />
          <ProfileRow
            icon={<LogOut size={20} />}
            label="Log Out"
            onClick={() => setShowLogoutModal(true)}
          />
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-400 mt-10"
      >
        App Version 2.3
      </motion.p>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <Modal
            title="Log Out?"
            message="Are you sure you want to log out from your account?"
            confirmLabel="Log Out"
            confirmColor="purple"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal
            title="Delete Account?"
            message="Are you sure? This action cannot be undone."
            confirmLabel="Delete"
            confirmColor="red"
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


function ProfileRow({ icon, label, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex items-center justify-between cursor-pointer border-b border-gray-200 pb-3 text-gray-700 hover:text-purple-700 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-purple-500">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-sm opacity-60">›</span>
    </motion.div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 px-4 py-3 rounded-xl shadow-md border border-purple-100"
    >
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-lg font-bold text-purple-700">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.div>
  );
}

function Modal({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl w-80 text-center shadow-2xl border-t-4"
        style={{
          borderColor: confirmColor === "red" ? "#EF4444" : "#7C3AED",
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 mb-5 text-sm">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-xl transition ${
              confirmColor === "red"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
