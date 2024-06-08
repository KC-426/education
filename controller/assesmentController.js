import assignmentSchema from "../models/assignmentSchema.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";

export const createAssement = async (req, res, next) => {
  try {
    const { title, description, meta_title, meta_description, mcq } = req.body;
    console.log(req.body);

    if (!title || !description || !meta_title || !meta_description || !mcq) {
      return res
        .status(500)
        .json({ message: "Please fill the required fields !!" });
    }

    const assesment = await assignmentSchema.findOne({ title: title });

    if (assesment) {
      return next(new ErrorHandeler("Assesment is Already Finded !", 500));
    }

    const create = new assignmentSchema({
      title,
      description,
      meta_title,
      meta_description,
      mcq,
    });

    const result = await create.save();
    console.log(result);
    res
      .status(201)
      .json({ success: true, message: "Assesment added !!", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const submitAssessment = async (req, res, next) => {
  try {
    const { ans, data } = req.body;
    console.log(req.body);
    const findById = await assignmentSchema.findById(data._id);

    // console.log(correctOption.mcq, ans);

    let totalScore = findById.mcq.length;
    let attempted = 0;
    let givenScore = 0;
    let correct = 0;

    ans.forEach((ele) => {
      if (!ele.notAtt) {
        attempted += 1;
      }
    });

    ans.forEach((ele, i) => {
      if (!ele.notAtt) {
        console.log(findById.mcq[i]);

        if (findById.mcq[i].options[ele.atteAns].isTrue) {
          givenScore = givenScore + 1;
          correct = correct + 1;
        }
      }
    });

    console.log(
      "correct =====>",
      correct,
      totalScore - correct,
      "<====== incorrect"
    );
    console.log(
      "attempted =====>",
      attempted,
      givenScore,
      "<====== given",
      "totalScore=====>",
      totalScore
    );

    res.status(201).json({
      success: true,
      message: "Answer added !!",
      attempted,
      givenScore,
      correct,
      inCorrect: totalScore - correct,
      totalScore,
      // result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAssesment = catchAsyncError(async (req, res, next) => {
  const allassesment = await assignmentSchema.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "All assesment Fetched !!",
    assesment: allassesment,
  });
});

export const getAssesmentbyID = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!referId) {
    return next(new ErrorHandeler("Assesment Id not Found !", 400));
  }

  const fetchAssesment = await AgetSchema.findOne({ _id: id }).sort({
    createdAt: -1,
  });

  if (!fetchAssesment) {
    res.status(200).json({
      success: false,
      message: "Assesment Not Found !!",
    });
  }

  res.status(200).json({
    success: true,
    message: "assesment by id Fetched !!",
    assesmentbyid: fetchAssesment,
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

export const getAssessmentById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const assesment = await assignmentSchema.findById(id);
  if (!assesment) {
    return next(new ErrorHandeler("category not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Assessment Fetched !!",
    assesment: assesment,
  });
});

export const updateAgent = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log("data => ", data);

  let findCategory = AgetSchema.findById(data._id);

  if (!findCategory) {
    return next(new ErrorHandeler("No category found !!", 500));
  }

  findCategory = data;

  console.log(findCategory);
  await AgetSchema.findByIdAndUpdate(data._id, findCategory);

  res.status(200).json({
    success: true,
    message: "Agent Updated Successful",
  });
});

export const deleteAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const category = AgetSchema.findById(id);
    if (!category) {
      return res.status(500).json({ message: "No Agent found !!" });
    }
    const removeCategory = await AgetSchema.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Agent deleted !!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Courses
export const DeleteAssesment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  const assign = assignmentSchema.findById({ _id: id });
  if (!assign) {
    return next(new ErrorHandeler("Assign Not Found !", 500));
  }

  await assignmentSchema.findByIdAndDelete({ _id: id });

  res.status(200).json({
    success: true,
    message: "Assignment Deleted Successful !!",
  });
});

export const updateAssignment = catchAsyncError(async (req, res, next) => {
  const { data } = req.body;

  console.log("data => ", data);

  let findAssement = assignmentSchema.findById(data._id);

  if (!findAssement) {
    return next(new ErrorHandeler("No Assesmentfount found !!", 500));
  }

  findAssement = data;

  await assignmentSchema.findByIdAndUpdate(data._id, findAssement);

  res.status(200).json({
    success: true,
    message: "Assesment Updated Successful",
  });
});
