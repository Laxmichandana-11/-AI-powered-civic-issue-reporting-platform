import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function Discussion() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null); // for comments modal
  const [commentText, setCommentText] = useState("");

  const [deletePost, setDeletePost] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const res = await axios.get("/discussions");
        const uid = user?._id ? user._id.toString() : null;

        const withLikedFlag = res.data.map((p) => ({
          ...p,
          liked:
            uid && p.likedBy
              ? p.likedBy.some((id) => id.toString() === uid)
              : false,
        }));

        setPosts(withLikedFlag);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      }
    };

    fetchDiscussions();
  }, [user?._id]);


  const handleCreate = async () => {
    if (!newPost.trim()) return;

    try {
      const res = await axios.post("/discussions", {
        content: newPost,
      });

      setPosts((prev) => [
        {
          ...res.data,
          likes: 0,
          likedBy: [],
          liked: false,
          comments: [],
        },
        ...prev,
      ]);
      setNewPost("");
      setShowNewPostModal(false);
    } catch (err) {
      console.error("Error creating discussion:", err);
      alert("Login required or token expired.");
      navigate("/login");
    }
  };

 
  const handleLike = async (id) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`/discussions/${id}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, likes: res.data.likes, liked: res.data.liked }
            : p
        )
      );

      if (selectedPost && selectedPost._id === id) {
        setSelectedPost((prev) =>
          prev
            ? { ...prev, likes: res.data.likes, liked: res.data.liked }
            : prev
        );
      }
    } catch (err) {
      console.error("Error liking discussion:", err);
    }
  };

 
  const askDeletePost = (post) => {
    setDeletePost(post);
  };

  const cancelDelete = () => {
    setDeletePost(null);
  };

 
  const confirmDeletePost = async () => {
    if (!user || !deletePost) return;

    try {
      await axios.delete(`/discussions/${deletePost._id}`);

      setPosts((prev) => prev.filter((p) => p._id !== deletePost._id));
      if (selectedPost && selectedPost._id === deletePost._id) {
        setSelectedPost(null);
        setCommentText("");
      }
      setDeletePost(null);
    } catch (err) {
      console.error("Error deleting discussion:", err);
      setDeletePost(null);
    }
  };

  
  const openCommentsModal = (post) => {
    setSelectedPost(post);
    setCommentText("");
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
    setCommentText("");
  };

 
  const handleAddComment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!commentText.trim() || !selectedPost) return;

    try {
      const res = await axios.post(
        `/discussions/${selectedPost._id}/comments`,
        {
          content: commentText,
        }
      );

      const updated = res.data;
      const uid = user?._id ? user._id.toString() : null;
      const liked =
        uid && updated.likedBy
          ? updated.likedBy.some((id) => id.toString() === uid)
          : false;

      const updatedWithLiked = { ...updated, liked };

      setPosts((prev) =>
        prev.map((p) => (p._id === updatedWithLiked._id ? updatedWithLiked : p))
      );
      setSelectedPost(updatedWithLiked);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

 
  const handleDeleteComment = async (postId, commentId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.delete(
        `/discussions/${postId}/comments/${commentId}`
      );

      const updated = res.data;
      const uid = user?._id ? user._id.toString() : null;
      const liked =
        uid && updated.likedBy
          ? updated.likedBy.some((id) => id.toString() === uid)
          : false;

      const updatedWithLiked = { ...updated, liked };

      setPosts((prev) =>
        prev.map((p) => (p._id === updatedWithLiked._id ? updatedWithLiked : p))
      );
      if (selectedPost && selectedPost._id === updatedWithLiked._id) {
        setSelectedPost(updatedWithLiked);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  
  const dailyQuestions = [
    "Start a conversation… What change do you want to see?",
    "Raise your voice. What’s happening around you?",
    "Let’s talk about something that matters.",
  ];
  const [question, setQuestion] = useState("");
  useEffect(() => {
    const i = new Date().getDate() % dailyQuestions.length;
    setQuestion(dailyQuestions[i]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 px-5 py-10 relative">
      {/* Back button under header / inside page */}
      <div className="max-w-5xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-orange-700 text-center mb-5">
        Discussion Starter 💬
      </h1>

      {/* Today's Question */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-5 max-w-3xl mx-auto mb-8">
        <h2 className="font-semibold text-lg">Today’s Question</h2>
        <p className="italic">{question}</p>
        <div className="flex gap-2 mt-2 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            #Environment
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            #CommunityVoice
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            #YouthAction
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-3xl mx-auto space-y-5">
        {posts.map((p) => {
          const isOwner =
            user && (p.user?._id === user._id || p.user === user._id);

          return (
            <div
              key={p._id}
              className="bg-white/80 border border-orange-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start text-sm text-gray-500 mb-1">
                <div>
                  <span className="font-medium text-orange-700">
                    {p.user?.name || "Anonymous"}
                  </span>
                  <span className="ml-2">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>

                {isOwner && (
                  <button
                    onClick={() => askDeletePost(p)}
                    className="ml-3 rounded-full bg-red-50 p-1 hover:bg-red-100 text-red-500"
                    title="Delete discussion"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <p className="text-gray-700 mb-3">{p.content}</p>

              <div className="flex gap-6 text-sm">
                <button
                  onClick={() => handleLike(p._id)}
                  className={`flex items-center gap-1 transition ${
                    p.liked
                      ? "text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart
                    size={16}
                    className={p.liked ? "fill-red-500 text-red-500" : ""}
                  />
                  {p.likes || 0}
                </button>

                <button
                  onClick={() => openCommentsModal(p)}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
                >
                  <MessageSquare size={16} />
                  Comment
                  {p.comments?.length ? ` (${p.comments.length})` : ""}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Button - New Discussion */}
      <motion.button
        onClick={() => (user ? setShowNewPostModal(true) : navigate("/login"))}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition"
      >
        <Plus size={20} /> Start Discussion
      </motion.button>

      {/* Modal: New Discussion */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-orange-700 mb-3">
                Start a new Discussion
              </h3>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none mb-3"
                placeholder="What do you want to talk about?"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full font-medium hover:scale-105 transition"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Comments */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-11/12 max-w-xl shadow-xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-red-600">
                  Comments on {selectedPost.content?.slice(0, 25) || "post"}
                </h3>
                <button
                  onClick={closeCommentsModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Comments list */}
              <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
                {selectedPost.comments?.length ? (
                  selectedPost.comments.map((c) => {
                    const isOwner =
                      user &&
                      (c.user?._id === user._id ||
                        c.user === user._id ||
                        selectedPost.user?._id === user._id ||
                        selectedPost.user === user._id);

                    return (
                      <div
                        key={c._id}
                        className="bg-purple-50 rounded-2xl px-4 py-3 flex justify-between items-start"
                      >
                        <div>
                          <p className="font-semibold text-red-700 text-sm">
                            {c.user?.name || "Anonymous"}
                          </p>
                          <p className="text-gray-700 text-sm">
                            {c.content}
                          </p>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() =>
                              handleDeleteComment(selectedPost._id, c._id)
                            }
                            className="ml-3 rounded-full bg-red-100 p-1 hover:bg-red-200"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    No comments yet. Be the first one!
                  </p>
                )}
              </div>

              {/* Add comment input */}
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border border-red-200 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-red-600 text-white px-5 py-2 rounded-2xl font-semibold hover:bg-red-700 transition"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Delete confirmation */}
      <AnimatePresence>
        {deletePost && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-11/12 max-w-sm shadow-xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-red-600 mb-3">
                Delete discussion?
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to delete this discussion?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePost}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
