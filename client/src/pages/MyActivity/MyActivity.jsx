import { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";

function MyActivity() {
  const [reports, setReports] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await API.get("/reports/my-activity?limit=20");
        setReports(res.data.reports || []);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Activity</h1>
            <p className="text-sm text-slate-500">Track the reports you filed and comments you posted.</p>
          </div>
          <Link to="/report-issue" className="rounded-full bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700 transition">
            File another issue
          </Link>
        </div>

        {loading ? (
          <p>Loading activity...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Reports I Filed</h2>
              {reports.length === 0 ? (
                <p className="text-sm text-slate-500">You haven't filed any reports yet.</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report._id} className="border rounded-3xl p-4">
                      <h3 className="font-semibold text-slate-800">{report.title}</h3>
                      <div className="text-sm text-slate-500">{report.category} • {report.status} • {new Date(report.createdAt).toLocaleDateString()}</div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1">Likes: {report.likes?.length || 0}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Comments: {report.commentCount ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Comments I Posted</h2>
              {comments.length === 0 ? (
                <p className="text-sm text-slate-500">You haven't commented yet.</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="border rounded-3xl p-4">
                      <p className="text-slate-800">{comment.content}</p>
                      <div className="mt-3 text-sm text-slate-500">On <strong>{comment.report?.title || 'Unknown report'}</strong></div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{comment.report?.status || 'Unknown status'}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyActivity;
