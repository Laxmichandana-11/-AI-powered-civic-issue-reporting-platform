import { useEffect, useState } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useUser } from "../context/UserContext"; 

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser(); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        const userId = user?._id || parsedUser?._id;

        if (!userId) {
         
          setLoading(false);
          toast.error("You must be logged in to view your reports.");
          return;
        }

        const res = await api.get(`/reports/my/${userId}`);
        setReports(res.data || []);
      } catch (err) {
        console.error("MyReports error:", err);
        toast.error(
          err.response?.data?.message || "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-700 font-medium mb-5"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      <h1 className="text-2xl font-bold text-purple-700 mb-2">
        My Reports
      </h1>
      <p className="text-gray-500 text-sm mb-4">
        Here you can see all the reports you have submitted in the community.
      </p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-sm">
          You haven&apos;t reported anyone yet.
        </p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl shadow border border-purple-100 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-purple-600" />
                  <span className="font-semibold text-purple-700 text-sm">
                    {r.reason}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-1">
                Reported User:{" "}
                <span className="font-semibold">
                  {r.reportedUser?.username || "Unknown user"}
                </span>
              </p>

              {r.details && (
                <p className="text-sm text-gray-600 mb-2">
                  {r.details}
                </p>
              )}

              {r.reportedUser && (
                <p className="text-xs text-gray-500">
                  Current Status:{" "}
                  {r.reportedUser.isBlocked ? "Blocked" : "Active"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
