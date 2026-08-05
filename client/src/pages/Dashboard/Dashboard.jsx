import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import AuthContext from "../../context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [sRes, rRes, mRes, aRes] = await Promise.all([
          API.get('/reports/stats/summary'),
          API.get('/reports/recent?limit=6'),
          API.get('/reports/me?limit=5'),
          API.get('/reports/activity?limit=6'),
        ]);
        setStats(sRes.data);
        setRecent(rRes.data.reports || []);
        setMyReports(mRes.data.reports || []);
        setActivity(aRes.data.activity || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categoryData = stats?.byCategory?.map((c) => c.count) || [];
  const categoryLabels = stats?.byCategory?.map((c) => c._id || 'Unspecified') || [];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Dashboard</h1>
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <div className="text-sm uppercase tracking-widest opacity-80">Welcome back, {user?.fullName || 'Citizen'}</div>
              <div className="text-3xl font-semibold">Your civic impact at a glance</div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-xs uppercase opacity-80">Total Reports</div>
                <div className="text-2xl font-semibold">{stats?.total ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-xs uppercase opacity-80">My Reports</div>
                <div className="text-2xl font-semibold">{myReports.length}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-xs uppercase opacity-80">Recent activity</div>
                <div className="text-2xl font-semibold">{recent.length}</div>
              </div>
            </div>
          </div>
        </div>

        {loading && <div>Loading...</div>}

        {!loading && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white rounded-xl shadow">
                <div className="text-sm text-gray-500">Total Reports</div>
                <div className="text-2xl font-semibold">{stats.total}</div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <div className="text-sm text-gray-500">By Status</div>
                <div className="mt-2 space-y-1">
                  {stats.byStatus.map((s) => (
                    <div key={s._id} className="flex items-center justify-between">
                      <div className="capitalize">{s._id || 'unspecified'}</div>
                      <div className="font-semibold">{s.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow flex flex-col items-center">
                <div className="w-40 h-40">
                  <Doughnut data={{ labels: categoryLabels, datasets: [{ data: categoryData, backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }] }} />
                </div>
                <div className="mt-3 text-sm text-gray-500">Reports by Category</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="p-6 bg-white rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-sky-500 text-white shadow-lg">
                    <div className="text-xs uppercase opacity-80">Severity Breakdown</div>
                    <div className="mt-4 w-full h-56">
                      <Doughnut data={{ labels: stats.bySeverity.map((s) => s._id || 'unknown'), datasets: [{ data: stats.bySeverity.map((s) => s.count), backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'] }] }} />
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase opacity-80">Quick Action</div>
                      <div className="mt-4 text-2xl font-semibold">File a new civic issue</div>
                    </div>
                    <Link to="/report-issue" className="mt-6 inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-3 text-blue-700 font-semibold shadow hover:bg-white">
                      Report Issue
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
            <div className="space-y-3">
              {recent.length > 0 ? recent.map((r) => (
                <div key={r._id} className="flex items-center gap-4">
                  <img src={r.imagePath || '/placeholder.png'} alt="thumb" className="w-20 h-14 object-cover rounded" />
                  <div>
                    <div className="font-medium text-blue-700">{r.title}</div>
                    <div className="text-xs text-gray-500">{r.location?.address || ''} • {new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">No recent reports yet.</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
              <div className="space-y-3">
                {activity.length > 0 ? activity.map((item, idx) => (
                  <div key={`${item.type}-${idx}`} className="border rounded-2xl p-4 bg-slate-50">
                    {item.type === 'report' ? (
                      <>
                        <div className="text-sm font-semibold text-blue-700">New report filed</div>
                        <div className="text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.category} • by {item.reporter}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-blue-700">New comment</div>
                        <div className="text-sm">{item.content}</div>
                        <div className="text-xs text-gray-500">on {item.reportTitle} • by {item.author}</div>
                      </>
                    )}
                    <div className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                )) : <p className="text-sm text-gray-500">No activity available yet.</p>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">My Recent Reports</h2>
              <div className="space-y-3">
                {myReports.length > 0 ? myReports.map((r) => (
                  <div key={r._id} className="border rounded-lg p-3">
                    <div className="font-medium text-blue-700">{r.title}</div>
                    <div className="text-xs text-gray-500">{r.status} • {r.category} • {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                )) : <p className="text-sm text-gray-500">You haven't filed any reports yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;