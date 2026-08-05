import { useEffect, useState, useContext, useMemo } from "react";
import API from "../../api/api";
import AuthContext from "../../context/AuthContext";

function Admin() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterArchived, setFilterArchived] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [rRes, uRes] = await Promise.all([API.get('/admin/reports'), API.get('/admin/users')]);
      setReports(rRes.data.reports || []);
      setUsers(uRes.data.users || []);
    } catch (err) {
      console.error(err);
      alert('Admin data fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/reports/${id}/status`, { status });
      setReports((rs) => rs.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const deleteReport = async (id) => {
    if (!confirm('Delete this report?')) return;
    try {
      await API.delete(`/admin/reports/${id}`);
      // mark archived locally
      setReports((rs) => rs.map((r) => (r._id === id ? { ...r, archived: true } : r)));
    } catch (err) {
      console.error(err);
      alert('Failed to delete report');
    }
  };

  const restoreReport = async (id) => {
    try {
      await API.patch(`/admin/reports/${id}/restore`);
      setReports((rs) => rs.map((r) => (r._id === id ? { ...r, archived: false } : r)));
    } catch (err) {
      console.error(err);
      alert('Failed to restore report');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((us) => us.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterArchived === 'archived' && !r.archived) return false;
      if (filterArchived === 'active' && r.archived) return false;
      if (filterCategory && r.category !== filterCategory) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!r.title.toLowerCase().includes(s) && !r.description.toLowerCase().includes(s) && !(r.location?.address || '').toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [reports, filterCategory, filterStatus, search, filterArchived]);

  const exportCSV = () => {
    const rows = [
      ["id", "title", "category", "severity", "status", "reporter", "createdAt", "location", "likes"]
    ];
    filteredReports.forEach((r) => {
      rows.push([
        r._id,
        (r.title || "").replace(/\n/g, ' '),
        r.category || "",
        r.severity || "",
        r.status || "",
        r.reporter || "",
        r.createdAt || "",
        r.location?.address || "",
        (r.likes || []).length
      ]);
    });

    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civiq-reports-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (user?.role !== 'admin') return <div className="p-8">Access denied</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-blue-700">Admin Console</h2>
          <div className="flex items-center gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="p-2 border rounded-lg shadow-sm" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="p-2 border rounded-lg">
              <option value="">All categories</option>
              <option>Pothole</option>
              <option>Garbage</option>
              <option>Streetlight</option>
              <option>Drainage</option>
              <option>Water Leakage</option>
            </select>
            <select value={filterArchived} onChange={(e) => setFilterArchived(e.target.value)} className="p-2 border rounded-lg">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-lg">
              <option value="">All status</option>
              <option value="open">open</option>
              <option value="in-progress">in-progress</option>
              <option value="resolved">resolved</option>
              <option value="closed">closed</option>
            </select>
            <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">Export CSV</button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-3 text-lg">Reports ({filteredReports.length})</h3>
              <div className="space-y-3">
                {filteredReports.map((r) => (
                  <div key={r._id} className="p-3 border rounded-lg flex items-center justify-between hover:shadow transition">
                    <div className="max-w-xs">
                      <div className="font-medium text-blue-700 truncate">{r.title}</div>
                      <div className="text-xs text-gray-500 truncate">{r._id}</div>
                      <div className="text-xs text-gray-500">{r.location?.address || ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="p-1 border rounded">
                        <option value="open">open</option>
                        <option value="in-progress">in-progress</option>
                        <option value="resolved">resolved</option>
                        <option value="closed">closed</option>
                      </select>
                      {r.archived ? (
                        <button onClick={() => restoreReport(r._id)} className="px-3 py-1 bg-green-500 text-white rounded">Restore</button>
                      ) : (
                        <button onClick={() => deleteReport(r._id)} className="px-3 py-1 bg-red-500 text-white rounded">Archive</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-3 text-lg">Users ({users.length})</h3>
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u._id} className="p-3 border rounded-lg flex items-center justify-between hover:shadow transition">
                    <div>
                      <div className="font-medium">{u.fullName} <span className="text-xs text-gray-500">({u.email})</span></div>
                      <div className="text-xs text-gray-500">Role: {u.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteUser(u._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
