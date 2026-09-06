import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  ClipboardList,
  LogOut,
  RefreshCcw,
  Search,
  Activity,
  UserCog,
  UserX,
  ChartColumn,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [summary, setSummary] = useState({
    summary: { totalUsers: 0, totalIssues: 0, pendingIssues: 0, totalReports: 0 },
    issueStatusBreakdown: [],
    reportStatusBreakdown: [],
    recentIssues: [],
    recentReports: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [issueSearch, setIssueSearch] = useState("");
  const [reportSearch, setReportSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [issueFilter, setIssueFilter] = useState("all");
  const [reportFilter, setReportFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [issuePage, setIssuePage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const PAGE_SIZE = 4;

  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        setUser(storedUser);
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate, setUser]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to load admin dashboard");
      if (err.response?.status === 403) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchSummary();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const updateIssueStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/issues/${id}/status`, { status });
      toast.success("Issue status updated");
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const updateReportStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/reports/${id}/status`, { status });
      toast.success("Report status updated");
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || "Report update failed");
    }
  };

  const toggleUserBlock = async (id, currentBlocked) => {
    try {
      await api.patch(`/api/admin/users/${id}/block`, {
        isBlocked: !currentBlocked,
        blockedReason: !currentBlocked ? "Blocked by admin" : "",
        blockedUntil: null,
      });
      toast.success(currentBlocked ? "User unblocked" : "User blocked");
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || "User update failed");
    }
  };

  const filteredIssues = useMemo(() => {
    return summary.recentIssues.filter((issue) => {
      const matchesText =
        !issueSearch ||
        issue.title?.toLowerCase().includes(issueSearch.toLowerCase()) ||
        issue.description?.toLowerCase().includes(issueSearch.toLowerCase()) ||
        issue.user?.name?.toLowerCase().includes(issueSearch.toLowerCase());
      const matchesStatus = issueFilter === "all" || issue.status === issueFilter;
      return matchesText && matchesStatus;
    });
  }, [summary.recentIssues, issueSearch, issueFilter]);

  const filteredReports = useMemo(() => {
    return summary.recentReports.filter((report) => {
      const matchesText =
        !reportSearch ||
        report.reason?.toLowerCase().includes(reportSearch.toLowerCase()) ||
        report.reporter?.name?.toLowerCase().includes(reportSearch.toLowerCase()) ||
        report.reportedUser?.name?.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesStatus = reportFilter === "all" || report.status === reportFilter;
      return matchesText && matchesStatus;
    });
  }, [summary.recentReports, reportSearch, reportFilter]);

  const filteredUsers = useMemo(() => {
    return summary.users.filter((person) => {
      const matchesText =
        !userSearch ||
        person.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        person.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        person.username?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesStatus = userFilter === "all" || (userFilter === "blocked" ? person.isBlocked : !person.isBlocked);
      return matchesText && matchesStatus;
    });
  }, [summary.users, userSearch, userFilter]);

  const paginatedIssues = useMemo(() => {
    const start = (issuePage - 1) * PAGE_SIZE;
    return filteredIssues.slice(start, start + PAGE_SIZE);
  }, [filteredIssues, issuePage]);

  const paginatedReports = useMemo(() => {
    const start = (reportPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, reportPage]);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, userPage]);

  const totalIssuePages = Math.max(1, Math.ceil(filteredIssues.length / PAGE_SIZE));
  const totalReportPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  useEffect(() => setIssuePage(1), [issueSearch, issueFilter]);
  useEffect(() => setReportPage(1), [reportSearch, reportFilter]);
  useEffect(() => setUserPage(1), [userSearch, userFilter]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <ShieldCheck className="mx-auto text-emerald-600 mb-4" size={42} />
          <h2 className="text-2xl font-bold text-slate-800">Admin access required</h2>
          <p className="text-slate-500 mt-2">Please log in with an admin account to continue.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const metricMax = Math.max(
    summary.summary.totalUsers,
    summary.summary.totalIssues,
    summary.summary.pendingIssues,
    summary.summary.totalReports,
    1
  );

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold">Admin Panel</p>
            <h1 className="text-3xl font-bold text-slate-800">Civix Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSummary}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-600">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6 mb-10">
              <MetricChart icon={<Users />} label="Users" value={summary.summary.totalUsers} progress={(summary.summary.totalUsers / metricMax) * 100} color="emerald" />
              <MetricChart icon={<ClipboardList />} label="Issues" value={summary.summary.totalIssues} progress={(summary.summary.totalIssues / metricMax) * 100} color="blue" />
              <MetricChart icon={<AlertTriangle />} label="Pending" value={summary.summary.pendingIssues} progress={(summary.summary.pendingIssues / metricMax) * 100} color="amber" />
              <MetricChart icon={<ShieldCheck />} label="Reports" value={summary.summary.totalReports} progress={(summary.summary.totalReports / metricMax) * 100} color="rose" />
            </div>

            <div className="grid xl:grid-cols-2 gap-6 mb-8">
              <Panel title="Issue Status Overview" icon={<Activity />}>
                <StatusDonutChart data={summary.issueStatusBreakdown} palette="emerald" />
              </Panel>

              <Panel title="Reported Issues Overview" icon={<ChartColumn />}>
                <StatusBarChart data={summary.reportStatusBreakdown} palette="rose" />
              </Panel>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <Panel title="Issues" icon={<ClipboardList />}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        value={issueSearch}
                        onChange={(e) => setIssueSearch(e.target.value)}
                        placeholder="Search issues or users"
                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                    <select
                      value={issueFilter}
                      onChange={(e) => setIssueFilter(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="all">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="action_taken">Action taken</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {paginatedIssues.length === 0 ? (
                      <p className="text-slate-500 text-sm">No matching issues found.</p>
                    ) : (
                      paginatedIssues.map((issue) => (
                        <div key={issue._id} className="py-4 first:pt-0 last:pb-0 border-b last:border-b-0 border-slate-200">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-slate-800">{issue.title}</h3>
                              <p className="text-xs text-slate-500">By {issue.user?.name || "Unknown user"}</p>
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">{issue.status}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{issue.description}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setSelectedItem({ type: "Issue", item: issue })}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              <Eye size={13} /> View details
                            </button>
                            {['pending', 'reviewed', 'action_taken', 'dismissed'].map((status) => (
                              <button
                                key={status}
                                onClick={() => updateIssueStatus(issue._id, status)}
                                className={`px-2 py-1 rounded text-xs capitalize ${issue.status === status ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <PaginationControls
                    currentPage={issuePage}
                    totalPages={totalIssuePages}
                    onPrev={() => setIssuePage((p) => Math.max(1, p - 1))}
                    onNext={() => setIssuePage((p) => Math.min(totalIssuePages, p + 1))}
                  />
                </Panel>

                <Panel title="Reports" icon={<ShieldCheck />}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        value={reportSearch}
                        onChange={(e) => setReportSearch(e.target.value)}
                        placeholder="Search reports"
                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="all">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="dismissed">Dismissed</option>
                      <option value="action_taken">Action taken</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {paginatedReports.length === 0 ? (
                      <p className="text-slate-500 text-sm">No matching reports found.</p>
                    ) : (
                      paginatedReports.map((report) => (
                        <div key={report._id} className="py-4 first:pt-0 last:pb-0 border-b last:border-b-0 border-slate-200">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-slate-800">{report.reason}</h3>
                              <p className="text-xs text-slate-500">Reported by {report.reporter?.name || "Unknown"}</p>
                            </div>
                            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full capitalize">{report.status}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{report.details || "No details provided."}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setSelectedItem({ type: "Report", item: report })}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-rose-600 text-white hover:bg-rose-700"
                            >
                              <Eye size={13} /> View details
                            </button>
                            {['pending', 'reviewed', 'dismissed', 'action_taken'].map((status) => (
                              <button
                                key={status}
                                onClick={() => updateReportStatus(report._id, status)}
                                className={`px-2 py-1 rounded text-xs capitalize ${report.status === status ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <PaginationControls
                    currentPage={reportPage}
                    totalPages={totalReportPages}
                    onPrev={() => setReportPage((p) => Math.max(1, p - 1))}
                    onNext={() => setReportPage((p) => Math.min(totalReportPages, p + 1))}
                  />
                </Panel>
              </div>

              <div className="space-y-6">
                <Panel title="User Management" icon={<UserCog />}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search users"
                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="all">All users</option>
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {paginatedUsers.length === 0 ? (
                      <p className="text-slate-500 text-sm">No matching users found.</p>
                    ) : (
                      paginatedUsers.map((person) => (
                        <div key={person._id} className="py-4 first:pt-0 last:pb-0 border-b last:border-b-0 border-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-800">{person.name || person.username}</p>
                              <p className="text-xs text-slate-500">{person.email}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full ${person.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {person.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => toggleUserBlock(person._id, person.isBlocked)}
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${person.isBlocked ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                            >
                              {person.isBlocked ? <UserCog size={14} /> : <UserX size={14} />}
                              {person.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <PaginationControls
                    currentPage={userPage}
                    totalPages={totalUserPages}
                    onPrev={() => setUserPage((p) => Math.max(1, p - 1))}
                    onNext={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                  />
                </Panel>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedItem && (
        <ModerationModal
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onIssueStatus={updateIssueStatus}
          onReportStatus={updateReportStatus}
        />
      )}
    </div>
  );
}

function MetricChart({ icon, label, value, progress, color }) {
  const colorMap = {
    emerald: { text: "text-emerald-700", fill: "bg-emerald-500", track: "bg-emerald-100" },
    blue: { text: "text-blue-700", fill: "bg-blue-500", track: "bg-blue-100" },
    amber: { text: "text-amber-700", fill: "bg-amber-500", track: "bg-amber-100" },
    rose: { text: "text-rose-700", fill: "bg-rose-500", track: "bg-rose-100" },
  };
  const colors = colorMap[color];

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <span className={colors.text}>{icon}</span>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <div className={`mt-3 h-2 ${colors.track} rounded-full overflow-hidden`}>
        <div className={`h-full ${colors.fill} rounded-full`} style={{ width: `${value ? Math.max(10, progress) : 0}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <section className="border-b border-slate-200 pb-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-emerald-600">{icon}</span>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatusDonutChart({ data = [], palette }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = palette === "rose"
    ? ["#e11d48", "#f97316", "#f59e0b", "#64748b"]
    : ["#059669", "#0d9488", "#0284c7", "#64748b"];
  let offset = 0;
  const segments = data.map((item, index) => {
    const percentage = total ? (item.count / total) * 100 : 0;
    const segment = `${colors[index % colors.length]} ${offset}% ${offset + percentage}%`;
    offset += percentage;
    return segment;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div
        className="relative w-40 h-40 rounded-full shrink-0"
        style={{ background: segments.length ? `conic-gradient(${segments.join(", ")})` : "#e2e8f0" }}
      >
        <div className="absolute inset-5 rounded-full bg-white flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{total}</span>
          <span className="text-xs text-slate-500">total</span>
        </div>
      </div>
      <div className="w-full space-y-3">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-600 capitalize">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              {item.status.replace("_", " ")}
            </span>
            <span className="font-semibold text-slate-800">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBarChart({ data = [], palette }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  const color = palette === "rose" ? "bg-rose-500" : "bg-emerald-500";

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.status}>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="capitalize text-slate-600">{item.status.replace("_", " ")}</span>
            <span className="font-semibold text-slate-800">{item.count}</span>
          </div>
          <div className="h-8 rounded-lg bg-slate-100 overflow-hidden">
            <div
              className={`h-full ${color} rounded-lg transition-all duration-500`}
              style={{ width: `${(item.count / max) * 100}%`, minWidth: item.count ? "10px" : "0" }}
            />
          </div>
        </div>
      ))}
      {!data.length && <p className="text-sm text-slate-500">No reported issue data available.</p>}
    </div>
  );
}

function ModerationModal({ selectedItem, onClose, onIssueStatus, onReportStatus }) {
  const { type, item } = selectedItem;
  const isIssue = type === "Issue";
  const statuses = isIssue
    ? ["pending", "reviewed", "action_taken", "dismissed"]
    : ["pending", "reviewed", "dismissed", "action_taken"];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 p-4 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-5 sm:p-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">{type} details</p>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">{isIssue ? item.title : item.reason}</h2>
          </div>
          <button onClick={onClose} aria-label="Close details" className="p-2 text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-slate-500">Description</p>
            <p className="text-slate-700 mt-1 whitespace-pre-wrap">{isIssue ? item.description : item.details || "No details provided."}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-slate-500">{isIssue ? "Submitted by" : "Reported by"}</p>
              <p className="font-medium text-slate-800">{isIssue ? item.user?.name : item.reporter?.name || "Unknown user"}</p>
            </div>
            {!isIssue && (
              <div>
                <p className="text-slate-500">Reported user</p>
                <p className="font-medium text-slate-800">{item.reportedUser?.name || "Unknown user"}</p>
              </div>
            )}
            <div>
              <p className="text-slate-500">Current status</p>
              <p className="font-medium text-slate-800 capitalize">{item.status.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">Modify status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  if (isIssue) onIssueStatus(item._id, status);
                  else onReportStatus(item._id, status);
                  onClose();
                }}
                className={`px-3 py-2 rounded-xl text-sm capitalize ${item.status === status ? "bg-slate-800 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <span className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 disabled:opacity-40"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
