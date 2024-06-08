import CourseSchema from "../models/courseSchema.js";
import TeacherScehma from "../models/teacherScehma.js";
import userSchema from "../models/userSchema.js";
import UserSchema from "../models/userSchema.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import ShortUniqueId from "short-unique-id";

import UserJWTGenerator from "../utils/getJwtUser.js";
import courseSchema from "../models/courseSchema.js";

// For Error User This
// return next(new ErrorHandeler("Fill All The Required Field !", 400));

// All User
export const allUsers = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let userSchema = await UserSchema.find()
      .populate({ path: "courses", populate: { path: "course_id" } })
      .populate({ path: "liveCourses", populate: { path: "course_id" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Users Fetched !!",
      users: userSchema,
    });
  }

  let alluser = [];

  let userSchema = await UserSchema.find({
    name: {
      $regex: search,
      $options: "i",
    },
  })
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  if (userSchema.length > 0) {
    for (let user of userSchema) {
      alluser.push(user);
    }
  }

  let userSchemaemail = await UserSchema.find({
    email: {
      $regex: search,
      $options: "i",
    },
  })
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  if (userSchemaemail.length > 0) {
    for (let user of userSchemaemail) {
      alluser.push(user);
    }
  }

  let num = Number(search);

  console.log(typeof num, num);

  if (num) {
    let userSchemaPhone = await UserSchema.find({
      phoneNumber: Number(search),
    })
      .populate({ path: "courses", populate: { path: "course_id" } })
      .populate({ path: "liveCourses", populate: { path: "course_id" } })
      .sort({ createdAt: -1 });

    if (userSchemaPhone.length > 0) {
      for (let user of userSchemaPhone) {
        alluser.push(user);
      }
    }

    if (alluser.length <= 0) {
      return next(new ErrorHandeler("User Not Found !", 500));
    }
  }

  //search by live course
  // const { searchLive = "" } = req.query;

  // if (searchLive == "") {
  //   let userSchema = await UserSchema.find()
  //   .populate({ path: "courses", populate: { path: "course_id" } })
  //   .populate({ path: "liveCourses", populate: { path: "course_id" } })
  //   .sort({ createdAt: -1 });

  // return res.status(200).json({
  //   success: true,
  //   message: "All Users Fetched !!",
  //   users: userSchema,
  // });
  // }

  // let userLiveData = []

  let userLiveCourseName = await UserSchema.find()
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  console.log(userLiveCourseName);

  const userLiveCourse = userLiveCourseName.filter((ele) => {
    if (ele?.liveCourses?.course_id?.title == search) {
      return ele;
    }
  });

  if (userLiveCourse.length > 0) {
    for (let user of userLiveCourse) {
      alluser.push(user);
    }
  }

  res.status(200).json({
    success: true,
    message: "All Users Fetched !!",
    users: alluser,
  });
});

export const allLiveUsers = catchAsyncError(async (req, res, next) => {
  const { searchLive = "" } = req.query;
  console.log(req.query);

  if (searchLive == "") {
    let userSchema = await UserSchema.find()
      .populate({ path: "courses", populate: { path: "course_id" } })
      .populate({ path: "liveCourses", populate: { path: "course_id" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Users Fetched !!",
      users: userSchema,
    });
  }

  let userLiveData = [];

  let userLiveCourseName = await UserSchema.find()
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  console.log(userLiveCourseName);

  const userLiveCourse = userLiveCourseName.filter((ele) => {
    if (
      ele?.liveCourses[0]?.course_id?.title
        ?.toLowerCase()
        .includes(searchLive?.toLowerCase())
    ) {
      return ele;
    }
  });

  if (userLiveCourse.length > 0) {
    for (let user of userLiveCourse) {
      userLiveData.push(user);
    }
  }

  res.status(200).json({
    success: true,
    message: "All Users Fetched !!",
    users: userLiveData,
  });
});

export const allRecUsers = catchAsyncError(async (req, res, next) => {
  const { searchRec = "" } = req.query;
  console.log(req.query);

  if (searchRec == "") {
    let userSchema = await UserSchema.find()
      .populate({ path: "courses", populate: { path: "course_id" } })
      .populate({ path: "liveCourses", populate: { path: "course_id" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Users Fetched !!",
      users: userSchema,
    });
  }

  let userRecData = [];

  let userRecCourseName = await UserSchema.find()
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  console.log(userRecCourseName);

  const userRecCourse = userRecCourseName.filter((ele) => {
    if (
      ele?.courses[0]?.course_id?.title
        ?.toLowerCase()
        .includes(searchRec?.toLowerCase())
    ) {
      return ele;
    }
  });

  if (userRecCourse.length > 0) {
    for (let user of userRecCourse) {
      userRecData.push(user);
    }
  }

  res.status(200).json({
    success: true,
    message: "All Users Fetched !!",
    users: userRecData,
  });
});

// All User by teacher
// export const allUsersByTeacher = catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;

//   // console.log(id);

//   const teacher = await TeacherScehma.findById(id);

//   if (!teacher) {
//     return next(new ErrorHandeler("Teacher Not Found !", 500));
//   }

//   const allCourses = await CourseSchema.find({
//     courseTeacher: teacher._id,
//   }).populate({ path: "courseTeacher" });

//   const userSchema = await UserSchema.find()
//     .populate({ path: "courses", populate: { path: "course_id" } })
//     .sort({ createdAt: -1 });

//   // console.log(allCourses);

//   let allUsers = [];

//   for (let i = 0; i < userSchema.length; i++) {
//     console.log("userSchema[i]?.courses", userSchema[i].courses);
//     for (let j = 0; j < allCourses.length; j++) {
//       // console.log(allCourses[j]);
//     }
//   }

//   res.status(200).json({
//     success: true,
//     message: "All Users Fetched !!",
//     users: userSchema,
//   });
// });

export const allUsersByTeacher = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // console.log(id);

  const teacher = await TeacherScehma.findById(id);

  if (!teacher) {
    return next(new ErrorHandeler("Teacher Not Found !", 500));
  }

  // const allCourses = await CourseSchema.find({
  //   courseTeacher: teacher._id,
  // }).populate({ path: "courseTeacher" });

  const userSchema = await UserSchema.find()
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  let allUsers = [];

  for (let stu of userSchema) {
    for (let course of stu.courses) {
      for (let tid of course.course_id.courseTeacher) {
        if (JSON.stringify(tid) === JSON.stringify(id)) {
          allUsers.push(stu);
        }
      }
    }
  }

  let liveUser = [];

  for (let stu1 of userSchema) {
    for (let course of stu1.liveCourses) {
      console.log(course);
    }
  }
  // console.log(liveUser);
  let uniqueUser = [];
  allUsers.forEach((user) => {
    if (!uniqueUser.includes(user)) {
      uniqueUser.push(user);
    }
  });

  res.status(200).json({
    success: true,
    message: "All Users Fetched !!",
    users: uniqueUser,
  });
});

//ALL users by courses
export const allUsersByCourses = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const userSchema = await UserSchema.find()
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  let allusercourse = [];

  for (let student of userSchema) {
    for (let course of student.courses) {
      console.log(JSON.stringify(course.course_id._id), JSON.stringify(id));
      if (JSON.stringify(course.course_id._id) === JSON.stringify(id)) {
        allusercourse.push(student);
      }
    }
  }
  // let uniqueUser = [];
  // allusercourse.forEach(user => {
  //   if (!uniqueUser.includes(user)) {
  //     uniqueUser.push(user)
  //   }
  // })

  res.status(200).json({
    success: true,
    message: "All Users_BY_Idcourse Fetched !!",
    user: allusercourse,
  });
});

//ALL users by Bundle_courses
export const allUsersByBundleCourses = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const userSchema = await UserSchema.find()
      .populate({ path: "bundleCourses", populate: { path: "bundle_id" } })
      .sort({ createdAt: -1 });

    let allusercourse = [];
    console.log(userSchema);
    for (let student of userSchema) {
      for (let course of student.bundleCourses) {
        console.log(JSON.stringify(course._id), JSON.stringify(id));
        // if (JSON.stringify(course.bundle_id._id) === JSON.stringify(id)) {
        //   allusercourse.push(student);
        // }
      }
    }
    // let uniqueUser = [];
    // allusercourse.forEach(user => {
    //   if (!uniqueUser.includes(user)) {
    //     uniqueUser.push(user)
    //   }
    // })

    res.status(200).json({
      success: true,
      message: "All Users_BY_Idcourse Fetched !!",
      user: allusercourse,
    });
  }
);

//ALL users by Livecourses
export const allUsersByLiveCourses = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const userSchema = await UserSchema.find()
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .sort({ createdAt: -1 });

  let allusercourse = [];

  for (let student of userSchema) {
    for (let liv of student?.liveCourses)
      if (JSON.stringify(liv?.course_id?._id) === JSON.stringify(id)) {
        allusercourse.push(student);
      }
  }

  // let uniqueUser = [];
  // allusercourse.forEach(user => {
  //   if (!uniqueUser.includes(user)) {
  //     uniqueUser.push(user)
  //   }
  // })

  res.status(200).json({
    success: true,
    message: "All Users_BY_Id Livecourse Fetched !!",
    user: allusercourse,
  });
});

// All User
export const me = catchAsyncError(async (req, res, next) => {
  const user = req.student;

  const userfind = await UserSchema.findById(user._id)
    .populate({ path: "courses", populate: { path: "course_id" } })
    .populate({ path: "liveCourses", populate: { path: "course_id" } })
    .populate({ path: "bundleCourses", populate: { path: "bundle_id" } })
    .sort({ createdAt: -1 });

  if (!user) {
    return next(new ErrorHandeler("User Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Users Fetched !!",
    user: userfind,
  });
});

export const getStudentByReferId = catchAsyncError(async (req, res, next) => {
  const { referId } = req.params;

  if (!referId) {
    return next(new ErrorHandeler("Invalid refer id !", 400));
  }

  const fetchStudent = await userSchema
    .findOne({ refer_id: referId })
    .populate([
      // "saledCourse.RCourseId",
      "liveCourses.course_id",
      "courses.course_id",
    ])
    .sort({ createdAt: -1 });

  if (!fetchStudent) {
    return next(new ErrorHandeler(" Invalid refer id !", 404));
  }
  // console.log(allCategory.saledCourse);
  res.status(200).json({
    success: true,
    message: "User Fetched !!",
    student: fetchStudent,
  });
});

// All User
export const logout = catchAsyncError(async (req, res, next) => {
  const option = {
    maxAge: 0,
    sameSite: "none",
    secure: true,
    crossDomain: true,
  };

  res.cookie("JWT_USER_token", "", option);
  res.status(200).json({
    success: true,
    message: "logout successful !!",
  });
});

// Register User
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password, confPassword } = req.body;

  if (!name || !email || !phone || !password || !confPassword) {
    return next(new ErrorHandeler("Please Fill the all Required Fields", 500));
  }

  if (password !== confPassword) {
    return next(new ErrorHandeler("Password not Match", 500));
  }

  const uid = new ShortUniqueId({ length: 10 });

  const unId = uid.rnd();

  const user = await UserSchema.findOne({ email: email });

  if (user) {
    return next(new ErrorHandeler("User Already Exist", 500));
  }

  const createUser = await UserSchema.create({
    name,
    email,
    refer_id: `STUD_${unId}`.toUpperCase(),
    phoneNumber: phone,
    password: password,
  });

  res.status(200).json({
    success: true,
    message: "Register Successful !!",
    user: createUser,
  });
});

// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password) {
    return next(new ErrorHandeler("Please Fill All The Required Fields.", 400));
  }
  const user = await UserSchema.findOne({ email })
    .populate({ path: "courses", populate: { path: "course_id" } })
    .select("+password");

  if (!user) {
    return next(new ErrorHandeler("User not Found.", 400));
  }

  const isMatchPassword = await user.comparePassword(password);

  if (!isMatchPassword) {
    return next(new ErrorHandeler("Email or Password is Not Match.", 400));
  }

  user.password = null;

  UserJWTGenerator(user, 200, res);
});

export const myOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  console.log("Start");

  if (!id) {
    return next(new ErrorHandeler("Id not Found.", 400));
  }

  const user = await UserSchema.findById(id).populate({
    path: "courses",
    populate: { path: "course_id" },
  });

  console.log(user);

  res.status(200).json({
    success: true,
    message: "Register Successful !!",
    course: user.courses,
  });
});

export const myLiveOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  console.log("Start");

  if (!id) {
    return next(new ErrorHandeler("Id not Found.", 400));
  }

  const user = await UserSchema.findById(id)
    .populate({
      path: "courses",
      populate: { path: "course_id" },
    })
    .populate({ path: "liveCourses", populate: { path: "course_id" } });

  console.log(user);

  res.status(200).json({
    success: true,
    message: "Register Successful !!",
    course: user.liveCourses,
  });
});

export const myBundleOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  console.log("Start");

  if (!id) {
    return next(new ErrorHandeler("Id not Found.", 400));
  }

  const user = await UserSchema.findById(id).populate({
    path: "bundleCourses",
    populate: { path: "bundle_id" },
  });

  console.log(user);

  res.status(200).json({
    success: true,
    message: "Register Successful !!",
    course: user.bundleCourses,
  });
});

export const studentsEnrolledInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseSchema.findById(id);
    const allUsers = await UserSchema.find().populate({
      path: "courses",
      populate: { path: "course_id" },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found !!" });
    }

    let users = [];
    allUsers.forEach((userData) => {
      userData.courses.forEach((courseId) => {
        console.log(courseId._id.toString(), "maindata", id.toString());
        if (courseId._id.toString() == id.toString()) {
          users.push(userData);
        }
      });
    });

    console.log(users, "maindata");

    res.json({
      success: true,
      users: users,
      message: "Student enrolled successfully !!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchLoginSuperAdmin = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const admin = user;

  res.status(200).json({
    success: true,
    user: admin,
  });
});

export const userReviewOnChapter = async (req, res) => {
  try {
    const { rating, id, chapter } = req.body;
    const user = req.student;

    // const submitReview = await userSchema.create({
    //   rating: rating,
    //   isDone: true,
    // });

    const userDb = await userSchema.findById(user._id);

    console.log(userDb.courses, id);

    userDb.courses.forEach((ele) => {
      if (JSON.stringify(ele.course_id) == JSON.stringify(id)) {
        ele.rating = [...ele.rating, { chapter: chapter, rate: rating }];
        ele.isDone = [
          ...ele.isDone,
          {
            chapter: chapter,
            done: true,
          },
        ];
      }
    });

    await userDb.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully!!",
      // submitReview: submitReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const userCourseReview = async (req, res) => {
//   try {
//     const { message, id } = req.body;
//     const user = req.student;

//     // console.log(message, id, user);

//     let userDb = await courseSchema.findById(id);

//     if (!userDb) {
//       return next(new ErrorHandeler("course not Found.", 400));
//     }
//     console.log(userDb.courseReview);

//     userDb.courseReview.push({
//       userId: user._id,
//       message: message,
//     });

//     await userDb.save();

//     let findUser = await userSchema.findById(user._id);

//     if (findUser && findUser.courseReview && Array.isArray(findUser.courseReview)) {
//       findUser.courseReview.forEach((ele) => {
//         if (JSON.stringify(ele.course_id) === JSON.stringify(id)) {
//           ele.message = ele.message || []; 
//           ele.message.push({ message: message });
//         }
//       });
//     } else {
//       console.error('error');
//     }
    

//     await findUser.save();

  

//     res.status(200).json({
//       success: true,
//       message: "Course Review submitted successfully!!",
//       // review: userDb
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


export const userCourseReview = async (req, res, next) => {
  try {
    const { message, id } = req.body;
    const user = req.student;

    let course = await courseSchema.findById(id);

    if (!course) {
      return next(new ErrorHandeler("Course not found.", 400));
    }

    const existingReview = course.courseReview.find(
      (review) => JSON.stringify(review.userId) === JSON.stringify(user._id)
    );

    if (existingReview) {
      existingReview.message = message;
    } else {
      course.courseReview.push({
        userId: user._id,
        message: message,
      });
    }

    await course.save();

    let userDb = await userSchema.findById(user._id);

    if (userDb && userDb.courseReview && Array.isArray(userDb.courseReview)) {
      userDb.courseReview.forEach((ele) => {
        if (JSON.stringify(ele.course_id) === JSON.stringify(id)) {
          ele.message = ele.message || []; 
          const existingMessage = ele.message.find(
            (msg) => JSON.stringify(msg.userId) === JSON.stringify(user._id)
          );
    
          if (existingMessage) {
            existingMessage.message = message;
          } else {
            ele.message.push({ userId: user._id, message: message });
          }
        }
      });
    } else {
      console.error('error');
    }
    
    await userDb.save();

    res.status(200).json({
      success: true,
      message: "Course review submitted successfully!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
