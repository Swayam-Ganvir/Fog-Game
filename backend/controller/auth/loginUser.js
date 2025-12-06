import User from "../../models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user){
            return res.status(400).json({message : "Invalid email or password"})
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(404).json({message : "Invalid email or password"})
        }

        user.isOnline = true
        user.lastLogin = new Date();
        await user.save()

        const token = jwt.sign(
            {id : user._id, email : user.email},
            process.env.JWT_SECRET,
            {expiresIn : "1day"}
        )

        return res.status(200).json({
            message: "Login successful",
            token,
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                avatar : user.avatar,
                location : user.location
            }
        })

    } catch (error){
        return res.status(500).json({message : "Server error", error: error.message})
    }
}
