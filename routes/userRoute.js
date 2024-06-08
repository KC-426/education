import express from "express";
import { superAdmin, teacherAuth, userAuth } from "../middleWare/auth.js";

import {
  allUsers,
  allUsersByTeacher,
  allUsersByCourses,
  userReviewOnChapter,
  userCourseReview,
  getStudentByReferId,
  allLiveUsers,
  allRecUsers,
  allUsersByLiveCourses,
  loginUser,
  me,
  myOrder,
  registerUser,
  studentsEnrolledInCourse,
  fetchLoginSuperAdmin,
  logout,
  myLiveOrder,
  allUsersByBundleCourses,
  myBundleOrder,
} from "../controller/userController.js";

// import {
//   allUsers,
//   allUsersByTeacher,
//   allUsersByCourses,
//   allUsersByLiveCourses,
//   loginUser,
//   me,
//   myOrder,
//   registerUser,
//   studentsEnrolledInCourse,
//   fetchLoginSuperAdmin,
//   logout,
//   myLiveOrder,
//   getStudentByReferId,
// } from "../controller/userController.js";

const router = express.Router();

// All Item Fetched
router.route("/all_users").get(superAdmin, allUsers);

router.route("/all_live_users").get(superAdmin, allLiveUsers);

router.route("/all_rec_users").get(superAdmin, allRecUsers);

// router.route("/all_users?name=""&id=""&phone=""&email=''").get(superAdmin, allUsers);

// All Users by Teacher
// router.route("/all_users_by_teacher/:id").get(teacherAuth, allUsersByTeacher);
router.route("/all_users_by_teacher/:id").get(allUsersByTeacher);

//All User By Courses
router.route("/all_users_by_courses/:id").get(superAdmin, allUsersByCourses);
router
  .route("/all_users_by_courses_teacher/:id")
  .get(teacherAuth, allUsersByCourses);


 //All users by Bundle courses
 router
 .route("/all_users_by_bundlecourses/:id")
 .get(allUsersByBundleCourses);


//All user By LiveCourse
router
  .route("/all_users_by_livecourses/:id")
  .get(superAdmin, allUsersByLiveCourses);
router
  .route("/all_users_by_livecourses_teacher/:id")
  .get(teacherAuth, allUsersByLiveCourses);

// All Item Fetched
router.route("/me").get(userAuth, me);

router.route("/student_by_id/:referId").get(getStudentByReferId);

// All logout
router.route("/logout").post(userAuth, logout);

// Register User
router.route("/register_user").post(registerUser);

// Register User
router.route("/login_user").post(loginUser);

// My Order
router.route("/my_course").post(userAuth, myOrder);
router.route("/my_course_live").post(userAuth, myLiveOrder);
router.route("/my_course_bundle").post(userAuth,myBundleOrder);

//Fetch login super admin
router.route("/fetch_login_user").post(userAuth, fetchLoginSuperAdmin);

//students enrolled
router.route("/student_enroll/:id").get(superAdmin, studentsEnrolledInCourse);

router
  .route("/student_enroll_teacher/:id")
  .get(teacherAuth, studentsEnrolledInCourse);

router.route("/user_review").post(userAuth, userReviewOnChapter);

router.route("/user_course_review").post(userAuth, userCourseReview);

router
  .route("/student_enroll_teacher/:id")
  .get(teacherAuth, studentsEnrolledInCourse);

export default router;
