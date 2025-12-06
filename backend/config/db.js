import mongoose from "mongoose";

export const dbConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected")
    }catch(error){
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
}
