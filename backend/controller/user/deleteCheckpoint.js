import User from "../../models/UserModel.js"

export const deleteCheckpoint = async (req, res) => {
  try {
    const { userId, index, lat, lng } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedCheckpoints;

    if (index !== undefined) {
      //  Remove by index
      if (index < 0 || index >= user.checkpoints.length) {
        return res.status(400).json({ message: "Invalid checkpoint index" });
      }
      user.checkpoints.splice(index, 1);
    } else if (lat !== undefined && lng !== undefined) {
      //  Remove by coordinates
      user.checkpoints = user.checkpoints.filter(
        (cp) => !(cp.lat === lat && cp.lng === lng)
      );
    } else {
      return res
        .status(400)
        .json({ message: "Either index or lat/lng is required" });
    }

    // Update stats (keep in sync)
    user.stats.totalCheckpoints = user.checkpoints.length;

    await user.save();

    updatedCheckpoints = user.checkpoints;

    return res.status(200).json({
      message: "Checkpoint deleted successfully",
      checkpoints: updatedCheckpoints,
    });
  } catch (error) {
    console.error(" Error deleting checkpoint:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
