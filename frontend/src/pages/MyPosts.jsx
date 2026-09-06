import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, MapPin, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const BACKEND_URL = "http://localhost:4000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/user/myposts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const deleted = posts.find((p) => p._id === deleteId);
      await axios.delete(`${BACKEND_URL}/api/issues/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== deleteId));
      setRecentlyDeleted(deleted);
      setDeleteId(null);
      setTimeout(() => setRecentlyDeleted(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!recentlyDeleted) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BACKEND_URL}/api/issues`, recentlyDeleted, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentlyDeleted(null);
    } catch (err) {
      console.error("Undo failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 px-6 py-8 transition-all duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 mb-6 hover:text-purple-800 transition"
      >
        <ArrowLeft className="mr-2 w-5 h-5" /> Back
      </button>

      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center">
        My Reported Issues
      </h1>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="animate-spin text-purple-600" size={36} />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486750.png"
            alt="Empty"
            className="w-32 mb-4 opacity-90"
          />
          <p className="text-gray-600 text-lg">
            You haven’t reported any issues yet.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((issue, index) => (
            <motion.div
              key={issue._id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gradient-to-br from-purple-50 to-purple-200 shadow-md rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="cursor-pointer p-5 flex justify-between items-start"
                onClick={() => toggleExpand(issue._id)}
              >
                <div>
                  <h2 className="font-bold text-lg text-purple-900 mb-1">
                    {issue.title}
                  </h2>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {issue.description}
                  </p>
                </div>
                {expandedId === issue._id ? (
                  <ChevronUp className="text-purple-600" />
                ) : (
                  <ChevronDown className="text-purple-600" />
                )}
              </div>

              {/* Expanded Section */}
              <AnimatePresence>
                {expandedId === issue._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 space-y-3 border-t border-purple-100 bg-white/70"
                  >
                    {issue.image && (
                      <img
                        src={issue.image}
                        alt="Issue"
                        className="rounded-lg w-full h-48 object-cover border border-purple-100"
                      />
                    )}
                    <p className="text-gray-800 text-sm">{issue.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{issue.location || "Unknown"}</span>
                      </div>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Delete Button */}
                    <div className="flex justify-end pt-3">
                      <button
                        onClick={() => confirmDelete(issue._id)}
                        className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete this issue?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Snackbar */}
      <AnimatePresence>
        {recentlyDeleted && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4"
          >
            <span>Issue deleted</span>
            <button
              onClick={handleUndo}
              className="bg-white text-purple-600 px-3 py-1 rounded-full font-medium hover:bg-purple-100"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
