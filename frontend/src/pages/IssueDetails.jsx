import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIssueById } from "../api/issues";

export default function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    getIssueById(id).then(res => setIssue(res.data)).catch(err => console.error(err));
  }, [id]);

  if (!issue) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{issue.title}</h1>
        {issue.image && <img src={issue.image} alt={issue.title} className="mb-4 w-full object-cover rounded" />}
        <p className="mb-2">{issue.description}</p>
        <p className="text-sm text-gray-500">Reported by: {issue.user?.name || "Unknown"}</p>
        <p className="text-sm text-gray-500">Location: {issue.location}</p>
        <p className="text-sm text-gray-500">Category: {issue.category}</p>
      </div>
    </div>
  );
}
