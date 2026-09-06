import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Heart, Loader2, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

export default function MyLikes() {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null); // ✅ for card view
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/user/mylikes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 px-6 py-8 transition-all duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 mb-6 hover:text-purple-800 transition"
      >
        <ArrowLeft className="mr-2 w-5 h-5" /> Back
      </button>

      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center">
        Posts I Liked
      </h1>

      {/* Loading / Empty / List */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="animate-spin text-purple-600" size={36} />
        </div>
      ) : liked.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486742.png"
            alt="Empty"
            className="w-32 mb-4 opacity-90"
          />
          <p className="text-gray-600 text-lg">
            You haven’t liked any posts yet.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {liked.map((issue, index) => (
            <motion.div
              key={issue._id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedIssue(issue)}           // ✅ open card
              className="cursor-pointer bg-gradient-to-br from-purple-50 to-purple-200 shadow-md rounded-2xl p-5 border border-purple-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              role="button"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-lg text-purple-900 mb-2">
                  {issue.title}
                </h2>
                <Heart
                  size={20}
                  className="text-red-500 fill-red-500 group-hover:scale-110 transition-transform"
                />
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                {issue.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{issue.location || "Unknown"}</span>
                </div>
                <span>
                  {issue.createdAt
                    ? new Date(issue.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ✅ Detail card modal */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIssue(null)} // close on background click
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-[90%] p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-white"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking card
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedIssue(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-purple-900">
                  {selectedIssue.title}
                </h2>
                <Heart className="text-red-500 fill-red-500" size={22} />
              </div>

              <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                {selectedIssue.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{selectedIssue.location || "Unknown location"}</span>
                </div>
                {selectedIssue.createdAt && (
                  <span>
                    {new Date(selectedIssue.createdAt).toLocaleString()}
                  </span>
                )}
                {selectedIssue.category && (
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                    {selectedIssue.category}
                  </span>
                )}
              </div>

              {/* if you later have comments / more fields, you can render them here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
