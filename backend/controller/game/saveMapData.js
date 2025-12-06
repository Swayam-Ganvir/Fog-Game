import User from "../../models/UserModel.js";

export const saveMapData = async (req, res) => {
    try {
        const { userId, location, pathHistory, checkpoints, stats, fogClearedArea } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the provided fields
        if (location) user.location = location;
        if (pathHistory) user.pathHistory = pathHistory;
        if (checkpoints) user.checkpoints = checkpoints;

        // Ensure stats object exists
        user.stats = user.stats || { distanceTravelled: 0, totalCheckpoints: 0, timePlayed: 0 };

        if (stats?.distanceTravelled !== undefined) {
            user.stats.distanceTravelled = stats.distanceTravelled;
        }
        if (stats?.totalCheckpoints !== undefined) {
            user.stats.totalCheckpoints = stats.totalCheckpoints;
        }

        if (fogClearedArea) user.fogClearedArea = fogClearedArea;

        // --- TIME PLAYED UPDATE ---
        const now = Date.now();
        if (!user.lastLogin) {
            // first time initializing loginTime
            user.lastLogin = now;
        } else {
            // calculate difference since last update (seconds)
            const sessionDelta = Math.floor((now - user.lastLogin) / 1000);

            // add to total time played
            user.stats.timePlayed = (user.stats.timePlayed || 0) + sessionDelta;

            // reset lastLoginTime
            user.lastLogin = now;
        }

        await user.save();

        return res.json({
            message: "Map data updated successfully",
            stats: user.stats
        });

    } catch (error) {
        console.error("Error in saveMapData:", error);
        return res.status(500).json({ message: error.message });
    }
};
