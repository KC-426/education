import express from "express";
import { createFaq, deleteFaq, getFaq, getFaqById, updateFaq } from "../controller/faqController.js"
import { superAdmin } from "../middleWare/auth.js";
const router = express.Router();

// Add Faq
router.route("/add_faq").post(superAdmin,createFaq);

// get Faq
router.route("/get_faq").get(getFaq);

// get Faq by id
router.route("/get_faq/:faqId").get(getFaqById);

// Update Faq
router.route(`/update_faq`).post(superAdmin,updateFaq);

//delete Faq
router.route("/delete_faq/:id").delete(superAdmin,deleteFaq);

export default router;