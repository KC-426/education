import enquirySchema from "../models/enquirySchema.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import CourseSchema from "../models/courseSchema.js";

export const createEnquiry = async (req, res, next) => {
  try {
    const { title, message, RCourseId, LCourseId, userId, phoneNumber, name } =
      req.body;
    console.log(req.body);

    if (!message) {
      return res
        .status(500)
        .json({ message: "Please fill the required fields !!" });
    }

    let options;

    if (userId) {
      options = {
        title: title,
        message: message,
        RCourseId: RCourseId,
        LCourseId: LCourseId,
        user_detail: userId,
        name: name,
        phoneNumber: phoneNumber,
      };
    } else {
      options = {
        title: title,
        message: message,
        RCourseId: RCourseId,
        LCourseId: LCourseId,

        name: name,
        phoneNumber: phoneNumber,
      };
    }

    const create = new enquirySchema(options);
    const result = await create.save();
    console.log(result);
    res
      .status(201)
      .json({ success: true, message: "Enquiry added !!", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEnquiry = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);
  
  if (search == "") {
    let allEnquiry = await enquirySchema
    .find()
    .populate(["user_detail", "RCourseId", "LCourseId"])
    .sort({ createdAt: -1 });

    return  res.status(200).json({
      success: true,
      message: "All Enquery Fetched !!",
      enquiry: allEnquiry,
    });
  }

  let enqData = []
  let enqName = await enquirySchema
  .find({
    name: {
      $regex: search,
      $options: "i",
    },
  })
  .populate(["user_detail", "RCourseId", "LCourseId"])
  .sort({ createdAt: -1 });

  if (enqName.length > 0) {
    for (let enquiry of enqName) {
      enqData.push(enquiry);
    }
  }

  // let enqCourseName = await enquirySchema
  // .find({
  //   ["user_detail", "RCourseId", "LCourseId"]: {
  //     $regex: search,
  //     $options: "i",
  //   },
  // })
  // .populate(["user_detail", "RCourseId", "LCourseId"])
  // .sort({ createdAt: -1 });

  // if (enqCourseName.length > 0) {
  //   for (let enquiry of enqCourseName) {
  //     enqData.push(enquiry);
  //   }
  // }


  let enqMessage = await enquirySchema
  .find({
    message: {
      $regex: search,
      $options: "i",
    },
  })
  .populate(["user_detail", "RCourseId", "LCourseId"])
  .sort({ createdAt: -1 });

  if (enqMessage.length > 0) {
    for (let enquiry of enqMessage) {
      enqData.push(enquiry);
    }
  }

  let num = Number(search);
  if(num) {
    let enqPhone = await enquirySchema
    .find({
      phoneNumber: Number(search),
    })
    .populate(["user_detail", "RCourseId", "LCourseId"])
    .sort({ createdAt: -1 });

    if (enqPhone.length > 0) {
      for (let enquiry of enqPhone) {
        enqData.push(enquiry);
      }   
    } 
  }


  let enqLiveCourseName = await enquirySchema.find()
  .populate(["user_detail", "RCourseId", "LCourseId"])
  .sort({ createdAt: -1 });

   console.log(enqLiveCourseName)

   const enqLiveCName = enqLiveCourseName.filter((ele) => {
    if (ele?.LCourseId?.title?.toLowerCase().includes(search?.toLowerCase())) {
      return ele;
    }
   })

   if (enqLiveCName.length > 0) {
    for (let enquiry of enqLiveCName) {
      enqData.push(enquiry);
    }
  }

  let enqRecCourseName = await enquirySchema.find()
  .populate(["user_detail", "RCourseId", "LCourseId"])
  .sort({ createdAt: -1 });


   const enqRecCName = enqRecCourseName.filter((ele) => {
    if (ele?.RCourseId?.title?.toLowerCase().includes(search?.toLowerCase())) {
      return ele;
    }
   })

   if (enqRecCName.length > 0) {
    for (let enquiry of enqRecCName) {
      enqData.push(enquiry);
    }
  }

  if (!getEnquiry) {
    return next(new ErrorHandeler("Enquiry Not Found !", 500));
  }
 
  res.status(200).json({
    success: true,
    message: "All Enquery Fetched !!",
    enquiry: enqData,
  });
});

export const getEnquiryByid = catchAsyncError(async (req, res, next) => {
  const {id} = req.params.id
  const Enquiry = await enquirySchema
    .find({_id:id})
    // .populate(["user_detail", "RCourseId", "LCourseId"])
    .populate(["user_detail"])
    .sort({ createdAt: -1 });
  

  if (!Enquiry) {
    return next(new ErrorHandeler("Enquiry Not Found !", 500));
  }

    res.status(200).json({
      success: true,
      message: "All Enquery Fetched !!",
      enquiry: Enquiry,
    });
  
 
});
export const getEnquiry_teacher = catchAsyncError(async (req, res, next) => {
  const teacher = req.teacher;

  const allEnquiry = await enquirySchema
    .find()
    .populate(["user_detail", "RCourseId", "LCourseId"])
    // .sort({ createdAt: -1 });

    // 

  if (allEnquiry.length == 0) {
    return next(new ErrorHandeler("Enquiry Not Found !", 500));
  }

  const allCourses = await CourseSchema.find({ courseTeacher: teacher._id })
    .populate("faq")
    .populate("testimonials")
    .sort({ createdAt: -1 });

  let enquiryTeacher = [];

  allCourses.forEach((course) => {
    allEnquiry.forEach((enq) => {
      console.log(course._id.toString() == enq?.RCourseId?._id?.toString());
      if (course._id.toString() == enq?.RCourseId?._id?.toString()) {
        enquiryTeacher.push(enq);
      }
    });
  });
  // console.log(enquiryTeacher);
  // console.log(allEnquiry);
  res.status(200).json({
    success: true,
    message: "All Enquery Fetched !!",
    enquiry: enquiryTeacher,
  });
});

export const deleteEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const Enquiry = enquirySchema.findById(id);
    if (!Enquiry) {
      return res.status(500).json({ message: "no Enquiry found !!" });
    }
    const removeEnquiry = await enquirySchema.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Enquiry deleted !!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
