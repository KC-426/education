import express from "express";
import { superAdmin, teacherAuth } from "../middleWare/auth.js";

import {
  allTeachers,
  createTeacher,
  deleteTeacher,
  fetchLoginTeacherAdmin,
  getTeacherById,
  logOurTeacherAdmin,
  loginTeacher,
  updateTeacher,
} from "../controller/teacherController.js";

const router = express.Router();

// All Teachers Fetched
router.route("/teacher").get(allTeachers);

// get a particular teacher
router.route(`/teacher/:id`).get(getTeacherById);

// Update teacher
router.route(`/teacher`).post(superAdmin, updateTeacher);

// Create Teacher
router.route("/createteacher").post(superAdmin, createTeacher);
// Delete Course
router.route("/teacher/:id").delete(superAdmin, deleteTeacher);

// Login teacher
router.route(`/login_teacher`).post(loginTeacher);

router.route("/fetch_login_teacher_admin").post(teacherAuth, fetchLoginTeacherAdmin);


  //Update super admin
  router.route("/logout_teacher_admin").post(superAdmin, logOurTeacherAdmin);

export default router;
