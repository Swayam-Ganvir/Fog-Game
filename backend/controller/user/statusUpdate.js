import User from "../../models/UserModel.js";

export const statusUpdate = async (req, res) => {

    try {
        const { userId, isOnline } = req.body;

        if (!userId) return res.status(400).json({ error: "User ID required" });

        const user = await User.findByIdAndUpdate(
            userId,
            { isOnline },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error updating online status:", error);
        res.status(500).json({ error: "Server error" });
    }
}