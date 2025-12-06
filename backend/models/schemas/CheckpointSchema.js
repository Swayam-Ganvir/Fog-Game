import mongoose from "mongoose";

const CheckpointSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    reachedAt: { type: Date, default: Date.now  },
}, { _id: false });

export default CheckpointSchema;
