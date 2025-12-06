import mongoose from "mongoose";

const PowerUpSchema = new mongoose.Schema({
    type: { type: String, required: true },
    acquiredAt: Date,
    expiresAt: Date,
}, { _id: false });

export default PowerUpSchema;
