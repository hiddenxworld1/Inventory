import { User, Supplier } from "../model/employee.js";
import bcrypt from "bcrypt";
import { userToken } from "../lib/utils.js";

/* =========================
   USER LOGIN
========================= */
export const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Password not set for this user",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    userToken(user._id, res);

    res.json({
      success: true,
      message: "Login successful",
      role: user.role,
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   CREATE SUPPLIER
========================= */
export const createSupliers = async (req, res) => {
  try {
    let { name, contact, email, address, company } = req.body;

    if (!name || !contact || !email || !address || !company) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    email = email.trim().toLowerCase();
    name = name.trim();
    address = address.trim();
    company = company.trim();

    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(409).json({
        success: false,
        message: "Supplier already exists",
      });
    }

    contact = contact.toString();
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({
        success: false,
        message: "Contact must be a 10-digit number",
      });
    }

    const supplier = await Supplier.create({
      name,
      contact,
      email,
      address,
      company,
    });

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    console.error("Supplier creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   UPDATE SUPPLIER
========================= */
export const updateSuppliers = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, contact, email, address, company } = req.body;

    if (email) email = email.trim().toLowerCase();
    if (name) name = name.trim();
    if (address) address = address.trim();
    if (company) company = company.trim();

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    if (contact) {
      contact = contact.toString();
      if (!/^\d{10}$/.test(contact)) {
        return res.status(400).json({
          success: false,
          message: "Contact must be a 10-digit number",
        });
      }
      supplier.contact = contact;
    }

    if (name) supplier.name = name;
    if (email) supplier.email = email;
    if (address) supplier.address = address;
    if (company) supplier.company = company;

    await supplier.save();

    res.json({
      success: true,
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    console.error("Supplier update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET USER DETAILS
========================= */
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User details fetched",
      user,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   DELETE SUPPLIER
========================= */
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Supplier delete error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
