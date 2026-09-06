import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Award, Medal } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../api/axios";

export default function Spotlight() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("common");
  const [commonData, setCommonData] = useState([]);
  const [myData, setMyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (activeTab === "common") {
          const res = await api.get("/spotlights/common");
          setCommonData(res.data || []);
        } else if (activeTab === "my") {
          const token = localStorage.getItem("token");
          if (!token) {
            setMyData([]);
            toast.error("Please log in to view your spotlight");
            return;
          }

          const res = await api.get("/spotlights/my");
          setMyData(res.data || []);
        }
      } catch (err) {
        console.error("❌ Spotlight fetch error:", err);
        toast.error("Failed to fetch spotlight data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-orange-700 font-medium mb-4"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">🌟 Spotlight</h1>
        <p className="text-gray-600">
          Celebrate achievements and community impact
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("common")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "common"
              ? "bg-orange-600 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          Common Spotlight
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "my"
              ? "bg-orange-600 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          My Spotlight
        </button>
      </div>

      {/* Common Spotlight Section */}
      {activeTab === "common" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading...</p>
          ) : commonData.length > 0 ? (
            commonData.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between bg-white border border-orange-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {index === 0 && <Medal className="text-orange-500" size={28} />}
                  {index === 1 && <Medal className="text-gray-400" size={28} />}
                  {index === 2 && <Medal className="text-orange-600" size={28} />}
                  {index > 2 && <Award className="text-orange-400" size={24} />}
                  {item.user?.avatar && (
                    <img
                      src={item.user.avatar}
                      alt={item.user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-orange-600">
                      {item.category === "trending_post"
                        ? "Trending Post"
                        : item.category === "achievement"
                        ? "Milestone"
                        : item.category}
                    </p>
                    <p className="text-sm text-gray-500">{item.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-700 font-bold">
                    #{index + 1} • {item.score?.toLocaleString?.() ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No spotlight data available yet ✨ Be the first to hit 100 likes on a
              post or reach 1K posts!
            </p>
          )}
        </div>
      )}

      {/* My Spotlight Section */}
      {activeTab === "my" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading...</p>
          ) : myData.length > 0 ? (
            myData.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between bg-white border border-orange-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Star className="text-orange-500" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs uppercase tracking-wide text-orange-600">
                      {item.category === "trending_post"
                        ? "Trending Post"
                        : item.category === "achievement"
                        ? "Milestone"
                        : item.category}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : ""}
                  </p>
                  {typeof item.score === "number" && (
                    <p className="text-xs text-orange-700 font-semibold">
                      Score: {item.score.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 mt-10">
              <p className="font-semibold text-lg">
                No spotlight unlocked yet ✨
              </p>
              <p className="text-sm mt-2">
                Post actively and engage with the community to unlock:
              </p>
              <ul className="text-sm mt-3 space-y-1">
                <li>
                  • Reach <span className="font-semibold">1K posts</span>
                </li>
                <li>
                  • Get <span className="font-semibold">100+ likes</span> on a
                  single post
                </li>
                <li>• Create posts that get super fast engagement 🚀</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
