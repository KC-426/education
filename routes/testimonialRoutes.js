import express from "express";
import { createTestimonial, deleteTestimonial, getTestimonial, getTestimonialById, updateTestimonial } from "../controller/testimonialController.js";
import { superAdmin } from "../middleWare/auth.js";
const router = express.Router();

// Add Testimonial
router.route("/add_testimonial").post(superAdmin,createTestimonial);

// get Testimonial
router.route("/get_testimonial").get(getTestimonial);

// get Testimonial by id
router.route("/get_testimonial/:testimonialId").get(getTestimonialById);

// Update Testimonial
router.route(`/update_testimonial`).post(superAdmin,updateTestimonial);

//delete Testimonial
router.route("/delete_testimonial/:id").delete(superAdmin,deleteTestimonial);

export default router;      