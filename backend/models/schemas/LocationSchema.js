import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

export default LocationSchema;
