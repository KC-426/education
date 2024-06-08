import express from "express";
import { superAdmin, userAuth } from "../middleWare/auth.js";
import {
  allUsers,
  loginUser,
  registerUser,
} from "../controller/userController.js";
import {
  allPayments,
  liveCoursePaymentDone,
  paymentDone,
  paymentOrder,
  paymentOrderLive,
  paymetnsByStudentId,
  paymentOrderBundle,
  bundleCoursePaymentDone,
} from "../controller/paymentController.js";
const router = express.Router();

// Payment Done
router.route("/all_payments").get(superAdmin, allPayments);

// create Payment
router.route("/create_payment_order").post(userAuth, paymentOrder);
router
  .route("/create_payment_order_livecourse")
  .post(userAuth, paymentOrderLive);

// Payment Done
router.route("/payment_done").post(paymentDone);
router.route("/payment_done_livecourses").post(liveCoursePaymentDone);

// Payment by user ID
router.route("/payment_by_userid/:id").get(userAuth, paymetnsByStudentId);

// Routes for payment create and done of course bundle
router.route("/bundle_order_create").post(userAuth, paymentOrderBundle);
router.route("/payment_done_bundle").post(bundleCoursePaymentDone);

export default router;
