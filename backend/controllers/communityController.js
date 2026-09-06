import Poll from "../models/Poll.js";
import Member from "../models/Member.js";

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({ question, options });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);
    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ points: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { name, points, avatar } = req.body;
    const member = new Member({ name, points, avatar });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const joinCommunity = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    res.json({ message: "Joined community successfully", community });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to join community" });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    community.members = community.members.filter((m) => m.toString() !== userId);
    await community.save();

    res.json({ message: "Left community successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to leave community" });
  }
};

export const getMyCommunities = async (req, res) => {
  try {
    const userId = req.user;
    const communities = await Community.find({ members: userId });
    res.json(communities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your communities" });
  }
};
