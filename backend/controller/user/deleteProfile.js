import User from "../../models/UserModel.js";

export const deleteProfile = async (req, res) => {

    try {

        const { id : userId } = req.params

        // if (!userId) {
        //     return res.status(400).json({ message: "UserId not found" })
        // }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();

        return res.status(200).json({message : "User deleted successfully"})


    } catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Server error" });
    }

}
