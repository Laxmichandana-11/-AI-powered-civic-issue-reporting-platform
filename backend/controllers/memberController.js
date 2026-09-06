import Member from "../models/Member.js";

export const updateMemberActivity = async (req, res) => {
  try {
    const { username, avatar, totalPosts, totalCampaigns, totalVotes, totalReports } = req.body;

    let member = await Member.findOne({ username });
    if (!member) {
      member = new Member({ username, avatar });
    }

    member.totalPosts = totalPosts ?? member.totalPosts;
    member.totalCampaigns = totalCampaigns ?? member.totalCampaigns;
    member.totalVotes = totalVotes ?? member.totalVotes;
    member.totalReports = totalReports ?? member.totalReports;

    member.activityScore =
      member.totalPosts * 2 +
      member.totalCampaigns * 3 +
      member.totalVotes +
      member.totalReports * 1.5;

    await member.save();

    res.status(200).json({ message: "Member activity updated", member });
  } catch (err) {
    console.error(" Update member error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ activityScore: -1 }).limit(20);
    res.json(members);
  } catch (err) {
    console.error(" Get members error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
