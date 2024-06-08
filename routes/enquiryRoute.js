import express from "express";
import { createEnquiry, getEnquiry,getEnquiryByid, deleteEnquiry, getEnquiry_teacher } from "../controller/enquiryController.js"
import { superAdmin, teacherAuth, userAuth } from "../middleWare/auth.js";
const router = express.Router();

// Add Enquiry
router.route("/add_enquiry").post(userAuth,createEnquiry);

// get Enquiry
router.route("/get_enquiry").get(superAdmin, getEnquiry);
router.route("/get_enquirybyid/:id").get(getEnquiryByid);
router.route("/get_enquiry_teacher").get(teacherAuth, getEnquiry_teacher);

//delete Enquiry
router.route("/delete_enquiry/:id").delete(deleteEnquiry);

export default router;