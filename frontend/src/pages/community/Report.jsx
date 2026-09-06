import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { useUser } from "../../context/UserContext";

const DECOR_IMG = "/mnt/data/341c7633-5e7c-4903-99c1-ba486159357b.png";

const REASONS = [
  "Harassment",
  "Abusive Language",
  "Violent Content",
  "Threats",
  "Cyberbullying",
  "Fake News",
  "Nudity",
  "Spam",
  "Suicidal Things",
  "Other",
];

export default function Report() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [reportedUsername, setReportedUsername] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      toast.error("You must be logged in to submit a report.");
      return;
    }
    if (!reportedUsername.trim()) {
      toast.error("Please enter the username of the user you want to report.");
      return;
    }
    if (!selectedReason) {
      toast.error("Please select a reason for the report.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        reporterId: user._id,
        reportedUsername: reportedUsername.trim(),
        reason: selectedReason,
        details,
      };

      const res = await api.post("/reports", payload);
      toast.success(res.data?.message || "Report submitted successfully.");
      // reset form
      setReportedUsername("");
      setSelectedReason("");
      setDetails("");
      setSuccessOpen(true);
    } catch (error) {
      console.error("Report error:", error);
      const msg =
        error?.response?.data?.message ||
        "Something went wrong while submitting the report.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-orange-50 to-orange-100 flex flex-col items-center py-8 px-4">
      {/* Decorative floating background image (soft, blurred) */}
      <img
        src={DECOR_IMG}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-1/4 w-96 opacity-10 blur-2xl transform rotate-6"
      />

      {/* Glass header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/30
                     px-3 py-2 rounded-xl text-orange-700 hover:scale-105 transform transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-lg md:text-2xl font-semibold text-orange-700 text-center">
          Report a User
        </h1>

        <div className="w-12" />
      </div>

      {/* Main card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-3xl bg-white/70 backdrop-blur-lg border border-white/30
                   rounded-3xl p-6 md:p-10 shadow-xl relative z-10"
      >
        {/* subtle header within card */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Keep the community safe</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your report will help our moderation team review the content quickly.
            </p>
          </div>

          <div
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-50 to-white/60
                       px-3 py-2 rounded-lg border border-white/20"
          >
            <div className="w-3 h-3 rounded-full bg-orange-400 shadow-md" />
            <span className="text-sm text-gray-600">Confidential</span>
          </div>
        </div>

        {/* Reported username */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Reported User (username)</label>
          <input
            type="text"
            value={reportedUsername}
            onChange={(e) => setReportedUsername(e.target.value)}
            placeholder="e.g. cutie_pie"
            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60
                       focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            aria-label="Reported username"
          />
        </div>

        {/* Reason grid */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Reason for report</label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {REASONS.map((reason) => {
              const selected = selectedReason === reason;
              return (
                <motion.button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  whileTap={{ scale: 0.98 }}
                  layout
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-left
                              transition-all duration-200 shadow-sm
                              ${selected ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg" : "bg-white/70 text-gray-700 border border-white/30 hover:scale-[1.02]"}`}
                  aria-pressed={selected}
                >
                  <div
                    className={`flex-none w-9 h-9 rounded-lg grid place-items-center ${
                      selected ? "bg-white/20" : "bg-orange-50"
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 ${selected ? "text-white" : "text-orange-500"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="truncate">{reason}</div>
                    <div className={`text-xs mt-0.5 ${selected ? "text-orange-100" : "text-gray-400"}`}>
                      {selected ? "Selected" : "Tap to choose"}
                    </div>
                  </div>

                  {/* animated check */}
                  <motion.span
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: selected ? 1 : 0, x: selected ? 0 : 6 }}
                    transition={{ duration: 0.18 }}
                    className="flex-none"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional details (optional)</label>
          <textarea
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Any extra context: post link, time, screenshots..."
            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/60
                       focus:outline-none focus:ring-2 focus:ring-orange-300 transition resize-none"
            aria-label="Report details"
          />
        </div>

        {/* Submit row */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between">
          <div className="text-sm text-gray-500">
            <strong className="text-gray-700">Privacy:</strong> Reports are reviewed by our moderation team.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ml-auto inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-400
                       text-white font-semibold px-5 py-3 rounded-2xl shadow-lg hover:scale-[1.02] transform transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={loading}
            aria-label="Send report"
          >
            <motion.span
              initial={{ x: -6, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Send className="w-4 h-4" />
            </motion.span>

            <span>{loading ? "Sending..." : "Send Report"}</span>

            {loading && (
              <svg
                className="w-4 h-4 animate-spin ml-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"></circle>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
              </svg>
            )}
          </button>
        </div>
      </motion.form>

      {/* Success Modal */}
      {successOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.9, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-md w-full bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-orange-400 to-orange-500 grid place-items-center text-white shadow">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Report Submitted</h3>
                <p className="text-sm text-gray-500 mt-1">Thanks — our moderation team will review this shortly.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSuccessOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-white border border-white/40 text-sm font-medium hover:shadow"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSuccessOpen(false);
                  navigate("/help");
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold hover:scale-[1.02] transition"
              >
                Get Help
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
