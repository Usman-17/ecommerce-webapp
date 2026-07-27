import { Area } from "../models/area.model.js";

// PATH     : /api/area/create
// METHOD   : POST
// ACCESS   : Private Admin
// DESC     : Create Area
export const createArea = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Area Name is required" });
    }

    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res
        .status(400)
        .json({ error: "Area with this name already exists" });
    }

    const area = await new Area({ name }).save();
    return res.status(201).json(area);
  } catch (error) {
    console.error("Error in createArea controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/area/update/:id
// METHOD   : PUT
// ACCESS   : Private Admin
// DESC     : Update Area
export const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ error: "Area not found" });

    if (name) area.name = name;

    await area.save();
    res.status(200).json(area);
  } catch (error) {
    console.error("Error in updateArea:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/area/all
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get all areas
export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ createdAt: -1 });
    return res.status(200).json(areas);
  } catch (error) {
    console.error("Error in getAllAreas:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/area/:id
// METHOD   : GET
// ACCESS   : PUBLIC
// DESC     : Get single area
export const getArea = async (req, res) => {
  const { id } = req.params;
  try {
    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    res.status(200).json(area);
  } catch (error) {
    console.error("Error in getArea:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PATH     : /api/area/:id
// METHOD   : DELETE
// ACCESS   : Private Admin
// DESC     : Delete Area
export const deleteArea = async (req, res) => {
  const { id } = req.params;
  try {
    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ error: "Area not found" });

    await Area.findByIdAndDelete(id);
    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error) {
    console.error("Error in deleteArea:", error.message);
    res.status(500).json({ error: error.message });
  }
};
