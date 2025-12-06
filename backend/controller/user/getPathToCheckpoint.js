import axios from "axios";
import User from "../../models/UserModel.js";

export const getPathToCheckpoint = async (req, res) => {
  try {
    const { userId, lat, lng, checkpointIndex } = req.query;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get checkpoint
    const checkpoint = user.checkpoints[checkpointIndex];
    if (!checkpoint) {
      return res.status(404).json({ message: "Checkpoint not found" });
    }

    // Call OpenRouteService API (change to walking/driving as needed)
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      {
        params: {
          api_key: process.env.ORS_API_KEY, // put your API key in .env
          start: `${lng},${lat}`,
          end: `${checkpoint.lng},${checkpoint.lat}`,
        },
      }
    );

    return res.json({
      path: response.data.features[0].geometry.coordinates, // [lng, lat] pairs
      distance: response.data.features[0].properties.segments[0].distance, // meters
      duration: response.data.features[0].properties.segments[0].duration, // seconds
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching path" });
  }
};
