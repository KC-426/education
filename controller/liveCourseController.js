import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import liveCourseSchema from "../models/liveCourseSchema.js";

import UserJWTGenerator from "../utils/getJwtUser.js";

// For Error User This
// return next(new ErrorHandeler("Fill All The Required Field !", 400));

// All Courses
export const allLiveCourse = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let allCourses = await liveCourseSchema
      .find()
      .populate("faq")
      .populate("testimonials")
      .populate("category")
      .populate({ path: "courseTeacher" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Courses Fetched !!",
      courses: allCourses,
    });
  }

  let courseData = [];
  let courseTitle = await liveCourseSchema
    .find({
      title: {
        $regex: search,
        $options: "i",
      },
    })
    .populate("faq")
    .populate("testimonials")
    .populate("category")
    .populate({ path: "courseTeacher" })
    .sort({ createdAt: -1 });

  if (courseTitle.length > 0) {
    for (let course of courseTitle) {
      courseData.push(course);
    }
  }

  let num = Number(search);
  if (num) {
    let courseAmount = await liveCourseSchema
      .find({
        amount: Number(search),
      })
      .populate("faq")
      .populate("testimonials")
      .populate("category")
      .populate({ path: "courseTeacher" })
      .sort({ createdAt: -1 });

    if (courseAmount.length > 0) {
      for (let course of courseAmount) {
        courseData.push(course);
      }
    }
  }

  if (allLiveCourse.length <= 0) {
    return next(new ErrorHandeler("Courses Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    courses: courseData,
  });
});

// All Live courses without populate
export const allLiveCourseWithoutPopulate = catchAsyncError(
  async (req, res, next) => {
    const allCourses = await liveCourseSchema.find().sort({ createdAt: -1 });

    if (allCourses.length <= 0) {
      return next(new ErrorHandeler("Courses Not Found !", 500));
    }

    res.status(200).json({
      success: true,
      message: "All Courses Fetched !!",
      courses: allCourses,
    });
  }
);

export const allLiveCourseTeacher = catchAsyncError(async (req, res, next) => {
  const teacher = req.teacher;

  console.log(teacher);

  const allCourses = await liveCourseSchema
    .find({ courseTeacher: teacher._id })
    .populate("faq")
    .populate("testimonials")
    .sort({ createdAt: -1 });

  if (allCourses.length <= 0) {
    return next(new ErrorHandeler("Courses Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    courses: allCourses,
  });
});

// Delete Courses
export const deleteLiveCourse = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  const course = liveCourseSchema.findById(id);
  if (!course) {
    return next(new ErrorHandeler("Course Not Found !", 500));
  }

  await liveCourseSchema.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Course Deleted Successful !!",
  });
});

export const getCourseById = catchAsyncError(async (req, res, next) => {
  const courseId = req.params.id; // Assuming the course ID is passed as a route parameter

  // Use Mongoose's findById method to find the course by its ID

  const course = await liveCourseSchema
    .findById(courseId)
    .populate({ path: "courseTeacher" })
    .populate("faq")
    .populate("category")
    .populate("testimonials");

  // If the course with the given ID is not found, return an error
  if (!course) {
    return next(new ErrorHandeler("Course not found", 404));
  }

  // If the course is found, send it as a response
  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    course: course,
  });
});

// Create Courses
export const createLiveCourse = catchAsyncError(async (req, res, next) => {
  const { title,regularPrice, courseDateTime, meetURL, intro_video, metaTitle, metaDesc } =
    req.body;

  console.log(req.body);

  const findCouse = await liveCourseSchema.findOne({ title });

  if (findCouse) {
    return next(new ErrorHandeler("Course is Already Exiest", 500));
  }

  // console.log(topic_covered);

  const createUser = await liveCourseSchema.create({
    topics: req.body.topics,
    timing: courseDateTime,
    meet_url: meetURL,
    intro_video: intro_video,
    metaTitle: metaTitle,
    metaDescription: metaDesc,
    regularPrice: regularPrice,
    ...req.body,
  });

  res.status(200).json({
    success: true,
    message: "Course Created Successful",
    course: createUser,
  });
});

// Update Course Courses
export const updateLiveCourse = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log(data);

  let findCouse = liveCourseSchema.findById(data._id);

  if (!findCouse) {
    return next(new ErrorHandeler("Course is not Found", 500));
  }

  findCouse = data;

  console.log(findCouse);
  await liveCourseSchema.findByIdAndUpdate(data._id, findCouse);

  res.status(200).json({
    success: true,
    message: "Course Updated Successful",
  });
});
