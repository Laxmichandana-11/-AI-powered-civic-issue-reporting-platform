import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: "At least 2 options required" });
    }

    const poll = await Poll.create({
      question,
      options: options.map((t) => ({ text: t })),
      createdBy: req.user._id,
    });

    res.status(201).json(poll);
  } catch (err) {
    console.error("❌ Create poll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(" Get polls error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex, clear } = req.body;
    const userId = req.user._id;

    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const existingVote = poll.voters.find(
      (v) => v.user.toString() === userId.toString()
    );

    if (clear) {
      if (!existingVote)
        return res.status(400).json({ message: "You haven't voted yet" });

      poll.options[existingVote.optionIndex].votes -= 1;
      poll.voters = poll.voters.filter(
        (v) => v.user.toString() !== userId.toString()
      );

      await poll.save();
      return res.json({ message: "Vote cleared", poll });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option" });
    }

    if (existingVote) {
      poll.options[existingVote.optionIndex].votes -= 1;
      poll.options[optionIndex].votes += 1;

      existingVote.optionIndex = optionIndex;

      await poll.save();
      return res.json({ message: "Vote updated", poll });
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push({ user: userId, optionIndex });

    await poll.save();
    res.json({ message: "Vote recorded", poll });
  } catch (err) {
    console.error("Vote poll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
