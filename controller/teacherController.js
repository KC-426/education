import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import teacherScehma from "../models/teacherScehma.js";

import UserJWTGenerator from "../utils/getJwtUser.js";
import TeacherJWTGenerator from "../utils/getJwtTeacher.js";

// For Error User This
// return next(new ErrorHandeler("Fill All The Required Field !", 400));

// All Teachers
export const allTeachers = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let allTeachers = await teacherScehma.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All Teachers Fetched !!",
      teachers: allTeachers,
    });
  }

  let teacherData = [];

  let allTeacherName = await teacherScehma
    .find({
      name: {
        $regex: search,
        $options: "i",
      },
    })
    .sort({ createdAt: -1 });

  if (allTeacherName.length > 0) {
    for (let teacher of allTeacherName) {
      teacherData.push(teacher);
    }
  }

  let allTeacherEmail = await teacherScehma
    .find({
      email: {
        $regex: search,
        $options: "i",
      },
    })
    .sort({ createdAt: -1 });

  if (allTeacherEmail.length > 0) {
    for (let teacher of allTeacherEmail) {
      teacherData.push(teacher);
    }
  }

  let num = Number(search);

  if (num) {
    let allTeacherPhone = await teacherScehma
      .find({
        phone: Number(search),
      })
      .sort({ createdAt: -1 });

    if (allTeacherPhone.length > 0) {
      for (let teacher of allTeacherPhone) {
        teacherData.push(teacher);
      }
    }
  }

  if (allTeachers.length <= 0) {
    return next(new ErrorHandeler("Teachers Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Teachers Fetched !!",
    teachers: teacherData,
  });
});

// Delete Courses
export const deleteTeacher = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  const teacher = teacherScehma.findById(id);
  if (!teacher) {
    return next(new ErrorHandeler("Teacher Not Found !", 500));
  }

  await teacherScehma.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Teacher Deleted Successful !!",
  });
});

export const getTeacherById = catchAsyncError(async (req, res, next) => {
  const teacherId = req.params.id; // Assuming the course ID is passed as a route parameter

  // Use Mongoose's findById method to find the course by its ID
  const teacher = await teacherScehma.findById(teacherId);

  // If the course with the given ID is not found, return an error
  if (!teacher) {
    return next(new ErrorHandeler("Teacher not found", 404));
  }

  // If the course is found, send it as a response
  res.status(200).json({
    success: true,
    message: "All Teachers Fetched !!",
    teacher: teacher,
  });
});

// Create Courses
export const createTeacher = catchAsyncError(async (req, res, next) => {
  const { name, password, CPassword, metaTitle, metaDesc } = req.body;
  console.log(req.body);

  const findCouse = await teacherScehma.findOne({ name });

  if (password !== CPassword) {
    return next(new ErrorHandeler("Password and Confirm is not Match !", 500));
  }

  if (findCouse) {
    return next(new ErrorHandeler("Teacher is Already Exiest", 500));
  }

  // console.log(topic_covered);

  const createUser = await teacherScehma.create({
    ...req.body,
    metaTitle: metaTitle,
    metaDescription: metaDesc,
  });

  res.status(200).json({
    success: true,
    message: "Teacher Created Successful",
    teacher: createUser,
  });
});

// Update Course Courses
export const updateTeacher = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log(data);

  let findTeacher = await teacherScehma.findById(data._id);

  if (!findTeacher) {
    return next(new ErrorHandeler("Teacher is not Found", 500));
  }

  findTeacher = data;

  //console.log(findCouse);
  await teacherScehma.findByIdAndUpdate(data._id, findTeacher);

  res.status(200).json({
    success: true,
    message: "Teacher Updated Successful",
  });
});

// Login Teacher
export const loginTeacher = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password) {
    return next(new ErrorHandeler("Please Fill All The Required Fields", 500));
  }

  let findTeacher = await teacherScehma
    .findOne({ email: email })
    .select("+password");

  if (!findTeacher) {
    return next(new ErrorHandeler("Teacher not Found.", 400));
  }

  console.log("findTeacher => ", findTeacher);

  const isMatchPassword = await findTeacher.comparePassword(password);

  console.log("isMatchPassword => ", isMatchPassword);

  if (!isMatchPassword) {
    return next(new ErrorHandeler("Email or Password is Not Match.", 400));
  }

  findTeacher.password = null;

  TeacherJWTGenerator(findTeacher, 200, res);
});

export const fetchLoginTeacherAdmin = catchAsyncError(
  async (req, res, next) => {
    const user = req.teacher;
    const admin = user;

    res.status(200).json({
      success: true,
      teacher: admin,
    });
  }
);

export const logOurTeacherAdmin = catchAsyncError(async (req, res, next) => {
  const option = {
    maxAge: 0,
    sameSite: "none",
    secure: true,
    crossDomain: true,
  };

  res.cookie("JWT_TEACHER_token", null, option);
  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
});
