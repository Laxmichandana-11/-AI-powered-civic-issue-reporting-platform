const API_URL = process.env.API_URL || "http://localhost:4000";
const DEMO_PASSWORD = "CivixDemo2026!";

const demoUsers = [
  { username: "maya.sharma", name: "Maya Sharma", email: "maya.sharma@civix.demo", gender: "female" },
  { username: "aarav.mehta", name: "Aarav Mehta", email: "aarav.mehta@civix.demo", gender: "male" },
  { username: "zoya.khan", name: "Zoya Khan", email: "zoya.khan@civix.demo", gender: "female" },
  { username: "rohan.patel", name: "Rohan Patel", email: "rohan.patel@civix.demo", gender: "male" },
  { username: "anika.rao", name: "Anika Rao", email: "anika.rao@civix.demo", gender: "female" },
];

const demoIssues = [
  {
    category: "Road",
    title: "Large pothole near the community library",
    description: "A deep pothole has formed near the library entrance and is difficult for two-wheelers to avoid, especially after dark.",
    location: "Green Park Road",
  },
  {
    category: "Garbage",
    title: "Overflowing bins at the market entrance",
    description: "The public bins have been overflowing for several days and waste is spreading onto the pedestrian walkway.",
    location: "Central Market",
  },
  {
    category: "Water",
    title: "Low water pressure in Block B",
    description: "Residents are receiving very low water pressure in the mornings and the issue has continued throughout the week.",
    location: "Block B Apartments",
  },
  {
    category: "Electricity",
    title: "Streetlight outage at the bus stop",
    description: "The streetlight beside the bus stop has stopped working, making the area unsafe for commuters after sunset.",
    location: "Civic Centre Bus Stop",
  },
  {
    category: "Other",
    title: "Damaged bench in the public park",
    description: "One of the park benches has a broken seat and exposed screws that could injure visitors.",
    location: "Riverside Public Park",
  },
];

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status}: ${body.message || "Request failed"}`);
  }
  return body;
}

async function getOrCreateUser(profile) {
  try {
    const result = await request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, password: DEMO_PASSWORD }),
    });
    return result;
  } catch (error) {
    if (!error.message.startsWith("400:")) throw error;
    return request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: profile.email, password: DEMO_PASSWORD }),
    });
  }
}

async function createOrFindIssue(issueData, token, userId) {
  const existingIssues = await request("/api/issues");
  const existing = existingIssues.find((issue) => issue.title === issueData.title);
  if (existing) return existing;

  const form = new FormData();
  Object.entries(issueData).forEach(([key, value]) => form.append(key, value));
  const created = await request("/api/issues", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return { ...created, user: userId };
}

async function ensureLike(issue, user) {
  const alreadyLiked = (issue.likes || []).some((id) => id.toString() === user.id.toString());
  if (alreadyLiked) return;
  await request(`/api/issues/${issue._id}/like`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

async function main() {
  const users = [];
  for (const profile of demoUsers) {
    const result = await getOrCreateUser(profile);
    users.push({ id: result.user._id, token: result.token, ...profile });
  }

  const issues = [];
  for (let index = 0; index < demoIssues.length; index += 1) {
    const owner = users[index % users.length];
    const issue = await createOrFindIssue(demoIssues[index], owner.token, owner.id);
    issues.push(issue);
  }

  for (let issueIndex = 0; issueIndex < issues.length; issueIndex += 1) {
    const issue = issues[issueIndex];
    for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
      if (userIndex !== issueIndex % users.length && userIndex < 3) {
        await ensureLike(issue, users[userIndex]);
      }
    }
  }

  console.log(`Seeded ${users.length} demo users and ${issues.length} category issues.`);
  console.log(`Demo password for all users: ${DEMO_PASSWORD}`);
  users.forEach((user) => console.log(`${user.name}: ${user.email}`));
}

main().catch((error) => {
  console.error("Demo data seed failed:", error.message);
  process.exitCode = 1;
});
