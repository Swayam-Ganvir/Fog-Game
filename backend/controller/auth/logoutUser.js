import User from '../../models/UserModel.js'

export const userLogout = async (req, res) => {
    try {
      const { userId } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
  
      const user = await User.findById(userId);
  
      if (!user || !user.lastLogin) {
        return res.status(400).json({ message: "User not logged in" });
      }
  
      const now = new Date();
      const sessionTime = Math.floor((now - new Date(user.lastLogin)) / 1000); // ✅ convert to seconds
  
      // ✅ update total timePlayed correctly inside stats
      user.stats.timePlayed = (user.stats.timePlayed || 0) + sessionTime;
  
      // ✅ update status
      user.isOnline = false;
  
      // ✅ keep lastLogin for admin visibility
      user.lastLogout = now;
  
      await user.save();
  
      res.json({
        success: true,
        message: "Logout successful",
        stats: user.stats,
        lastLogin: user.lastLogin,
        lastLogout: user.lastLogout,
        isOnline: user.isOnline
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
