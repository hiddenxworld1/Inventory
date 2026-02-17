import express from "express";
import {admin, adminLogin, createUser, getUserList, delteUser, logout} from "../controller/adminControllers.js"
import {protectRoute} from "../middleware/adminAuth.js"
import {getDashboardData} from "../controller/productController.js"


const router = express.Router();

router.post("/create/admin", admin);
router.post("/login/admin", adminLogin);
router.post("/create/user",protectRoute, createUser);
router.get("/dashbord", protectRoute, getDashboardData);
router.get("/user", protectRoute, getUserList)
router.delete("/user/delete/:userId", protectRoute, delteUser)

router.post("/logout", logout)
export default router;
