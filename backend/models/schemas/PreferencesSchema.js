import mongoose from "mongoose";

const PreferencesSchema = new mongoose.Schema({
    dayNightCycle: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true },
}, { _id: false });

export default PreferencesSchema;
