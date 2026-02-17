import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  quantity: { type: Number, default: 0 },
  price: Number,
  sellingPrice: {type: Number,required: true},
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model("Product", productSchema);

const transactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  type: { type: String, enum: ["in", "out"], required: true }, 
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },    
  costPrice: { type: Number, required: false, min: 0 }, 
  value: { type: Number, required: true, min: 0 }, 
  customerName: { type: String, trim: true, default: "" },
  customerContact: { type: String, trim: true, default: "" },
  note: { type: String, trim: true, default: "" },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);


export {
  Product,
  Transaction
};