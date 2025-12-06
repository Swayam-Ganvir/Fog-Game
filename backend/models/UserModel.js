import mongoose from "mongoose";
import LocationSchema from "./schemas/LocationSchema.js";
import StatsSchema from "./schemas/StatsSchema.js";
import PreferencesSchema from "./schemas/PreferencesSchema.js";
import PowerUpSchema from "./schemas/PowerUpSchema.js";
import InventoryItemSchema from "./schemas/InventoryItemSchema.js";
import CheckpointSchema from "./schemas/CheckpointSchema.js";

const userSchema = new mongoose.Schema({
    // Basic Info
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 6,
    },

    // Avatar
    avatar: {
        type: String,
        default: "",
    },

    // Location
    location: {
        type : LocationSchema,
        default : undefined,
    },

    // Game Data
    fogClearedArea: {
        type: [[Number]], // Array of [lng, lat]
        default: [],
    },
    checkpoints: [CheckpointSchema],

    pathHistory: {
        type: [[Number]],
        default: [],
    },

    powerUps: [PowerUpSchema],

    inventory: [InventoryItemSchema],

    // Stats
    stats: StatsSchema,

    // Preferences
    preferences: PreferencesSchema,

    // Social
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
    ],

    // System Info
    lastLogin: {
        type: Date,
        default: Date.now,
    },

    isOnline: {
        type: Boolean,
        default: false,
    },
    
    role: {
        type: String,
        enum: ["player", "admin"],
        default: "player",
    },

}, {
    timestamps: true,
});

// Compound index for geospatial queries
userSchema.index({ "location.coordinates": "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;
