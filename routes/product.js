import express from "express";
import { protectRoute } from "../middleware/userAuth.js";
import {
  newProduct,
  updateProduct,
  addNewStock,
  createCategory,
  getAllProducts,
  categories,
  allSuppilers,
  updateCategory,
  deleteCategory,
  deleteProduct,
  addStockProduct,
  saleProduct,
  getAllTransactions,
  getDashboardData
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/add/product", protectRoute, newProduct);
productRouter.put("/update/product/:id", protectRoute, updateProduct);
productRouter.delete("/delete/product", protectRoute, deleteProduct);
productRouter.post("/addstock", protectRoute, addNewStock);
productRouter.post("/add/category", protectRoute, createCategory);
productRouter.put("/update/category/:id", protectRoute, updateCategory);
productRouter.delete("/delete/category", protectRoute, deleteCategory);
productRouter.get("/products", protectRoute, getAllProducts);
productRouter.get("/category", protectRoute, categories);
productRouter.get("/suppliers", protectRoute, allSuppilers);
productRouter.post("/add/stock", protectRoute, addStockProduct);
productRouter.post("/sale/stock", protectRoute, saleProduct);
productRouter.get("/all/trancations", protectRoute, getAllTransactions)

productRouter.get("/data", protectRoute, getDashboardData);

export default productRouter;
