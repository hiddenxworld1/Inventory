import { Product, Transaction, } from "../model/product.js"
import { Category, Supplier } from "../model/employee.js"
import mongoose from "mongoose";

function generateSKU() {
  return 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}


export const newProduct = async (req, res) => {
  try {
    const { name, category, quantity, price, supplier, sellingPrice } = req.body;
    if (!name || !category || !supplier || sellingPrice === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(sellingPrice) || sellingPrice < 0) {
      return res.status(400).json({ message: "Invalid selling price." });
    }

    if (sellingPrice < price) {
      return res.status(400).json({ message: "Selling price cannot be less than cost price." });
    }
    const product = await Product.create({
      name,
      sku: generateSKU(),
      category,
      quantity,
      price,
      supplier,
      sellingPrice,
      createdBy: req.user._id
    })
    res.json({ success: true, message: "Product added in inventry.", product: product })
  } catch (error) {
    console.log("Error on new product adding", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const sku=req.params.id;
    const { name, category, quantity, price, supplier, sellingPrice } = req.body;
    const user = req.user._id;

    const product = await Product.findOne({ sku: sku });
    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }

    const updateData = {};

    if (name && name !== product.name) {
      updateData.name = name;
    }

    if (category && category.toString() !== product.category.toString()) {
      updateData.category = category;
    }

    if (quantity !== undefined && quantity !== product.quantity) {
      updateData.quantity = quantity;
    }

    if (price !== undefined && price !== product.price) {
      updateData.price = price;
    }

    if (supplier !== undefined && supplier !== product.supplier) {
      updateData.supplier = supplier;
    }
    if (sellingPrice !== undefined && sellingPrice !== product.sellingPrice) {
      updateData.sellingPrice = sellingPrice;
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({ success: false, message: "No changes detected." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product data updated.",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Error in update Product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


export const addNewStock = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sku, quantity, note } = req.body;
    const userId = req.user._id;

    if (!sku || !quantity || isNaN(quantity) || quantity <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Valid sku and quantity required." });
    }

    const product = await Product.findOne({ sku }).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    product.quantity += Number(quantity);
    await product.save({ session });

    await Transaction.create(
      [{
        product: product._id,
        user: userId,
        category: product.category,
        type: "in",
        quantity: Number(quantity),
        note: note || "Stock added"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Stock added successfully", product });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in add new stock:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};



export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name, description });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category supplier").lean(); 

    const updatedProducts = products.map(product => {
      let status = "Out of Stock";
      if (product.quantity >= 50) {
        status = "In Stock";
      } else if (product.quantity > 0) {
        status = "Low Stock";
      }

      return {
        ...product,
        status,
        value: product.quantity * product.sellingPrice,
      };
    });

    res.json({ success: true, products: updatedProducts });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const categories = async (req, res) => {
  try {
    const category = await Category.find({});
    if (!category) {
      return res.status(400).json({ success: false, message: "Category is not exists" });

    }
    res.json({ success: true, message: "Categories are fetched", categories: category });
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const allSuppilers = async (req, res) => {
  try {
    const suppiler = await Supplier.find({});
    if (!suppiler) {
      return res.status(400).json({ success: false, message: "suppilers are not exists" });

    }
    res.json({ success: true, message: "suppiler are fetched", suppiler: suppiler });
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
      },
      { new: true }
    );

    res.json({ success: true, message: "Category updated", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
}

export const deleteProduct= async (req, res) => {
   try {
    const { id } = req.body;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
}

export const addStockProduct = async (req, res) => {
  try {
    const { productName, costPrice, quantity, type, sku, note } = req.body;
    const user = req.user._id;

    if (type !== "in") {
      return res.status(400).json({ success: false, message: "Only 'in' (purchase) type allowed" });
    }

    const product = await Product.findOne({ name: productName, sku });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const oldQty = Number(product.quantity);
    const newQty = Number(quantity);
    const oldCost = Number(product.price);
    const newCost = Number(costPrice);

    const totalQty = oldQty + newQty;
    const avgCost = ((oldQty * oldCost) + (newQty * newCost)) / totalQty;

    product.quantity = totalQty;
    product.price = avgCost;

    await product.save();

    const transaction = await Transaction.create({
      product: product._id,
      user,
      category: product.category,
      type,
      price: newCost, // cost price for purchase
      quantity: newQty,
      value: newCost * newQty,
      note
    });

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      transaction,
      updatedProduct: product
    });

  } catch (error) {
    console.error("Add stock error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const saleProduct = async (req, res) => {
  try {
    const { productName, sellingPrice, quantity, type, sku, note, customerName, customerContact } = req.body;
    const user = req.user._id;

    if (type !== "out") {
      return res.status(400).json({ success: false, message: "Only 'out' (sale) type allowed" });
    }

    const product = await Product.findOne({ name: productName, sku });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const oldQty = Number(product.quantity);
    const sellQty = Number(quantity);
    const salePrice = Number(sellingPrice);
    const costAtSale = product.price; 

    if (sellQty > oldQty) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    const remainingQty = oldQty - sellQty;

    product.quantity = remainingQty;
    await product.save();

    const transaction = await Transaction.create({
      product: product._id,
      user,
      category: product.category,
      type,
      price: salePrice,
      costPrice: costAtSale,
      quantity: sellQty,
      value: salePrice * sellQty,
      customerName,
      customerContact,
      note
    });

    res.status(201).json({
      success: true,
      message: "Product sold successfully",
      transaction,
      updatedProduct: product
    });

  } catch (error) {
    console.error("Sale error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("product category")
      .lean();

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transaction records found.",
      });
    }

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching transactions.",
      error: error.message,
    });
  }
};




export const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalStockAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      }
    ]);
    const totalStock = totalStockAgg[0]?.totalQty || 0;
    const totalValue = totalStockAgg[0]?.totalValue || 0;

    const lowStockProducts = await Product.find()
      .sort({ quantity: 1 })
      .limit(5)
      .select("name quantity")
      .lean();

    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories", 
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: "$categoryInfo.name",
          count: 1
        }
      }
    ]);

    const lowStockCount = await Product.countDocuments({ quantity: { $lt: 50 } });

    const monthlyStockTrend = await Product.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          value: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      stats: {
        totalProducts,
        totalStock,
        totalValue,
        lowStockCount
      },
      lowStockProducts,
      categoryCounts,
      monthlyStockTrend
    });
  } catch (error) {
    console.error("Error in /api/product/data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
