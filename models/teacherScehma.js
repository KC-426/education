import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    experience: {
      type: Number, 
      required: true,
    },
    qualification: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
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
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});



// Createing JWT Token
teacherSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_TEACHER_SECRET, {
    expiresIn: process.env.JWT_TEACHER_EXPIRE,
  });
};

// Compare Password
teacherSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Teacher", teacherSchema);
