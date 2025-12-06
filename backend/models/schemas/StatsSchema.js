import mongoose from "mongoose";

const StatsSchema = new mongoose.Schema({
    distanceTravelled: { type: Number, default: 0 }, // in meters
    totalCheckpoints: { type: Number, default: 0 },
    timePlayed: { type: Number, default: 0 }, // in seconds
}, { _id: false });

export default StatsSchema;
