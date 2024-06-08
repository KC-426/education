import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name Cannot Exceed 30 Character"],
      minLength: [3, "Name Cannot Less Then 3 Character"],
    },

    refer_id: {
      type: String,
    },

    wallet: {
      type: Number,
      default: 0,
    },

    email: {
      type: String,
      required: [true, "Please Enter Your Email."],
    },

    phoneNumber: {
      type: Number,
    },
    thumb_img: {
      name: {
        type: String,
      },
      url: {
        type: String,
      },
      path: {
        type: String,
      },
    },

    courses: [
      {
        course_id: { type: mongoose.Schema.ObjectId, ref: "Course" },
        isDone: [
          {
            chapter: {
              type: Number,
            },
            done: {
              type: Boolean,
              default: false,
            },
          },
        ],

        rating: [
          {
            chapter: {
              type: Number,
            },
            rate: {
              type: Number,
            }
          },
        ],
      },
    ],

    liveCourses: [
      {
        course_id: { type: mongoose.Schema.ObjectId, ref: "LiveCourse" },
      },
    ],

    bundleCourses: [
      {
        bundle_id: { type: mongoose.Schema.ObjectId,  ref: "Bundle" },
      },
    ],

    password: {
      type: String,
      required: [true, "Please Enter Password"],
      minLength: [8, "Password Cannot less Then 8 Character"],
      select: false,
    },
  },
  { timestamps: true }
);

// Password not change when we modify a data
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Createing JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_USER_SECRET, {
    expiresIn: process.env.JWT_USER_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("UserSchema", userSchema);
