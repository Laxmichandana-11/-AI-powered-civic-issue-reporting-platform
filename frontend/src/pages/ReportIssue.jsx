import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!location.trim()) return toast.error("Location is required");
    if (!category) return toast.error("Please select a category");
    return true;
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit an issue");
      navigate("/login");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("location", location);
    fd.append("category", category);
    if (imageFile) fd.append("image", imageFile);

    try {
      setLoading(true);
      setUploadProgress(0);

      await axios.post("http://localhost:4000/api/issues", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 2000);

      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 p-6 relative overflow-hidden">

      {/* Floating Glow Blobs */}
      <motion.div
        className="absolute top-10 left-10 w-44 h-44 bg-blue-300 rounded-full blur-3xl opacity-25"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-56 h-56 bg-sky-400 rounded-full blur-3xl opacity-25"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✅ Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 text-center border border-blue-200"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center mb-4"
              >
                <CheckCircle2 size={70} className="text-blue-600 drop-shadow-md" />
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-blue-700"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Issue Submitted Successfully!
              </motion.h3>
              <p className="text-gray-500 mt-1">Redirecting to home...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧾 Form Card */}
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100 p-8 sm:p-10 w-full max-w-2xl relative"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <ArrowLeft size={20} className="mr-1" /> Back
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center flex-1">
            Report an Issue
          </h2>
          <div className="w-10" />
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Describe the issue..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (area / city)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            >
              <option value="">Select category</option>
              <option>Road</option>
              <option>Garbage</option>
              <option>Water</option>
              <option>Electricity</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition">
              <UploadCloud size={18} />
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="h-20 w-20 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            )}
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              {loading ? `Uploading ${uploadProgress}%` : "Submit Issue"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                setLocation("");
                setCategory("");
                setImageFile(null);
                setPreview(null);
              }}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Reset
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

