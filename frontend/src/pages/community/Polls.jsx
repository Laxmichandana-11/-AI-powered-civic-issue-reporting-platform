import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Poll() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: "", options: ["", ""] });
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchPolls = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/polls");
      setPolls(res.data);
    } catch (err) {
      toast.error("Failed to load polls");
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, index) => {
    try {
      if (!token) return toast.error("Login required");
      await axios.post(
        `http://localhost:4000/api/polls/${pollId}/vote`,
        { optionIndex: index },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPolls();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to vote");
    }
  };

  const handleClearVote = async (pollId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/polls/${pollId}/vote`,
        { clear: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Vote cleared");
      fetchPolls();
    } catch (err) {
      toast.error("Failed to clear vote");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 px-5 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-orange-600 font-medium mb-4"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-orange-700 mb-6">
        Community Polls 📊
      </h2>

      <div className="space-y-6 max-w-3xl mx-auto pb-20">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((a, b) => a + b.votes, 0);

          const myVote = poll.voters.find(
            (v) => v.user === userId || v.user?._id === userId
          );

          return (
            <div
              key={poll._id}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-orange-100"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-orange-800 mb-3">
                {poll.question}
              </h3>

              <div className="space-y-3">
                {poll.options.map((opt, i) => {
                  const percent =
                    totalVotes === 0
                      ? 0
                      : ((opt.votes / totalVotes) * 100).toFixed(1);

                  const voted = myVote?.optionIndex === i;

                  return (
                    <div key={i} className="relative">
                      <button
                        onClick={() => handleVote(poll._id, i)}
                        className={`relative w-full text-left border rounded-xl px-3 py-2 sm:py-3 overflow-hidden transition-all ${
                          voted
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600 text-white shadow-md"
                            : "bg-orange-50 hover:bg-orange-100 border-orange-200 text-gray-800"
                        }`}
                      >
                        {/* progress bar */}
                        <div
                          className={`absolute left-0 top-0 h-full rounded-xl ${
                            voted ? "bg-white/20" : "bg-orange-200/40"
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>

                        <div className="relative">
                          <div className="font-medium">{opt.text}</div>
                          <div className="text-xs sm:text-sm mt-1 opacity-80">
                            {opt.votes} votes ({percent}%)
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Total votes: {totalVotes}
              </p>

              {myVote && (
                <button
                  onClick={() => handleClearVote(poll._id)}
                  className="text-orange-600 text-sm mt-2 underline"
                >
                  Clear my vote
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
      >
        <Plus size={22} />
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-orange-700 mb-4">
              Create a Poll
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const validOptions = form.options.filter(
                  (o) => o.trim() !== ""
                );
                await axios.post(
                  "http://localhost:4000/api/polls",
                  { question: form.question, options: validOptions },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Poll created");
                setShowForm(false);
                setForm({ question: "", options: ["", ""] });
                fetchPolls();
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={form.question}
                onChange={(e) =>
                  setForm({ ...form, question: e.target.value })
                }
                placeholder="Enter question"
                className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />

              {form.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...form.options];
                    updated[index] = e.target.value;
                    setForm({ ...form, options: updated });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              ))}

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, options: [...form.options, ""] })
                }
                className="text-orange-600 text-sm"
              >
                + Add another option
              </button>

              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-semibold mt-1">
                Create Poll
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

