import adminModel from "../model/db.js";
import { User } from "../model/employee.js"
import { adminToken } from "../lib/utils.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const admin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = await adminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Account created successfully",
        admin: newAdmin,
      });
  } catch (error) {
    console.error("Admin Creation Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });
    }
    const comPassword = await bcrypt.compare(password, admin.password);
    if (!comPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }
    adminToken(admin._id, res);
    res.json({ success: true, message: "Admin is logged in" });
  } catch (error) {
    console.error("Admin login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    return res
      .status(201)
      .json({
        success: true,
        message: "Account created successfully",
        user: newUser,
      });


  } catch (error) {
    console.error("User creation Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const getUserList = async (req, res) => {
  try {
    
    const user= await User.find({});
    if(!user){
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success:true ,message:"User list fetched", user:user})
  } catch (error) {
    console.error("User creation Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const delteUser = async (req, res) => {
  try {
    const id=req.params.userId;
    const user= await User.findByIdAndDelete(id);
    if(!user){
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success:true ,message:"User Deleted successfully"})
  } catch (error) {
    console.error("User creation Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export async function logout(req, res){
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success:true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};