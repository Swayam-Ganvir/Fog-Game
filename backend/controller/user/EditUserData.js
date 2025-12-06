import User from "../../models/UserModel.js";

export const updateUserById = async (req, res) => {

    try{

        const { id } = req.params;
        const update = req.body;

        const updatedUser = await User.findByIdAndUpdate(id , update, {new:true, runValidators:true})

        if(!updatedUser){
            return res.status(404).json({message : "User not found"})
        }

        return res.status(404).json(updatedUser)

    }catch(error){
        return res.status(500).json({message : "Error updating user", error : error.message})
    }

}


