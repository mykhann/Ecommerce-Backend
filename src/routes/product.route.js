import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { CreateProduct ,
    DeleteProduct,
    GetProduct,
    updateProduct
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router= new Router();

router.route("/create-product").post(verifyJWT,
    isAdmin,
    upload.fields([{name:"productImage",maxCount:4}]),
    CreateProduct)
router.route("/delete-product/:id").delete(verifyJWT,isAdmin,DeleteProduct)
router.route("/fetch-product/:id").get(verifyJWT,isAdmin,GetProduct)
router.route("/update-product/:id").put(verifyJWT,isAdmin,updateProduct)







export default router;