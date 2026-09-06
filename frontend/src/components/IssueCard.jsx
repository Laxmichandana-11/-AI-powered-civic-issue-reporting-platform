import { Link } from "react-router-dom";

export default function IssueCard({ issue }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
      {issue.image && (
        <img src={issue.image} alt={issue.title} className="h-48 w-full object-cover rounded mb-3" />
      )}
      <h3 className="text-xl font-semibold text-gray-800">{issue.title}</h3>
      <p className="text-gray-600 mt-2">{issue.description.slice(0, 160)}{issue.description.length>160?"...":""}</p>
      <p className="mt-3 text-sm text-gray-500">📍 {issue.location}</p>
      <span className="mt-3 inline-block bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm">
        {issue.category}
      </span>
      <div className="mt-3">
        <Link to={`/post/${issue._id}`} className="text-blue-600 hover:underline">Read more</Link>
      </div>
    </div>
  );
}
