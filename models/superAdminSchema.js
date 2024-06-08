import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const superAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot Exceed 30 Character"],
    minLength: [3, "Name Cannot Less Then 3 Character"],
  },

  email: {
    type: String,
    required: [true, "Please Enter Your Email."],
  },

  phoneNumber: {
    type: Number,
  },

  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [8, "Password Cannot less Then 8 Character"],
    select: false,
  },
}, {timestamps: true});

// Password not change when we modify a data
superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Createing JWT Token
superAdminSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: process.env.JWT_ADMIN_EXPIRE,
  });
};

// Compare Password
superAdminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Super-Admin", superAdminSchema);