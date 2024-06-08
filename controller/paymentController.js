import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import CourseSchema from "../models/courseSchema.js";
import UserSchema from "../models/userSchema.js";
import { verifyRazerPay } from "../utils/razorPay.js";
import { instance } from "../server.js";
import SuccessPaymentHistory from "../models/successPaymentHistory.js";
import bundleSchema from "../models/bundleSchema.js";
import AgetSchema from "../models/agetSchema.js";
import LiveCourseSchema from "../models/liveCourseSchema.js";
import userSchema from "../models/userSchema.js";
import globalDiscountchema from "../models/globalDiscountchema.js";

// For Error User This
// return next(new ErrorHandeler("Fill All The Required Field !", 400));

// payment order Create
export const paymentOrder = catchAsyncError(async (req, res, next) => {
  const { amount, currentUser, singleCourse, agentId } = req.body;

  // if (agentId) {
  //   const agent = await AgetSchema.findOne({ agent_id: agentId });
  //   if (!agent) {
  //     return next(new ErrorHandeler("Invalid Agent Id !", 400));
  //   }
  // }

  const user = await UserSchema.findById(currentUser._id);
  let isCourse = await CourseSchema.findById(singleCourse._id);

  if (!isCourse) {
    return next(new ErrorHandeler("Course not found !", 400));
  }
  if (!user) {
    return next(new ErrorHandeler("User not found !", 400));
  }

  let isTrue = true;
  user.courses.forEach((ele) => {
    console.log(ele.course_id, isCourse._id);

    if (JSON.stringify(ele.course_id) == JSON.stringify(isCourse._id)) {
      return (isTrue = false);
    }
  });

  let order;

  if (isTrue) {
    var options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    order = await instance.orders.create(options);
  } else {
    return next(new ErrorHandeler("Course Already in Your Account !", 400));
  }

  res.status(200).json({
    success: true,
    message: "Rezorpay Successful",
    order,
  });
});

export const paymentOrderLive = catchAsyncError(async (req, res, next) => {
  const { amount, currentUser, singleCourse, agentId } = req.body;

  // if (agentId) {
  //   const agent = await AgetSchema.findOne({ agent_id: agentId });
  //   if (!agent) {
  //     return next(new ErrorHandeler("Invalid Agent Id !", 400));
  //   }
  // }

  const user = await UserSchema.findById(currentUser._id);
  let isCourse = await LiveCourseSchema.findById(singleCourse._id);

  if (!isCourse) {
    return next(new ErrorHandeler("Course not found !", 400));
  }
  if (!user) {
    return next(new ErrorHandeler("User not found !", 400));
  }

  let isTrue = true;
  user.liveCourses.forEach((ele) => {
    console.log(ele.course_id, isCourse._id);

    if (JSON.stringify(ele.course_id) == JSON.stringify(isCourse._id)) {
      return (isTrue = false);
    }
  });

  let order;

  if (isTrue) {
    var options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    order = await instance.orders.create(options);
  } else {
    return next(new ErrorHandeler("Course Already in Your Account !", 400));
  }

  res.status(200).json({
    success: true,
    message: "Rezorpay Successful",
    order,
  });
});

//Paymet Done
export const paymentDone = catchAsyncError(async (req, res, next) => {
  const {
    order_id,
    payment_id,
    razorpay_signature,
    singleCourse,
    currentUser,
    agentId,
    discount,
    isFlatDiscount,
    payedAmount,
  } = req.body;

  if (!order_id || !payment_id || !razorpay_signature) {
    return next(new ErrorHandeler("Something Went Wrong !", 500));
  }

  const isVerify = await verifyRazerPay(
    order_id,
    payment_id,
    razorpay_signature
  );

  console.log("isVerify => ", isVerify);

  if (isVerify) {
    let isCourse = await CourseSchema.findById(singleCourse._id);
    let isUser = await UserSchema.findById(currentUser._id);

    if (!isCourse) {
      return next(new ErrorHandeler("Course Not Found !", 400));
    }
    if (!isUser) {
      return next(new ErrorHandeler("User Not Found !", 400));
    }

    // console.log(isUser);

    isUser.courses = [...isUser.courses, { course_id: isCourse._id }];

    await isUser.save();

    if (!agentId) {
      return await SuccessPaymentHistory.create({
        paymentId: payment_id,

        payedAmount: payedAmount,
        discount: 0,

        amount: isCourse.amount,

        paymentType: "Course",

        user: isUser._id,
        course: isCourse._id,
      });
    }
    const agent = await AgetSchema.findOne({ agent_id: agentId });

    if (agent) {
      await SuccessPaymentHistory.create({
        paymentId: payment_id,

        payedAmount: payedAmount,
        discount: discount,
        isFlatDiscount: isFlatDiscount,
        isAgent: true,

        amount: isCourse.amount,

        paymentType: "Course",

        user: isUser._id,
        course: isCourse._id,
      });
    } else {
      await SuccessPaymentHistory.create({
        paymentId: payment_id,

        payedAmount: payedAmount,
        discount: discount,
        isFlatDiscount: isFlatDiscount,
        isAgent: false,
        amount: isCourse.amount,

        paymentType: "Course",

        user: isUser._id,
        course: isCourse._id,
      });
    }

    if (agent) {
      let isUser = await UserSchema.findById(currentUser._id);
      let isCourse = await CourseSchema.findById(singleCourse._id);

      if (isCourse) {
        let agent = await AgetSchema.findOne({ agent_id: agentId });
        let newData = [...agent.saledCourse];
        newData.push({
          RCourseId: isCourse._id,
          user_detail: isUser._id,
          paymentDetail: {
            paymentId: payment_id,
            payedAmount: Number(payedAmount),
            discount: discount,
            isFlatDiscount: isFlatDiscount,
            totalAmount: isCourse.amount,

            paymentType: "Course",

            user: isUser._id,
            course: isCourse._id,
          },
        });
        agent.saledCourse = newData;
        await agent.save();
      }
    } else {
      let userWallet = await userSchema.findOne({ refer_id: JSON.stringify(agentId.trim()) });

      let discount = await globalDiscountchema.findOne();
      console.log('console data !!!!!!', userWallet, discount, JSON.stringify(agentId.trim()))

      if (discount.isFlatDiscount) {
        userWallet.wallet =
          Number(userWallet.wallet) + Number(discount.discount);
      } 
      else {
        let dis = (payedAmount * discount.discount) / 100;
        userWallet.wallet = Number(userWallet.wallet) + Number(Math.round(dis));
      }

      await userWallet.save();
    }
  } else {
    return next(new ErrorHandeler("Something Went Wrong !", 500));
  }

  res.status(200).json({
    success: true,
    message: "Course Purchaseed Successful",
  });
});

//Paymet Done Live Courses
export const liveCoursePaymentDone = catchAsyncError(async (req, res, next) => {
  const {
    order_id,
    payment_id,
    razorpay_signature,
    singleCourse,
    currentUser,
    agentId,
    discount,
    isFlatDiscount,
    payedAmount,
  } = req.body;


  if (!order_id || !payment_id || !razorpay_signature) {
    return next(new ErrorHandeler("Something Went Wrong !", 500));
  }

  const isVerify = await verifyRazerPay(
    order_id,
    payment_id,
    razorpay_signature
  );

  console.log("isVerify => ", isVerify);

  if (isVerify) {
    let isCourse = await LiveCourseSchema.findById(singleCourse._id);
    let isUser = await UserSchema.findById(currentUser._id);

    if (!isCourse) {
      return next(new ErrorHandeler("Course Not Found !", 400));
    }
    if (!isUser) {
      return next(new ErrorHandeler("User Not Found !", 400));
    }

    console.log(isUser);

    isUser.liveCourses = [...isUser.liveCourses, { course_id: isCourse._id }];

    const user = await isUser.save();

    if (!agentId) {
      return await SuccessPaymentHistory.create({
        paymentId: payment_id,

        payedAmount: payedAmount,
        discount: 0,

        amount: isCourse.amount,

        paymentType: "Live Course",

        user: isUser._id,
        liveCourse: isCourse._id,
      });
    }

    console.log(user);

    const agent = await AgetSchema.findOne({ agent_id: agentId });

    if (agent) {
      await SuccessPaymentHistory.create({
        paymentId: payment_id,

        payedAmount: payedAmount,
        discount: discount,
        isFlatDiscount: isFlatDiscount,
        isAgent: true,

        amount: isCourse.amount,

        paymentType: "Live Course",

        user: isUser._id,
        liveCourse: isCourse._id,
      });
    } else {
      await SuccessPaymentHistory.create({
        paymentId: payment_id,

        payedAmount: payedAmount,
        discount: discount,
        isFlatDiscount: isFlatDiscount,
        isAgent: false,

        amount: isCourse.amount,

        paymentType: "Live Course",

        user: isUser._id,
        liveCourse: isCourse._id,
      });
    }

    if (agent) {
      let isUser = await UserSchema.findById(currentUser._id);
      let isCourse = await LiveCourseSchema.findById(singleCourse._id);

      if (isCourse) {
        let agent = await AgetSchema.findOne({ agent_id: agentId });
        let newData = [...agent.saledCourse];
        newData.push({
          LCourseId: isCourse._id,
          user_detail: isUser._id,
          paymentDetail: {
            paymentId: payment_id,
            payedAmount: Number(payedAmount),
            discount: discount,
            isFlatDiscount: isFlatDiscount,
            totalAmount: isCourse.amount,
            paymentType: "Live Course",

            user: isUser._id,
            liveCourse: isCourse._id,
          },
        });
        agent.saledCourse = newData;
        await agent.save();
      } else {
        return next(new ErrorHandeler("Live Course Not Found !", 500));
      }
    } else {
      let userWallet = await userSchema.findOne({ refer_id: agentId });

      let discount = await globalDiscountchema.findOne();

      if (discount.isFlatDiscount) {
        userWallet.wallet =
          Number(userWallet.wallet) + Number(discount.discount);
      } else {
        let dis = (payedAmount * discount.discount) / 100;
        userWallet.wallet = Number(userWallet.wallet) + Number(Math.round(dis));
      }

      await userWallet.save();
    }
  } else {
    return next(new ErrorHandeler("Something Went Wrong !", 500));
  }

  res.status(200).json({
    success: true,
    message: "Course Purchaseed Successful",
  });
});

// All Payments
export const paymetnsByStudentId = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const allPaymets = await SuccessPaymentHistory.find({ user: id })
    .populate(["user", "course", "liveCourse"])
    .sort({ createdAt: -1 });

  if (!allPaymets) {
    return next(new ErrorHandeler("Something Went Wrong !", 500));
  }

  res.status(200).json({
    success: true,
    message: "Payment fetched Successful",
    payments: allPaymets,
  });
});

export const allPayments = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;

  if (search == "") {
    let allPaymets = await SuccessPaymentHistory.find()
      .populate(["user", "course", "liveCourse", "bundleCourses"])
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Payment fetched Successful",
      payments: allPaymets,
    });
  }

  let paymentData = [];

  let payId = await SuccessPaymentHistory.find({
    paymentId: {
      $regex: search,
      $options: "i",
    },
  })
    .populate(["user", "course", "liveCourse", "bundleCourses"])
    .sort({ createdAt: -1 });

  if (payId.length > 0) {
    for (let payment of payId) {
      paymentData.push(payment);
    }
  }

  let paymentUserName = await SuccessPaymentHistory.find()
    .populate(["user", "course", "liveCourse", "bundleCourses"])
    .sort({ createdAt: -1 });

  console.log(paymentUserName);
  const paybyName = paymentUserName.filter((ele) => {
    if (ele?.user?.name?.toLowerCase().includes(search?.toLowerCase())) {
      return ele;
    }
  });

  if (paybyName.length > 0) {
    for (let payment of paybyName) {
      paymentData.push(payment);
    }
  }

  let paymentUserPhone = await SuccessPaymentHistory.find()
    .populate(["user", "course", "liveCourse", "bundleCourses"])
    .sort({ createdAt: -1 });

  console.log(paymentUserName);
  const paybyPhone = paymentUserPhone.filter((ele) => {
    if (ele?.user?.phoneNumber == search) {
      return ele;
    }
  });

  if (paybyPhone.length > 0) {
    for (let payment of paybyPhone) {
      paymentData.push(payment);
    }
  }

  if (!allPayments) {
    return next(new ErrorHandeler("Something Went Wrong !", 500));
  }

  res.status(200).json({
    success: true,
    message: "Payment fetched Successful",
    payments: paymentData,
  });
});


//<===============================COURSE BUNDLE=======================================>
export const paymentOrderBundle = catchAsyncError(async (req, res, next) => {
  const { amount, currentUser, bundle, agentId } = req.body;

  // if (agentId) {
  //   const agent = await AgetSchema.findOne({ agent_id: agentId });
  //   if (!agent) {
  //     return next(new ErrorHandeler("Invalid Agent Id !", 400));
  //   }
  // }

  const user = await UserSchema.findById(currentUser._id);
  let isCourse = await bundleSchema.findById(bundle._id);

  //console.log(isCourse);

  if (!isCourse) {
    console.log(!isCourse);
    return next(new ErrorHandeler("Course Bundle not found !", 400));
  }
  if (!user) {
    console.log(!user);
    return next(new ErrorHandeler("User not found !", 400));
  }

  let isTrue = true;
  console.log(user.bundleCourses);
  user.bundleCourses.forEach((ele) => {
    console.log(ele, isCourse._id);

    if (JSON.stringify(ele?.bundle_id) === JSON.stringify(isCourse._id)) {
      return (isTrue = false);
    }
  });

  let order;

  if (isTrue) {
    console.log(isTrue);
    var options = {
      amount: Number(1 * 100),
      currency: "INR",
    };
    try {
      order = await instance.orders.create(options);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("already");
    return next(
      new ErrorHandeler("Course Bundle Already Present in Your Account !", 400)
    );
  }

  res.status(200).json({
    success: true,
    message: "Rezorpay Successful",
    order,
  });
});

export const bundleCoursePaymentDone = catchAsyncError(
  async (req, res, next) => {
    const {
      order_id,
      payment_id,
      razorpay_signature,
      singleCourse,
      currentUser,
      agentId,
      discount,
      isFlatDiscount,
      payedAmount,
    } = req.body;

    // console.log(singleCourse, currentUser);

    if (!order_id || !payment_id || !razorpay_signature) {
      return next(new ErrorHandeler("Something Went Wrong !", 500));
    }

    const isVerify = await verifyRazerPay(
      order_id,
      payment_id,
      razorpay_signature
    );

    console.log("isVerify => ", isVerify);

    if (isVerify) {
      let isCourse = await bundleSchema.findById(singleCourse._id);
      let isUser = await UserSchema.findById(currentUser._id);

      if (!isCourse) {
        return next(new ErrorHandeler("Course Bundle Not Found !", 400));
      }
      if (!isUser) {
        return next(new ErrorHandeler("User Not Found !", 400));
      }

      console.log(isUser);

      isUser.bundleCourses = [
        ...isUser.bundleCourses,
        { bundle_id: isCourse._id },
      ];

      const user = await isUser.save();

      if (!agentId) {
        return await SuccessPaymentHistory.create({
          paymentId: payment_id,

          payedAmount: payedAmount,
          discount: 0,

          amount: isCourse.amount,

          paymentType: "Bundle Course",

          user: isUser._id,
          bundleCourses: isCourse._id,
        });
      }

      console.log(user);

      const agent = await AgetSchema.findOne({ agent_id: agentId });

      if (agent) {
        await SuccessPaymentHistory.create({
          paymentId: payment_id,

          payedAmount: payedAmount,
          discount: discount,
          isFlatDiscount: isFlatDiscount,
          isAgent: true,

          amount: isCourse.amount,

          paymentType: "Bundle Course",

          user: isUser._id,
          bundleCourses: isCourse._id,
        });
      } else {
        await SuccessPaymentHistory.create({
          paymentId: payment_id,

          payedAmount: payedAmount,
          discount: discount,
          isFlatDiscount: isFlatDiscount,
          isAgent: false,

          amount: isCourse.amount,

          paymentType: "Bundle Course",

          user: isUser._id,
          bundleCourses: isCourse._id,
        });
      }

      if (agent) {
        let isUser = await UserSchema.findById(currentUser._id);
        let isCourse = await bundleSchema.findById(singleCourse._id);

        if (isCourse) {
          let agent = await AgetSchema.findOne({ agent_id: agentId });
          let newData = [...agent.saledCourse];
          newData.push({
            BCourseId: isCourse._id,
            user_detail: isUser._id,
            paymentDetail: {
              paymentId: payment_id,
              payedAmount: Number(payedAmount),
              discount: discount,
              isFlatDiscount: isFlatDiscount,
              totalAmount: isCourse.price,

              paymentType: "Bundle Course",

              user: isUser._id,
              bundleCourses: isCourse._id,
            },
          });
          agent.saledCourse = newData;
          await agent.save();
        } else {
          return next(new ErrorHandeler("Live Course Not Found !", 500));
        }
      } else {
        let userWallet = await userSchema.findOne({ refer_id: agentId });

        let discount = await globalDiscountchema.findOne();

        if (discount.isFlatDiscount) {
          userWallet.wallet =
            Number(userWallet.wallet) + Number(discount.discount);
        } else {
          let dis = (payedAmount * discount.discount) / 100;
          userWallet.wallet =
            Number(userWallet.wallet) + Number(Math.round(dis));
        }

        await userWallet.save();
      }
    } else {
      return next(new ErrorHandeler("Something Went Wrong !", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course Purchaseed Successful",
    });
  }
);
