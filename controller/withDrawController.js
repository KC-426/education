import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import withDrawEnqery from "../models/withDrawEnqery.js";

export const createEnquery = catchAsyncError(async (req, res, next) => {
  console.log("Start");

  const user = req.student;
  const { withDrawAmount } = req.body;
  console.log(user);

  console.log(withDrawAmount, "amount");
  const create = await withDrawEnqery.create({
    withDrawAmount: withDrawAmount,
    user_detail: user,
  });
  res.status(200).json({
    success: true,
    message: "enquery created successfully!!",
    enquery: withDrawAmount,
    create: create,
  });
});

export const allEnquery = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let allEnquery = await withDrawEnqery.find().populate("user_detail");
 return res.status(200).json({
  success: true,
  message: "All enqueries fetched !!",
  withDrawEnqery: allEnquery,
});
  }

  let reqData = []
  let reqAmount = await withDrawEnqery.find({
    withDrawAmount: {
      $regex: search,
      $options: "i",
    },
  }).populate("user_detail");

  if (reqAmount.length > 0) {
    for (let request of reqAmount) {
      reqData.push(request);
    }
  }

  let reqName = await withDrawEnqery.find().populate("user_detail");

  const reqUserName = reqName.filter((ele) => {
    if (ele?.user_detail?.name?.toLowerCase().includes(search?.toLowerCase())) {
      return ele;
    }
  })

  if (reqUserName.length > 0) {
    for (let request of reqUserName) {
      reqData.push(request);
    }
  }

  let reqEmail = await withDrawEnqery.find().populate("user_detail");

  const reqUserEmail = reqEmail.filter((ele) => {
    if (ele?.user_detail?.email?.toLowerCase().includes(search?.toLowerCase())) {
      return ele;
    }
  })

  if (reqUserEmail.length > 0) {
    for (let request of reqUserEmail) {
      reqData.push(request);
    }
  }

  let reqPhone = await withDrawEnqery.find().populate("user_detail");

  const reqUserPhone = reqPhone.filter((ele) => {
    if (ele?.user_detail?.phoneNumber == search) {
      return ele;
    }
  })

  if (reqUserPhone.length > 0) {
    for (let request of reqUserPhone) {
      reqData.push(request);
    }
  }

  if (!allEnquery) {
    return next(new ErrorHandeler("No enquery found !!", 500));
  }
  res.status(200).json({
    success: true,
    message: "All enqueries fetched !!",
    withDrawEnqery: reqData,
  });
});

export const deleteEnquery = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const enquery = withDrawEnqery.findById(id);
  if (!enquery) {
    return next(new ErrorHandeler("No enquery found!!", 500));
  }
  const removeEnq = await withDrawEnqery.findOneAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Enqery deleted !!",
  });
});
