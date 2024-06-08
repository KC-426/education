import express from "express";
import { superAdmin } from "../middleWare/auth.js";

import {
  allBundles,
  createCourseBundle,
  deleteBundle,
  getBundleById,
  updateCourseBundle
} from "../controller/bundleController.js";

const router = express.Router();

// All Courses Fetched
router.route("/bundle").get(allBundles);

//get Bundles by user


// get a particular course
router.route(`/bundle/:id`).get(getBundleById);

// Update course
router.route(`/updatebundle`).post(superAdmin, updateCourseBundle);

// Create Course
router.route("/bundle").post(superAdmin, createCourseBundle);

// Delete Course
router.route("/bundle/:id").delete(superAdmin, deleteBundle);


export default router;
