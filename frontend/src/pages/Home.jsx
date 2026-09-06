import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { Heart, MessageCircle, Trash2, MapPin, Send, X, MoreHorizontal } from "lucide-react";

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [userLikes, setUserLikes] = useState({});
  const [userDislikes, setUserDislikes] = useState({});
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [deleteIssueId, setDeleteIssueId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const BACKEND_URL = "https://myonemile.onrender.com";

  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ["websocket"] });
    socket.on("issueUpdated", (updatedIssue) => {
      setIssues((prev) =>
        prev.map((i) => (i._id === updatedIssue._id ? updatedIssue : i))
      );
    });
    return () => socket.disconnect();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/issues`);
      const all = res.data || [];
      setIssues(all);

      const likesMap = {};
      const dislikesMap = {};

      all.forEach((issue) => {
        if (issue.likes?.includes(user?._id)) likesMap[issue._id] = true;
        if (issue.dislikes?.includes(user?._id)) dislikesMap[issue._id] = true;
      });

      setUserLikes(likesMap);
      setUserDislikes(dislikesMap);
    } catch (err) {
      console.error("Fetch issues error:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [user?._id]);

  const handleLike = async (id) => {
    if (!token) return;
    try {
      setIssues((prev) =>
        prev.map((i) =>
          i._id === id
            ? {
                ...i,
                likes: userLikes[id]
                  ? i.likes.filter((uid) => uid !== user._id)
                  : [...i.likes, user._id],
                dislikes: i.dislikes.filter((uid) => uid !== user._id),
              }
            : i
        )
      );

      setUserLikes((prev) => ({ ...prev, [id]: !prev[id] }));
      setUserDislikes((prev) => ({ ...prev, [id]: false }));

      await axios.put(
        `${BACKEND_URL}/api/issues/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDislike = async (id) => {
    if (!token) return;
    try {
      setIssues((prev) =>
        prev.map((i) =>
          i._id === id
            ? {
                ...i,
                dislikes: userDislikes[id]
                  ? i.dislikes.filter((uid) => uid !== user._id)
                  : [...i.dislikes, user._id],
                likes: i.likes.filter((uid) => uid !== user._id),
              }
            : i
        )
      );

      setUserDislikes((prev) => ({ ...prev, [id]: !prev[id] }));
      setUserLikes((prev) => ({ ...prev, [id]: false }));

      await axios.put(
        `${BACKEND_URL}/api/issues/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Dislike error:", err);
    }
  };

  const confirmDelete = (id) => setDeleteIssueId(id);

  const handleDelete = async () => {
    if (!deleteIssueId || !token) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/issues/${deleteIssueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssues((prev) => prev.filter((i) => i._id !== deleteIssueId));
      setDeleteIssueId(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openComments = async (issue) => {
    try {
      setSelectedIssue(issue);
      const res = await axios.get(
        `${BACKEND_URL}/api/issues/${issue._id}/comments`
      );
      setComments(res.data || []);
    } catch (err) {
      console.error("Comment fetch error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!token || !newComment.trim()) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/issues/${selectedIssue._id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If API returns the created comment
      const created = res.data;

      if (Array.isArray(created)) {
        setComments(created);
      } else {
        setComments((prev) => [...prev, created]);
      }

      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  const handleDeleteCommentDirect = async (commentId) => {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/issues/${selectedIssue._id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 font-bold">Civix community</p>
            <h1 className="text-2xl font-bold text-slate-900">Recent posts</h1>
          </div>
          <a href="/report" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <Send size={15} /> Share issue
          </a>
        </div>

        {issues.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-slate-700">No posts yet</p>
            <p className="mt-1 text-sm text-slate-500">Be the first person to share a local issue.</p>
          </div>
        )}

        <div className="space-y-6">
          {issues.map((issue) => (
            <motion.article
              key={issue._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    {getInitials(issue.user?.name || "Anonymous")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{issue.user?.name || "Anonymous"}</p>
                    <p className="text-xs text-slate-500">{formatPostDate(issue.createdAt)}</p>
                  </div>
                </div>
                <button aria-label="Post options" className="p-2 text-slate-400 hover:text-slate-700">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {issue.image ? (
                <img src={issue.image} alt={issue.title} className="aspect-[4/3] w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 text-emerald-700">
                  <MapPin size={56} strokeWidth={1.3} />
                </div>
              )}

              <div className="px-4 pb-4 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button whileTap={{ scale: 1.18 }} onClick={() => handleLike(issue._id)} aria-label="Like post" className={userLikes[issue._id] ? "text-rose-500" : "text-slate-700 hover:text-rose-500"}>
                      <Heart size={24} fill={userLikes[issue._id] ? "currentColor" : "none"} />
                    </motion.button>
                    <button onClick={() => openComments(issue)} aria-label="View comments" className="text-slate-700 hover:text-emerald-600">
                      <MessageCircle size={24} />
                    </button>
                    {issue.user?._id === user?._id && (
                      <button onClick={() => confirmDelete(issue._id)} aria-label="Delete post" className="text-slate-400 hover:text-red-500">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{issue.category || "Other"}</span>
                    <span className="text-xs font-medium capitalize text-slate-400">{issue.status?.replace("_", " ")}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-800">{issue.likes?.length || 0} likes</p>
                <h2 className="mt-2 text-base font-bold text-slate-900">{issue.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{issue.description}</p>
                {issue.location && <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} /> {issue.location}</p>}
                <button onClick={() => openComments(issue)} className="mt-3 text-sm text-slate-400 hover:text-emerald-600">
                  View comments
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* DELETE ISSUE MODAL */}
      <AnimatePresence>
        {deleteIssueId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center"
            >
              <h3 className="text-xl text-red-600 font-semibold">
                Delete Issue?
              </h3>
              <p className="text-gray-600 mt-2 mb-5">
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteIssueId(null)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMMENTS MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-slate-950/45 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-xl">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedIssue(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h3 className="font-semibold text-purple-700 mb-3 text-lg">
              Comments on {selectedIssue.title}
            </h3>

            {/* COMMENT LIST */}
            <div className="max-h-64 overflow-y-auto space-y-3 mb-3">
              {comments.length ? (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-start"
                  >
                    <div className="pr-3">
                      <p className="font-semibold text-gray-800 text-sm">
                        {c.user?.name || "User"}
                      </p>
                      <p className="text-gray-700 text-sm">{c.text}</p>
                    </div>

                    {/* DELETE COMMENT BUTTON WITH DUSTBIN */}
                    {(c.user?._id === user?._id ||
                      selectedIssue.user?._id === user?._id) && (
                      <button
                        onClick={() => handleDeleteCommentDirect(c._id)}
                        className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs hover:bg-red-200 transition"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  No comments yet
                </p>
              )}
            </div>

            {/* ADD COMMENT */}
            <div className="flex gap-2 mt-3">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />

              <button
                onClick={handleAddComment}
                className="bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatPostDate(date) {
  if (!date) return "Recently";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(value);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
