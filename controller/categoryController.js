import categorySchema from "../models/categorySchema.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";

export const createCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    console.log(req.body);

    if (!title || !description) {
      return res
        .status(500)
        .json({ message: "Please fill the required fields !!" });
    }


    const create = new categorySchema({
      title: title,
      description: description,
    });
    const result = await create.save();
    console.log(result);
    res
      .status(201)
      .json({ success: true, message: "Category added !!", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategory = catchAsyncError(async (req, res, next) => {
  const {search = ""} = req.query

if(search == ""){
  let allCategory = await categorySchema.find().sort({ createdAt: -1 });
   return  res.status(200).json({
    success: true,
    message: "All Category Fetched !!",
    category: allCategory,
  });
}

let categoryData = []
let categoryTitle = await categorySchema.find({
  title: {
    $regex: search,
    $options: "i",
  },
}).sort({ createdAt: -1 })

if(categoryTitle.length > 0) {
  for(let category of categoryTitle) {
    categoryData.push(category)
  }
}

let categoryDes = await categorySchema.find({
  description: {
    $regex: search,
    $options: "i",
  },
}).sort({ createdAt: -1 })

if(categoryDes.length > 0) {
  for(let category of categoryDes) {
    categoryData.push(category)
  }
}

  if (!getCategory) {
    return next(new ErrorHandeler("Category Not Found !", 500));
  }

  res.status(200).json({
    success: true,
    message: "All Category Fetched !!",
    category: categoryData,
  });
});

export const getCategoryById = catchAsyncError(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await categorySchema.findById(categoryId);
  if (!category) {
    return next(new ErrorHandeler("category not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Category Fetched !!",
    category: category,
  });
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log(data);

  let findCategory = categorySchema.findById(data._id);

  if (!findCategory) {
    return next(new ErrorHandeler("No category found !!", 500));
  }

  findCategory = data;

  console.log(findCategory);
  await categorySchema.findByIdAndUpdate(data._id, findCategory);

  res.status(200).json({
    success: true,
    message: "Category Updated Successful",
  });
});

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = categorySchema.findById(id);
    if (!category) {
      return res.status(500).json({ message: "no category found !!" });
    }
    const removeCategory = await categorySchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted !!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};
