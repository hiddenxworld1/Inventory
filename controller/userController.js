import { User, Supplier } from "../model/employee.js";
import bcrypt from "bcrypt";
import { userToken } from "../lib/utils.js";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const comPassword = await bcrypt.compare(password, user.password);
    if (!comPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }

    userToken(user._id, res);
    res.json({ success: true, message: "User signed up." });
  } catch (error) {
    console.error("User login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};


export const createSupliers = async (req, res) => {
  try {
    let { name, contact, email, address, company } = req.body;

    if (!email || !contact || !name || !address || !company) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    email = email.trim().toLowerCase();
    name = name.trim();
    company = company?.trim();
    address = address?.trim();

    // Check if supplier exists
    const supplier = await Supplier.findOne({ email });
    if (supplier) {
      return res.status(409).json({ success: false, message: "Supplier already exists." });
    }

    if (typeof contact !== "string") contact = contact.toString();
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ success: false, message: "Contact must be a 10-digit number." });
    }

    const createSup = await Supplier.create({
      name,
      contact,
      email,
      company,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Supplier data saved.",
      supplier: {
        createSup: createSup
      },
    });
  } catch (error) {
    console.error("Supplier creation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


export const updateSuppliers = async (req, res) => {
  try {
    const id = req.params.id;
    let { name, contact, email, address, company } = req.body;
    email = email.trim().toLowerCase();
    name = name.trim();
    company = company?.trim();
    address = address?.trim();

    const supplier = await Supplier.findOne({ email });
    if (!supplier) {
      return res.status(409).json({ success: false, message: "Supplier not exists." });
    }

    if (typeof contact !== "string") contact = contact.toString();
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ success: false, message: "Contact must be a 10-digit number." });
    }
    const updateData = {};
    if (name && name !== supplier.name) {
      updateData.name = name;
    }

    if (contact && contact !== supplier.contact) {
      updateData.contact = contact;
    }
    if (email && email !== supplier.email) {
      updateData.email = email;
    }
    if (address && address !== supplier.address) {
      updateData.address = address;
    }
    if (company && company !== supplier.company) {
      updateData.company = company;
    }
    const updatedSup = await Supplier.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, message: "Supplier updated", updatedSup });
  } catch (error) {
    console.error("Supplier updation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}


export const getUserDetails= async (req,res) => {
  try {
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user){
        return res.status(409).json({ success: false, message: "User not exists." });
    }
    res.json({success:true, message:"User details fetched", user:user})
  } catch (error) {
    console.error("User fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

export const deleteSupplier= async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Supplier.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
}