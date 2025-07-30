import { Router } from "express";
import * as uc from "./user.controller.js";
import { multerHost } from "../../services/multerHost.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { errorHandler } from "../../utils/errorHandler.js";
import {isAuth} from "../../middlewares/Auth.js"

const router = Router();

router.post(
  "/signUp",
  multerHost(allowedExtensions.images).single("profile"),
  errorHandler(uc.signUp)
);
router.post(
  "/signUpAdmin",
  multerHost(allowedExtensions.images).single("profile"),
  errorHandler(uc.signUpAdmin)
);
router.post("/login", uc.login);
router.post("/update",isAuth(), errorHandler(uc.updateUser));
router.get("/confirmEmail/:token", errorHandler(uc.confirmEmail));
router.get("/getAllUsers", errorHandler(uc.getAllUsers));


export default router;
