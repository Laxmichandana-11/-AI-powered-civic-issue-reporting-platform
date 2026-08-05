import { useEffect, useState } from "react";
import API from "../../api/api";
import ReportCard from "../../components/Common/ReportCard";

function Feed() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReports = async (p = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/reports?page=${p}&limit=8`);
      setReports(res.data.reports || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Issue Feed</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => (
              <ReportCard key={r._id} report={r} />
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button disabled={page <= 1} onClick={() => fetchReports(page - 1)} className="px-3 py-2 bg-white rounded shadow">Prev</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => fetchReports(page + 1)} className="px-3 py-2 bg-white rounded shadow">Next</button>
        </div>
      </div>
    </div>
  );
}

export default Feed;
