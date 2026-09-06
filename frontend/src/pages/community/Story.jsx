import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";


const API_ROOT =
  (import.meta.env.VITE_API_BASE &&
    import.meta.env.VITE_API_BASE.replace("/api", "")) ||
  "http://localhost:4000";

const resolveImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `${API_ROOT}${img}`;
  return `${API_ROOT}/${img}`;
};

export default function Story() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [issueSummary, setIssueSummary] = useState("");
  const [impact, setImpact] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await api.get("/stories");
        setStories(res.data || []);
      } catch (err) {
        toast.error("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      toast.error("You can upload up to 4 images");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !issueSummary.trim()) {
      toast.error("Please fill title and issue summary");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to share a story");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("issueSummary", issueSummary);
      formData.append("impact", impact);
      formData.append("location", location);

      images.forEach((file) => formData.append("images", file));

      const res = await api.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Story shared successfully!");
      if (res.data?.story) {
        setStories((prev) => [res.data.story, ...prev]);
      }

      setTitle("");
      setIssueSummary("");
      setImpact("");
      setLocation("");
      setImages([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create story");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-700 font-medium mb-4"
        >
          <ArrowLeft size={20} className="mr-1" /> Back
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-orange-700">✨ Impact Stories</h1>
          <p className="text-gray-600 mt-1">
            Share how your issue got resolved and inspire others in the community.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              className="w-full border border-orange-200 rounded-xl px-3 py-2"
              placeholder="e.g. Street lights finally fixed in my area"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Issue & how it was resolved *
            </label>
            <textarea
              className="w-full border border-orange-200 rounded-xl px-3 py-2 h-24 resize-none"
              placeholder="Describe your issue..."
              value={issueSummary}
              onChange={(e) => setIssueSummary(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Impact / Result (optional)
            </label>
            <textarea
              className="w-full border border-orange-200 rounded-xl px-3 py-2 h-20 resize-none"
              placeholder="How did this change help?"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location (optional)
            </label>
            <input
              type="text"
              className="w-full border border-orange-200 rounded-xl px-3 py-2"
              placeholder="Area / city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Photos (optional)
            </label>
            <label className="flex items-center justify-between border-2 border-dashed border-orange-200 rounded-xl px-3 py-3 cursor-pointer text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} />
                <span>Add up to 4 images</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {images.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60"
          >
            <Send size={18} />
            {submitting ? "Sharing..." : "Share Story"}
          </button>
        </form>

        {/* STORIES LIST */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-orange-800 mb-3">
            Community stories
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading stories...</p>
          ) : stories.length === 0 ? (
            <p className="text-gray-500">No stories yet.</p>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {story.user?.avatar && (
                      <img
                        src={resolveImageUrl(story.user.avatar)}
                        alt={story.user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {story.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(story.createdAt).toLocaleDateString()}
                        {story.location ? ` • ${story.location}` : ""}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-orange-800 mb-1">
                    {story.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-1">
                    {story.issueSummary}
                  </p>

                  {story.impact && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Impact: </span>
                      {story.impact}
                    </p>
                  )}

                  {story.images?.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {story.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={resolveImageUrl(img)}
                          alt="story"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
