import { useEffect, useState } from "react";
import API from "../../api/api";
import ReportCard from "../../components/Common/ReportCard";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        const res = await API.get("/reports/me?limit=50");
        setReports(res.data.reports || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
            <p className="text-sm text-slate-500">Review and manage the reports you have submitted.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading your reports...</p>
        ) : reports.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm text-slate-700">
            <p className="text-lg font-medium">No reports submitted yet.</p>
            <p className="mt-2 text-sm text-slate-500">Use the Report Issue page to submit your first civic issue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;
