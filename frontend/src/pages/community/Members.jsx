import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Star } from "lucide-react";

export default function MemberHighlight() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];
  const bgColors = ["bg-yellow-100", "bg-gray-100", "bg-amber-100"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-orange-700 font-medium mb-4"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700 flex items-center justify-center gap-2">
          <Award className="text-orange-600" /> Member Highlights
        </h1>
        <p className="text-gray-600">
          Celebrating the most active social activists and community contributors 🌍
        </p>
      </div>

      {/* Top 3 Members */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {members.slice(0, 3).map((member, index) => (
          <div
            key={member._id}
            className={`w-64 ${bgColors[index]} p-5 rounded-2xl shadow-md flex flex-col items-center`}
          >
            <div className={`${medalColors[index]} text-3xl mb-2`}>
              <Star fill="currentColor" />
            </div>
            <img
              src={member.avatar || "https://via.placeholder.com/80"}
              alt={member.username}
              className="w-16 h-16 rounded-full mb-3 border-2 border-orange-500"
            />
            <h3 className="font-semibold text-lg text-gray-800">{member.username}</h3>
            <p className="text-sm text-gray-600">Activity Score: {member.activityScore}</p>
            <p className="text-xs text-gray-500 mt-1">
              Posts: {member.totalPosts} | Campaigns: {member.totalCampaigns}
            </p>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-3xl mx-auto bg-white border border-orange-200 rounded-xl shadow-md">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-orange-100 text-orange-700">
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Posts</th>
              <th className="px-4 py-2">Campaigns</th>
              <th className="px-4 py-2">Votes</th>
              <th className="px-4 py-2">Reports</th>
              <th className="px-4 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={m._id}
                className="border-t hover:bg-orange-50 transition"
              >
                <td className="px-4 py-2 font-semibold text-gray-800">{i + 1}</td>
                <td className="px-4 py-2">{m.username}</td>
                <td className="px-4 py-2">{m.totalPosts}</td>
                <td className="px-4 py-2">{m.totalCampaigns}</td>
                <td className="px-4 py-2">{m.totalVotes}</td>
                <td className="px-4 py-2">{m.totalReports}</td>
                <td className="px-4 py-2 text-right font-semibold text-orange-600">
                  {m.activityScore.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
