import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import AuthContext from "../../context/AuthContext";

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reports/${id}`);
      setReport(res.data.report);
      setComments(res.data.comments || []);
      setLikesCount(res.data.report?.likes?.length || 0);
      setLikedByUser(!!res.data.report?.likes?.some((u) => String(u) === String(user?._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await API.post(`/reports/${id}/comments`, { content });
      setComments((c) => [res.data.comment, ...c]);
      setContent("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await API.post(`/reports/${id}/like`);
      setLikesCount(res.data.likes || 0);
      setLikedByUser((s) => !s);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await API.delete(`/reports/${id}/comments/${commentId}`);
      setComments((c) => c.filter((x) => x._id !== commentId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (!report) return <div className="p-8">Report not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {report.imagePath && <img src={report.imagePath} alt={report.title} className="w-full h-64 object-cover" />}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{report.title}</h2>
            <p className="text-gray-700 mb-4">{report.description}</p>
            <div className="text-sm text-gray-600">Category: {report.category} • Severity: {report.severity} • Status: {report.status}</div>
            <div className="mt-2 text-sm text-gray-500">Location: {report.location?.address || "N/A"}</div>
            <div className="mt-4 flex items-center gap-4">
              <button onClick={handleToggleLike} className={`px-3 py-1 rounded ${likedByUser ? 'bg-blue-600 text-white':'bg-gray-200'}`}>
                {likedByUser ? 'Unlike' : 'Like'} ({likesCount})
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Comments</h3>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-3 border rounded mb-2" rows={3} placeholder="Add a comment..." />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Post Comment</button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
            {comments.map((c) => (
              <div key={c._id} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{c.author?.fullName || c.author?.email}</div>
                  <div>
                    {(String(user?._id) === String(c.author?._id) || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(c._id)} className="text-red-500 text-sm">Delete</button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-700">{c.content}</div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
