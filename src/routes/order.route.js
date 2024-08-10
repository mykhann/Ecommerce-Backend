import { Router } from "express";
import { createOrder, deletorder, getallOrders, getOrder, updateorder } from "../controller/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = new Router();

// Protected routes 

router.route("/create-order").post(verifyJWT,createOrder)
router.route("/get-order/:id").get(verifyJWT,getOrder)
router.route("/getallorders").get(verifyJWT,getallOrders)
router.route("/update-order/:id").post(verifyJWT,updateorder)
router.route("/delete-order/:id").delete(verifyJWT,deletorder)





export default router