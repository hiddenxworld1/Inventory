import mongoose from "mongoose";

const admin = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
});
const adminModel = mongoose.model("admin", admin);

export default adminModel;