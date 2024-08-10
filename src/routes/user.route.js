import { Router } from "express";
import {
    DeleteUser,
    Login,
    Logout,
    SignUp,
    UpdateAvatar,
    UpdateEmail,
    UpdateName,
    UpdatePassword
    , GetUserInfo
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = new Router();


router.route("/register").post(upload.single('avatar'), SignUp)
router.route("/login").post(Login)
// Protected Routes 
router.route("/logout").post(verifyJWT, Logout)
router.route("/update-avatar").patch(verifyJWT, upload.single('avatar'), UpdateAvatar)
router.route("/update-password").patch(verifyJWT, UpdatePassword)
router.route("/update-email").patch(verifyJWT, UpdateEmail)
router.route("/update-name").patch(verifyJWT, UpdateName)
router.route("/delete-acount").delete(verifyJWT, DeleteUser)
router.route("/user-info").get(verifyJWT, GetUserInfo)







export default router;