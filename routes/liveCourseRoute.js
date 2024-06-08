import express from "express";
import { superAdmin, teacherAuth } from "../middleWare/auth.js";

import {
  allLiveCourse,
  allLiveCourseTeacher,
  createLiveCourse,
  deleteLiveCourse,
  getCourseById,
  updateLiveCourse,
  allLiveCourseWithoutPopulate
} from "../controller/liveCourseController.js";

const router = express.Router();

// All Courses Fetched
router.route("/live").get(allLiveCourse);

// All Courses Fetched
router.route("/livewithout").get(allLiveCourseWithoutPopulate);

router.route("/live_teacher").get(teacherAuth, allLiveCourseTeacher);

// get a particular course
router.route(`/live/:id`).get(getCourseById);


// Update course
router.route(`/updatelive`).post(superAdmin, updateLiveCourse);
router.route(`/updatelive_teacher`).post(teacherAuth, updateLiveCourse);


// Create Course
router.route("/live").post(superAdmin, createLiveCourse);

// Delete Course
router.route("/live/:id").delete(superAdmin, deleteLiveCourse);
router.route("/live_teacher/:id").delete(teacherAuth , deleteLiveCourse);


export default router;
