import User from "../../models/UserModel.js";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find user by ID
    const userById = await User.findById(id);

    if (!userById) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found successfully",
      user: userById,
    });
  } catch (error) {
    console.error("Error finding user:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
