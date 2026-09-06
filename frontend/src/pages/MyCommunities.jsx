import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Users, LogOut, Plus } from "lucide-react";

export default function MyCommunities() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const BACKEND_URL = "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/community/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCommunities(res.data))
      .catch(() => toast.error("Failed to load your communities"))
      .finally(() => setLoading(false));
  }, []);

  const handleLeave = async (id) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/community/${id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommunities((prev) => prev.filter((c) => c._id !== id));
      toast.success("You left the community");
    } catch {
      toast.error("Failed to leave community");
    }
  };

  const handleRejoin = async (id) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/community/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rejoined successfully!");
    } catch {
      toast.error("Failed to rejoin");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 px-4 pt-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={20} className="mr-1" /> Back
        </button>

        <h2 className="text-2xl font-bold text-blue-700">My Communities</h2>

        <button
          onClick={() => navigate("/community")}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : communities.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <Users size={60} className="mx-auto text-blue-400 mb-2" />
          <p>You haven’t joined any communities yet.</p>
          <button
            onClick={() => navigate("/community")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Explore Communities
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition transform hover:scale-[1.02] flex flex-col justify-between p-5"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full border border-blue-300">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-blue-700 text-lg">{c.name}</h3>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">{c.description}</p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleLeave(c._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  <LogOut size={16} /> Leave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
