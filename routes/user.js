import express from "express";
import {protectRoute} from "../middleware/userAuth.js"
import {userLogin, createSupliers, updateSuppliers, getUserDetails, deleteSupplier} from "../controller/userController.js"


const userRouter = express.Router();

userRouter.post("/login/user", userLogin);
userRouter.post("/create/suppiler" ,protectRoute, createSupliers);
userRouter.put("/update/suppiler/:id" ,protectRoute, updateSuppliers);
userRouter.get("/user" ,protectRoute, getUserDetails);
userRouter.delete("/delete/suppiler" ,protectRoute, deleteSupplier);

//
export default userRouter;