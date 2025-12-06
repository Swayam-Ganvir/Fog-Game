import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantity: { type: Number, default: 1 },
}, { _id: false });

export default InventoryItemSchema;
