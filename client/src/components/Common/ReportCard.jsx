import React from "react";

import { Link } from "react-router-dom";

function ReportCard({ report }) {
  const {
    title,
    description,
    category,
    severity,
    status,
    imagePath,
    location,
    createdAt,
  } = report;

  const shortDesc = description?.length > 120 ? description.slice(0, 120) + "..." : description;
  const likesCount = report.likes?.length || 0;

  return (
    <Link to={`/issues/${report._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        {imagePath && (
          <img src={imagePath} alt={title} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-700 text-sm mb-2">{shortDesc}</p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{category}</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Severity: {severity}</span>
            </div>
            <div className="text-right">
              <div className="text-xs">Status: <span className="font-medium">{status}</span></div>
              <div className="text-xs">{location?.address || "Location not provided"}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-xs text-gray-500">
            <div>{new Date(createdAt).toLocaleString()}</div>
            <div>❤️ {likesCount}</div>
            {report.commentCount !== undefined && <div>💬 {report.commentCount}</div>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ReportCard;
