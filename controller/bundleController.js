import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import bundleSchema from "../models/bundleSchema.js";

import UserJWTGenerator from "../utils/getJwtUser.js";

// For Error User This
// return next(new ErrorHandeler("Fill All The Required Field !", 400));

// All Courses
export const allBundles = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let allBundles = await bundleSchema
      .find()
      .populate("courses")
      .populate("liveCourses")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All Course Bundles Fetched !!",
      bundles: allBundles,
    });
  }

  let bundleData = [];
  let bundleTitle = await bundleSchema
    .find({
      title: {
        $regex: search,
        $options: "i",
      },
    })
    .populate("courses")
    .populate("liveCourses")
    .sort({ createdAt: -1 });

  if (bundleTitle.length > 0) {
    for (let bundle of bundleTitle) {
      bundleData.push(bundle);
    }
  }

  let num = Number(search);
  if (num) {
    let bundlePrice = await bundleSchema
      .find({
        price: Number(search),
      })
      .populate("courses")
      .populate("liveCourses")
      .sort({ createdAt: -1 });

    if (bundlePrice.length > 0) {
      for (let bundle of bundlePrice) {
        bundleData.push(bundle);
      }
    }
  }

  if (allBundles.length <= 0) {
    return next(new ErrorHandeler("Course Bundles Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Course Bundles Fetched !!",
    bundles: bundleData,
  });
});

// Delete Bundles Courses
export const deleteBundle = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  const bundle = bundleSchema.findById(id);
  if (!bundle) {
    return next(new ErrorHandeler("Course Bundle Not Found !", 500));
  }

  await bundleSchema.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Course Bundle Deleted Successful !!",
  });
});

export const getBundleById = catchAsyncError(async (req, res, next) => {
  const bundleId = req.params.id; // Assuming the course ID is passed as a route parameter

  // Use Mongoose's findById method to find the course by its ID

  const bundle = await bundleSchema.findById(bundleId).populate("courses");

  // If the course with the given ID is not found, return an error
  if (!bundle) {
    return next(new ErrorHandeler("Course Bundle not found", 404));
  }

  // If the course is found, send it as a response
  res.status(200).json({
    success: true,
    message: "All Course Bundles Fetched !!",
    bundle: bundle,
  });
});

// Create Courses
export const createCourseBundle = catchAsyncError(async (req, res, next) => {
  const { title, intro_video, imageFile, description, metaTitle, metaDesc,discount } = req.body;

  console.log( 'data', req.body);

  const findBundle = await bundleSchema.findOne({ title });

  if (findBundle) {
    return next(new ErrorHandeler("Course Bundle is Already Exiest", 500));
  }

  // console.log(topic_covered);

  const createUser = await bundleSchema.create({
    ...req.body,
    image: imageFile,
    intro_video: intro_video,
    metaTitle: metaTitle,
    metaDescription: metaDesc,
    description: description,

    discount: discount,

  });

  res.status(200).json({
    success: true,
    message: "Course Bundle Created Successful",
    bundle: createUser,
  });
});

// Update Course Courses
export const updateCourseBundle = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log(data);

  let findBundle = bundleSchema.findById(data._id);

  if (!findBundle) {
    return next(new ErrorHandeler("Course Bundle is not Found", 500));
  }

  findBundle = data;

  await bundleSchema.findByIdAndUpdate(data._id, findBundle);

  res.status(200).json({
    success: true,
    message: "Course Bundle Updated Successful",
    findBundle: findBundle,
  });
});
