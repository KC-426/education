import express from "express";
import { superAdmin, teacherAuth } from "../middleWare/auth.js";

import {
  allCourse,
  createCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
  allCourseTeacher,
  allLiveCourse,
  allRecCourse,
  allCourseTeacherById,
  allLiveCourseTeacherById,
  allCoursesWithoutPopulate
} from "../controller/courseController.js";

const router = express.Router();

// All Courses Fetched
router.route("/all_courses").get(allCourse);

router.route("/all_live_courses").get(allLiveCourse);

router.route("/all_rec_courses").get(allRecCourse);

router.route("/allwithout").get(allCoursesWithoutPopulate);

router.route("/all_courses_teacher").get(teacherAuth, allCourseTeacher);
router.route("/all_courses_teacher/:id").get(allCourseTeacherById);
router.route("/all_livecourses_teacher/:id").get(allLiveCourseTeacherById);

// get a particular course
router.route(`/get_course/:id`).get(getCourseById);


// Update course
router.route(`/update_course`).post(superAdmin, updateCourse);
router.route(`/update_course_teacher`).post(teacherAuth, updateCourse);


// Create Course
router.route("/create_courses").post(superAdmin, createCourse);
router.route("/create_courses_teacher").post(teacherAuth, createCourse);

// Delete Course
router.route("/delete_course/:id").delete(superAdmin, deleteCourse);
router.route("/delete_course_teacher/:id").delete(teacherAuth, deleteCourse);


export default router;
