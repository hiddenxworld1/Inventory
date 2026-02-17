import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["manager", "staff"], default: "staff" , lowercase: true },
    createdAt: { type: Date, default: Date.now }
  
  });
const User = mongoose.model("User", userSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});
const Category = mongoose.model("Category", categorySchema);


const supplierSchema = new mongoose.Schema({
  name: String,
  contact: {type:Number},
  email: String,
  company:String,
  address: String
});
const Supplier = mongoose.model("Supplier", supplierSchema);



export {
  User,
  Category,
  Supplier
};
