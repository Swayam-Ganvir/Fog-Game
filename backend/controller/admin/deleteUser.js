import User from "../../models/UserModel.js"

export const deleteUser = async (req, res) => {

    try{
        
        const { id } = req.params;

        if( !id ) {
            return res.status(400).json({message : "User Id is required"})
        }

        const user = await User.findById( id );

        if (!user){
            return res.status(404).json({message : "User not found"})
        }

        await User.findByIdAndDelete(id)

        return res.status(200).json({message : "User deleted Successfully"})

    }catch(error){
        console.error("Error deleting User : ", error)
        return res.status(500).json({message : "Internal server error"})
    }

}
