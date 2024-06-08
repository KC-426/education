import testimonialSchema from "../models/testimonialSchema.js"
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";

export const createTestimonial = async(req, res, next) => {
    try{
        const {title, description, courseName, rating, userId, LCourseId, RCourseId } = req.body
        console.log(req.body) 

        if (!title || !description) {
            return res.status(500).json({message: "Please fill the required fields !!"})
          }
        const create = new testimonialSchema({
            title: title,
            description: description,
            courseName: courseName, 
            rating: rating,
            user_detail: userId,
            LCourseId: LCourseId,
            RCourseId: RCourseId
        })
        const result = await create.save()
        console.log(result)
        res.status(201).json({success: true, message: "Testmonial added !!", result: result})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    } 
}

export const getTestimonial = catchAsyncError(async (req, res, next) => {
const {search = "" } = req.query

if(search == "") {
  let allTestimonial = await testimonialSchema.find()
  .populate(["user_detail","LCourseId", "RCourseId"])
  
  return  res.status(200).json({
    success: true,
    message: "All Testimonial Fetched !!",
    testimonial: allTestimonial,
  })
}

let testimonialData = []
let testimonialTitle = await testimonialSchema.find({
  title: {
    $regex: search,
    $options: "i",
  },
})
.populate(["user_detail","LCourseId", "RCourseId"])

if(testimonialTitle.length > 0){
  for (let testimonial of testimonialTitle) {
    testimonialData.push(testimonial)
  }
}

let testimonialCourseName = await testimonialSchema.find({
  courseName: {
    $regex: search,
    $options: "i",
  },
})
.populate(["user_detail","LCourseId", "RCourseId"])

if(testimonialCourseName.length > 0){
  for (let testimonial of testimonialCourseName) {
    testimonialData.push(testimonial)
  }
}

let testimonialDescription = await testimonialSchema.find({
  description: {
    $regex: search,
    $options: "i",
  },
})
.populate(["user_detail","LCourseId", "RCourseId"])

if(testimonialDescription.length > 0){
  for (let testimonial of testimonialDescription) {
    testimonialData.push(testimonial)
  }
}
  
    if (!getTestimonial) {
      return next(new ErrorHandeler("Category Not Found !", 500));
    }
  // console.log(allTestimonial)
    res.status(200).json({
      success: true,
      message: "All Testimonial Fetched !!",
      testimonial: testimonialData,
    });
  });

  export const getTestimonialById = catchAsyncError(async (req, res, next) => {
    const testimonialId = req.params.id;

    const testimonial = await testimonialSchema.findById(testimonialId);
    if (!testimonial) {
      return next(new ErrorHandeler("testimonial not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Category Fetched !!",
      testimonial: testimonial,
    });
  });

  export const updateTestimonial = catchAsyncError(async (req, res, next) => {
    const { data } = req.body;
  
    console.log(data);
  
    let findTestimonial = testimonialSchema.findById(data._id);
  
    if (!findTestimonial) {
      return next(new ErrorHandeler("No Testimonial found !!", 500));
    }
  
    findTestimonial = data;
  
    console.log(findTestimonial);
    await testimonialSchema.findByIdAndUpdate(data._id, findTestimonial);
  
    res.status(200).json({
      success: true,
      message: "Testimonial Updated Successful",
    });
  });

 export const deleteTestimonial = async(req,res) => {
    const { id } = req.params;
    try {
        const testimonial = testimonialSchema.findById(id);
        if (!testimonial) {
          return res.status(500).json({message: "no Testimonial found !!"})
        }
    const removeTestimonial = await testimonialSchema.findByIdAndDelete(id)
    res.status(200).json({success: true, message: "Testimonial deleted !!"})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}