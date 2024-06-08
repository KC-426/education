import express from "express";
import { superAdmin, teacherAuth, userAuth } from "../middleWare/auth.js";
import { createDiscount,getStudentDiscount } from "../controller/settingController.js";

const router = express.Router();

//Create User
router.route("/creatediscount").post(superAdmin, createDiscount);
router.route("/getstudent_discount").get(getStudentDiscount);

export default router;