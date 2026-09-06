import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaArrowLeft, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compare, setCompare] = useState(null);
  const [user, setUser] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    axios
      .get(`http://localhost:4000/api/compare/${id}`)
      .then((res) => setCompare(res.data))
      .catch((err) => console.error("❌ Fetch Compare Error:", err));
  }, [id]);

  const handleVote = async (categoryIndex, area) => {
    if (!user) {
      alert("Please login to vote!");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4000/api/compare/${id}/vote`,
        { categoryIndex, area },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompare(res.data);
    } catch (err) {
      console.error("❌ Vote Error:", err.message);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like!");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4000/api/compare/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompare(res.data);
    } catch (err) {
      console.error("❌ Like Error:", err.message);
    }
  };

  const deleteCompare = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:4000/api/compare/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setShowDeleteConfirm(false);
      setDeleteSuccess(true);

      setTimeout(() => {
        navigate("/compare");
      }, 700);
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err);
      alert("Delete failed. Make sure you are the owner.");
    }
  };

  if (!compare)
    return (
      <div className="text-center mt-20 text-green-700 font-semibold">
        Loading Comparison...
      </div>
    );

  const userId = user?._id;
  const liked = compare.likes?.includes(userId);
  const isOwner = compare.createdBy === userId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex flex-col items-center relative"
    >
      {/* Back */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center text-green-700 font-semibold mb-4 bg-white px-4 py-2 rounded-full shadow hover:shadow-md transition-all"
      >
        <FaArrowLeft className="mr-2" /> Back
      </motion.button>

      {/* Title */}
      <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
        {compare.area1} <span className="text-green-600">vs</span> {compare.area2}
      </h2>

      {/* Like */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLike}
        className="flex items-center gap-2 bg-white border border-green-300 px-5 py-2 rounded-full shadow-md text-green-700 font-semibold mb-6 hover:bg-green-100 transition-all"
      >
        {liked ? (
          <FaHeart className="text-green-600 text-xl" />
        ) : (
          <FaRegHeart className="text-green-600 text-xl" />
        )}
        {compare.likes?.length || 0} Likes
      </motion.button>

      {/* Delete Button */}
      {isOwner && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full shadow-lg mb-6 hover:bg-red-700 transition-all"
        >
          <FaTrash /> Delete Comparison
        </motion.button>
      )}

      {/* Categories */}
      <motion.div className="w-full max-w-2xl bg-white border border-green-200 rounded-2xl shadow-xl p-6">
        {compare.categories.map((cat, i) => {
          const userVote = cat.votes.find(
            (v) => v.user === userId || v.user?._id === userId
          );

          return (
            <div key={i} className="flex justify-between items-center border-b border-green-100 py-3">
              {/* Area 1 */}
              <button
                onClick={() => handleVote(i, "area1")}
                className="flex items-center gap-1 w-1/3 justify-center"
              >
                {userVote?.area === "area1" ? (
                  <FaHeart className="text-green-600 text-xl" />
                ) : (
                  <FaRegHeart className="text-green-600 text-xl" />
                )}
                <span className="text-green-700 font-medium">{cat.area1Votes}</span>
              </button>

              {/* Name */}
              <p className="font-semibold text-green-800 w-1/3 text-center text-lg">
                {cat.name}
              </p>

              {/* Area 2 */}
              <button
                onClick={() => handleVote(i, "area2")}
                className="flex items-center gap-1 w-1/3 justify-center"
              >
                {userVote?.area === "area2" ? (
                  <FaHeart className="text-green-600 text-xl" />
                ) : (
                  <FaRegHeart className="text-green-600 text-xl" />
                )}
                <span className="text-green-700 font-medium">{cat.area2Votes}</span>
              </button>
            </div>
          );
        })}
      </motion.div>

      {/* Delete Confirm Popup */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
              <h3 className="text-lg font-bold text-red-600 mb-3">Delete Comparison?</h3>
              <p className="text-gray-600 mb-4">This action cannot be undone.</p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteCompare}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Success */}
      <AnimatePresence>
        {deleteSuccess && (
          <motion.div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <FaTrash /> <span>Deleted Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
