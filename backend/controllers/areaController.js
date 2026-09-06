import Area from "../models/Area.js";

export const createAreaCompare = async (req, res) => {
  try {
    const { name, city, description, population, cleanlinessScore, infrastructureScore, safetyScore } = req.body;

    const area = await Area.create({
      name,
      city,
      description,
      population,
      cleanlinessScore,
      infrastructureScore,
      safetyScore,
      createdBy: req.user,
    });

    res.status(201).json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllAreaCompares = async (req, res) => {
  try {
    const areas = await Area.find().populate("createdBy", "name email");
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAreaCompareById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).populate("createdBy", "name email");
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeAreaCompare = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ message: "Area not found" });

    const userId = req.user;

    if (area.likes.includes(userId)) {
      area.likes.pull(userId);
    } else {
      area.likes.push(userId);
    }

    await area.save();
    res.json({ likes: area.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
