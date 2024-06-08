import ShortUniqueId from "short-unique-id";
import AgetSchema from "../models/agetSchema.js";
import categorySchema from "../models/categorySchema.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import agetSchema from "../models/agetSchema.js";

export const createAgent = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, discount, flatDiscount } = req.body;
    console.log(req.body);

    if (!name || !email) {
      return res
        .status(500)
        .json({ message: "Please fill the required fields !!" });
    }

    const agent = await AgetSchema.findOne({ email: email });

    if (agent) {
      return next(new ErrorHandeler("Agent is Already Finded !", 500));
      // dgsdfg
    }

    const uid = new ShortUniqueId({ length: 10 });

    const unId = uid.rnd();

    console.log(unId);

    const create = new AgetSchema({
      name,
      agent_id: `AGEN_${unId}`.toUpperCase(),
      email,
      phoneNumber,
      discount: discount,
      isFlatDiscount: flatDiscount,
    });

    const result = await create.save();
    console.log(result);
    res
      .status(201)
      .json({ success: true, message: "Agent added !!", result: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAgent = catchAsyncError(async (req, res, next) => {
  const { search = "" } = req.query;
  console.log(req.query);

  if (search == "") {
    let allAgents = await AgetSchema.find()
      .populate([
        "saledCourse.RCourseId",
        "saledCourse.LCourseId",
        "saledCourse.user_detail",
      ])
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All Agents Fetched !!",
      agent: allAgents,
    });
  }

  let agentData = [];
  let agentName = await agetSchema
    .find({
      name: {
        $regex: search,
        $options: "i",
      },
    })
    .populate([
      "saledCourse.RCourseId",
      "saledCourse.LCourseId",
      "saledCourse.user_detail",
    ])
    .sort({ createdAt: -1 });

  if (agentName.length > 0) {
    for (let agent of agentName) {
      agentData.push(agent);
    }
  }

  let agentEmail = await agetSchema
    .find({
      email: {
        $regex: search,
        $options: "i",
      },
    })
    .populate([
      "saledCourse.RCourseId",
      "saledCourse.LCourseId",
      "saledCourse.user_detail",
    ])
    .sort({ createdAt: -1 });

  if (agentEmail.length > 0) {
    for (let agent of agentEmail) {
      agentData.push(agent);
    }
  }

  let agentReferId = await agetSchema
  .find({
    agent_id: {
      $regex: search,
      $options: "i",
    },
  })
  .populate([
    "saledCourse.RCourseId",
    "saledCourse.LCourseId",
    "saledCourse.user_detail",
  ])
  .sort({ createdAt: -1 });

if (agentReferId.length > 0) {
  for (let agent of agentReferId) {
    agentData.push(agent);
  }
}

  let num = Number(search);
  if (num) {
    let agentPhone = await agetSchema
      .find({
        phoneNumber: Number(search),
      })
      .populate([
        "saledCourse.RCourseId",
        "saledCourse.LCourseId",
        "saledCourse.user_detail",
      ])
      .sort({ createdAt: -1 });

    if (agentPhone.length > 0) {
      for (let agent of agentPhone) {
        agentData.push(agent);
      }
    }

    if (agentData.length <= 0) {
      return next(new ErrorHandeler("User Not Found !", 500));
    }
  }

  // console.log(allCategory.saledCourse);
  res.status(200).json({
    success: true,
    message: "All Agents Fetched !!",
    agent: agentData,
  });
});

export const getAgentByReferId = catchAsyncError(async (req, res, next) => {
  const { referId } = req.params;

  if (!referId) {
    return next(new ErrorHandeler("Agent Id not Found !", 400));
  }

  const fetchAgent = await AgetSchema.findOne({ agent_id: referId })
    .populate([
      "saledCourse.RCourseId",
      "saledCourse.LCourseId",
      "saledCourse.user_detail",
    ])
    .sort({ createdAt: -1 });

  if (!fetchAgent) {
    res.status(200).json({
      success: false,
      message: "Agent Not Found !!",
    });
  }
  // console.log(allCategory.saledCourse);
  res.status(200).json({
    success: true,
    message: "All Agents Fetched !!",
    agent: fetchAgent,
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
