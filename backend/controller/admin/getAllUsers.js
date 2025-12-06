import User from "../../models/UserModel.js";

export const getAllUsers = async (req, res) => {

    try{

        const allUsers = await User.find({})

        return res.status(200).json({
            success : true,
            data : allUsers
        })

    }catch(error){
        console.error("Error fetching users : ",error)
        res.status(500).json({
            success : false,
            message : "Failed to fetch users",
            error : error.message
        })
    }

}
