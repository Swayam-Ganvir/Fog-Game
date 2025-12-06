import User from "../../models/UserModel.js";

export const getMapData = async (req, res) => {
    try {
        // Either take from auth middleware OR from request body/query
        const userId = req.user?.id || req.body.userId || req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).select(
            "location pathHistory checkpoints stats fogClearedArea"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
