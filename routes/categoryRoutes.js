import express from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controller/categoryController.js";
import { superAdmin, teacherAuth } from "../middleWare/auth.js";
const router = express.Router();

// Add Category
router.route("/add_category").post(superAdmin, createCategory);
// router.route("/add_category_teacher").post(teacherAuth, createCategory);

// get category
router.route("/get_category").get(getCategory);

// get category by id
router.route("/get_category/:categoryId").get(getCategoryById);

// Update category
router.route(`/update_category`).post(superAdmin, updateCategory);

//delete category
router.route("/delete_category/:id").delete(superAdmin, deleteCategory);

export default router;