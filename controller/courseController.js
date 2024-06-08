import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import CourseSchema from "../models/courseSchema.js";
import liveCourseschema from "../models/liveCourseSchema.js";
import UserJWTGenerator from "../utils/getJwtUser.js";
import courseSchema from "../models/courseSchema.js";
import teacherScehma from "../models/teacherScehma.js";
import liveCourseSchema from "../models/liveCourseSchema.js";

// For Error User This
// return next(new ErrorHandeler("Fill All The Required Field !", 400));

// All Courses
export const allCourse = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let allCourses = await CourseSchema.find()
      .populate({ path: "courseTeacher" })
      .populate("faq")
      .populate("testimonials")
      .populate("category")
      .populate("assessment")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Courses Fetched !!",
      courses: allCourses,
    });
  }

  let courseData = [];
  let courseTitle = await CourseSchema.find({
    title: {
      $regex: search,
      $options: "i",
    },
  })
    .populate({ path: "courseTeacher" })
    .populate("faq")
    .populate("testimonials")
    .populate("category")
    .populate("assessment")
    .sort({ createdAt: -1 });

  if (courseTitle.length > 0) {
    for (let course of courseTitle) {
      courseData.push(course);
    }
  }

  let num = Number(search);
  if (num) {
    let courseAmount = await CourseSchema.find({
      amount: Number(search),
    })
      .populate({ path: "courseTeacher" })
      .populate("faq")
      .populate("testimonials")
      .populate("category")
      .populate("assessment")
      .sort({ createdAt: -1 });

    if (courseAmount.length > 0) { 
      for (let course of courseAmount) {
        courseData.push(course);
      }
    }
  }

  if (allCourse.length <= 0) {
    return next(new ErrorHandeler("Courses Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    courses: courseData,
  });
});

export const allLiveCourse = catchAsyncError(async (req, res, next) => {
  const { searchLive = "" } = req.query;
  console.log(req.query);

  if (searchLive == "") {
    let allTeachers = await teacherScehma.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All teachers Fetched !!",
      teachers: allTeachers,
    });
  }

let liveCoursesData = []

let liveCourseName = await liveCourseSchema
.find()
.populate("faq")
.populate("testimonials")
.populate("category")
.populate({ path: "courseTeacher" })
.sort({ createdAt: -1 });

// console.log(liveCourseName)

const liveCourse = liveCourseName.filter((ele) => {
  if (ele?.title?.toLowerCase().includes(searchLive?.toLowerCase())) {
    return ele;
  }
})

let teachers = [];

// if (liveCourse.length > 0) {
//   for (let course of liveCourse) {
//     liveCoursesData.push(course);
//   }
// }

// console.log('new data ',liveCourse[0].courseTeacher)

liveCourse.forEach((ele) => {
  // console.log(ele.courseTeacher)
  ele.courseTeacher.forEach((teacher) => {
    teachers.push(teacher)
  })
})

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    teachers: teachers,
  });
});

export const allRecCourse = catchAsyncError(async (req, res, next) => {
  const { searchRec = "" } = req.query;
  console.log(req.query);

  if (searchRec == "") {
    let allTeachers = await teacherScehma.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All teachers Fetched !!",
      teachers: allTeachers,
    });
  }

let recCourseName = await CourseSchema.find()
.populate({ path: "courseTeacher" })
.populate("faq")
.populate("testimonials")
.populate("category")
.sort({ createdAt: -1 });

const recCourse = recCourseName.filter((ele) => {
  if (ele?.title?.toLowerCase().includes(searchRec?.toLowerCase())) {
    return ele;
  }
})

let teachers = [];

recCourse.forEach((ele) => {
  // console.log(ele.courseTeacher)
  ele.courseTeacher.forEach((teacher) => {
    teachers.push(teacher)
  })
})

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    teachers: teachers,
  });
});



// All Courses without populate
export const allCoursesWithoutPopulate = catchAsyncError(
  async (req, res, next) => {
    const allCourses = await CourseSchema.find().sort({ createdAt: -1 });

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

// All Courses
export const allCourseTeacher = catchAsyncError(async (req, res, next) => {
  const teacher = req.teacher;

  console.log(teacher);

  const allCourses = await CourseSchema.find({ courseTeacher: teacher._id })
    .populate({ path: "courseTeacher" })
    .populate("category")
    .populate("faq")
    .populate("testimonials")
    .sort({ createdAt: -1 });

  console.log("allCourses", allCourses);

  if (allCourses.length <= 0) {
    return next(new ErrorHandeler("Courses Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    courses: allCourses,
  });
});

//All live courses
export const allCourseTeacherById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // console.log(teacher);
  const allCourses = await courseSchema
    .find({ courseTeacher: id })
    .populate({ path: "courseTeacher" })
    .populate("category")
    .populate("faq")
    .populate("testimonials")
    .sort({ createdAt: -1 });

  console.log("allCourses", id);

  if (allCourses.length <= 0) {
    return next(new ErrorHandeler("Courses Not Found !", 404));
  }

  res.status(200).json({
    success: true,
    message: "All Courses Fetched !!",
    courses: allCourses,
  });
});

export const allLiveCourseTeacherById = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    // console.log(teacher);
    const allCourses = await liveCourseschema
      .find({ courseTeacher: id })
      .populate({ path: "courseTeacher" })
      .populate("category")
      .populate("faq")
      .populate("testimonials")
      .sort({ createdAt: -1 });

    console.log("allCourses", id);

    if (allCourses.length <= 0) {
      return next(new ErrorHandeler("Courses Not Found !", 404));
    }
    console.log(allCourses);

    res.status(200).json({
      success: true,
      message: "All Courses Fetched !!",
      courses: allCourses,
    });
  }
);

// Delete Courses
export const deleteCourse = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  const course = CourseSchema.findById(id);
  if (!course) {
    return next(new ErrorHandeler("Course Not Found !", 500));
  }

  await CourseSchema.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Course Deleted Successful !!",
  });
});

export const getCourseById = catchAsyncError(async (req, res, next) => {
  const courseId = req.params.id; // Assuming the course ID is passed as a route parameter

  // Use Mongoose's findById method to find the course by its ID
  const course = await CourseSchema.findById(courseId)
    .populate({ path: "courseTeacher" })
    .populate("category")
    .populate("faq")
    .populate("testimonials");

  // If the course with the given ID is not found, return an error
  if (!course) {
    return next(new ErrorHandeler("Course not found", 404));
  }

  console.log("Course => ", course.category);

  // If the course is found, send it as a response
  res.status(200).json({
    success: true,
    message: "Courses Fetched !!",
    course: course,
  });
});

// Create Courses
export const createCourse = catchAsyncError(async (req, res, next) => {
  const {
    intro_video,
    title,
    metaTitle,
    metaDesc,
    price,
    regularPrice,
    description,
    activeCourse,
    category,
    assessment, 
    imageFile,
    courseTeacher,
    brochure,    
    faq,
    testimonials,
    topicCovered,
    courseData,
    fileupload,
    inc_number,
    courseOverView,
  } = req.body;

  if (!title || !price || !category) {
    return next(new ErrorHandeler("Please Fill the all Required Fields", 500));
  }

  const findCouse = await CourseSchema.findOne({ title })
    .populate({ path: "courseTeacher" })
    .populate("category")
    .populate("faq")
    .populate("testimonials")
    .populate("assessement");

  if (findCouse) {
    return next(new ErrorHandeler("Course is Already Exiest", 500));
  }

  // console.log("fileUpload => ", fileupload);
  console.log( 'testing !!!!!!',  assessment,   testimonials);

  const createUser = await CourseSchema.create({
    intro_video: intro_video,
    title: title,
    metaTitle: metaTitle,
    metaDescription: metaDesc,
    description: description,
    thumb_img: imageFile,
    brochure: brochure,
    category: category,
    assessment: assessment,
    amount: price,
    regularPrice: regularPrice,
    blog_active: activeCourse,
    courseTeacher,
    faq,
    testimonials,
    topic_covered: topicCovered,
    topics: courseData,
    certification: fileupload,
    inc_number,
    course_overview: courseOverView,
  });


  res.status(200).json({
    success: true,
    message: "Course Created Successful",
    course: createUser,
  });
});

// Update Course Courses
export const updateCourse = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log("data => Updated", data);

  let findCouse = CourseSchema.findById(data._id);

  if (!findCouse) {
    return next(new ErrorHandeler("Course is not Found", 500));
  }

  findCouse = data;

  console.log(findCouse);
  await CourseSchema.findByIdAndUpdate(data._id, findCouse);

  res.status(200).json({
    success: true,
    message: "Course Updated Successful",
  });
});
