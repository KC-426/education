import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const superAdminSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: [true, "Please Enter Your Email."],
    },

    payedAmount: {
      type: Number,
    },

    amount: {
      type: Number,
    },

    discount: {
      type: Number,
    },

    isFlatDiscount: {
      type: Boolean,
    },
    isAgent: {
      type: Boolean,
    },

    paymentType: {
      type: String,
    },

    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
    liveCourse: {
      type: mongoose.Schema.ObjectId,
      ref: "LiveCourse",
    },

    bundleCourses: { type: mongoose.Schema.ObjectId, ref: "Bundle" },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "UserSchema",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", superAdminSchema);
