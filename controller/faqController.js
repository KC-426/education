import faqSchema from "../models/faqSchema.js"
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";

export const createFaq = async(req, res, next) => {
    try{
        const {title, description } = req.body
        console.log(req.body)

        if (!title || !description) {
            return res.status(500).json({message: "Please fill the required fields !!"})
          }
        
        const create = new faqSchema({
            title: title,
            description: description
        })
        const result = await create.save()
        console.log(result)
        res.status(201).json({success: true, message: "Faq added !!", result: result})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export const getFaq = catchAsyncError(async (req, res, next) => {
const {search = ""} = req.query

if(search == ""){
  let allFaq = await faqSchema.find().sort({ createdAt: -1 });
  return  res.status(200).json({
    success: true,
    message: "All Faq Fetched !!",
    faq: allFaq,
  })
}

let faqData = []
let faqTitle = await faqSchema.find({
  title: {
    $regex: search,
    $options: "i",
  },
}).sort({ createdAt: -1 });

if(faqTitle.length > 0) {
  for(let faq of faqTitle) {
    faqData.push(faq)
  }
}

let faqDescription = await faqSchema.find({
  description: {
    $regex: search,
    $options: "i",
  },
}).sort({ createdAt: -1 });

if(faqDescription.length > 0) {
  for(let faq of faqDescription) {
    faqData.push(faq)
  }
}
  
    if (!getFaq) {
      return next(new ErrorHandeler("Faq Not Found !", 500));
    }
  // console.log(allFaq)
    res.status(200).json({
      success: true,
      message: "All Faq Fetched !!",
      faq: faqData,
    });
  });

  export const getFaqById = catchAsyncError(async (req, res, next) => {
    const FaqId = req.params.id;

    const Faq = await faqSchema.findById(FaqId);
    if (!Faq) {
      return next(new ErrorHandeler("Faq not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Faq Fetched !!",
      Faq: Faq,
    });
  });

  export const updateFaq = catchAsyncError(async (req, res, next) => {
    const { data } = req.body;
  
    console.log(data);
  
    let findFaq = faqSchema.findById(data._id);
  
    if (!findFaq) {
      return next(new ErrorHandeler("No Faq found !!", 500));
    }
  
    findFaq = data;
  
    console.log(findFaq);
    await faqSchema.findByIdAndUpdate(data._id, findFaq);
  
    res.status(200).json({
      success: true,
      message: "Faq Updated Successful",
    });
  });

 export const deleteFaq = async(req,res) => {
    const { id } = req.params;
    try {
        const Faq = faqSchema.findById(id);
        if (!Faq) {
          return res.status(500).json({message: "no Faq found !!"})
        }
    const removeFaq = await faqSchema.findByIdAndDelete(id)
    res.status(200).json({success: true, message: "Faq deleted !!"})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}