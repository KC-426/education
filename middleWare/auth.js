import catchAsyncError from "../utils/catchAsyncError.js";
import jwt from "jsonwebtoken";
import ErrorHandeler from "../utils/errorHandeler.js";
import SuperAdminSchema from "../models/superAdminSchema.js";
import UserSchema from "../models/userSchema.js";
import TeacherSchema from "../models/teacherScehma.js";



export const superAdmin = catchAsyncError(async (req, res, next) => {
    let user;
    const { jwt_su_adm_token } = await req.cookies;
  
    if (!jwt_su_adm_token) {
      return next(new ErrorHandeler("Please Login !!", 400));
    }
  
    const decodedData = jwt.verify(
      jwt_su_adm_token,
      process.env.JWT_ADMIN_SECRET
    );
  
    user = await SuperAdminSchema.findById(decodedData.id);
    if (!user) {
      return next(new ErrorHandeler("Invalid JWT", 400));
    }
  
    req.user = user;
  
    next();
  });

export const userAuth = catchAsyncError(async (req, res, next) => {
    let user;
    const { JWT_USER_token } = await req.cookies;
  
    if (!JWT_USER_token) {
      return next(new ErrorHandeler("Please Login !!", 400));
    }
  
    const decodedData = jwt.verify(
      JWT_USER_token,
      process.env.JWT_USER_SECRET
    );
    console.log(decodedData);
  
    user = await UserSchema.findById(decodedData.id);

    if (!user) {
      console.log("jwt error");
      return next(new ErrorHandeler("Invalid JWT", 400));
    }
  
    req.student = user;
  
    next();
  });

export const teacherAuth = catchAsyncError(async (req, res, next) => {
    let user;
    const { JWT_TEACHER_token } = await req.cookies;
  
    if (!JWT_TEACHER_token) {
      return next(new ErrorHandeler("Please Login !!", 400));
    }
  
    const decodedData = jwt.verify(
      JWT_TEACHER_token,
      process.env.JWT_TEACHER_SECRET
    );
    // console.log(JWT_TEACHER_token, decodedData);
  
    user = await TeacherSchema.findById(decodedData.id);

    if (!user) {
      return next(new ErrorHandeler("Invalid JWT", 400));
    }
  
    req.teacher = user;
  
    next();
  });