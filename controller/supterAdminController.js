import SuperAdminSchema from "../models/superAdminSchema.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandeler from "../utils/errorHandeler.js";
import SuperAdminTokenGenerator from "../utils/getJwtSuperAdmin.js";
 

// All Super Admin
export const AllSuperAdmin = catchAsyncError(async (req, res, next) => {
  const admins = await SuperAdminSchema.find();

  res.status(200).json({
    success: true,
    message: "Super Admin Fetched !!",
    admins,
  });
});

export const logOurSuperAdmin = catchAsyncError(async (req, res, next) => {
  const option = {
    maxAge: 0,
    sameSite: "none",
    secure: true,
    crossDomain: true,
  };

  res.cookie("jwt_su_adm_token", null, option);
  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
});

// Update Super Admin
export const updateSuperAdmin = catchAsyncError(async (req, res, next) => {
  const { _S_A_id, name, email, phoneNumber } = req.body;

  if (!_S_A_id) {
    return next(new ErrorHandeler("_ID is not Found !", 400));
  }

  const s_admin = await SuperAdminSchema.findById(_S_A_id);

  if (!s_admin) {
    return next(new ErrorHandeler("Admin not Found !", 400));
  }

  await SuperAdminSchema.findByIdAndUpdate(_S_A_id, {
    name,
    email,
    phoneNumber,
  });

  res.status(200).json({
    success: true,
    message: "Super Admin Updated Successful !!",
  });
});

// Login Super Admin
export const loginSuperAdmin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandeler("Please Fill All The Required Fields.", 400));
  }
  const superAdmin = await SuperAdminSchema.findOne({ email }).select(
    "+password"
  );

  if (!superAdmin) {
    return next(new ErrorHandeler("Super Admin not Found.", 400));
  }

  const isMatchPassword = await superAdmin.comparePassword(password);

  if (!isMatchPassword) {
    return next(new ErrorHandeler("Email or Password is Wrong.", 400));
  }

  superAdmin.password = null;

  SuperAdminTokenGenerator(superAdmin, 200, res);
});

export const fetchLoginSuperAdmin = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const admin = user;

  res.status(200).json({
    success: true,
    user: admin,
  });
});

// Create Super Admin
export const createSuperAdmin = catchAsyncError(async (req, res, next) => {
  const { name, email, phoneNumber, password, confirmPass } = req.body;

  if (!name || !email || !phoneNumber || !password || !confirmPass) {
    return next(
      new ErrorHandeler("Please Fill All The Required Fields !!", 400)
    );
  }

  if (password !== confirmPass) {
    return next(
      new ErrorHandeler("Password and Confirm Password is not Match !!", 400)
    );
  }

  const admins = await SuperAdminSchema.findOne({ email: email });

  console.log(admins);

  if (admins) {
    return next(new ErrorHandeler("Super Admin already exist !!", 400));
  }

  const admin = await SuperAdminSchema.create({
    name,
    email,
    phoneNumber,
    password,
  });

  res.status(200).json({
    success: true,
    message: "Super Admin Created !!",
    admin,
  });
});

//Super Admin password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldPass, password, confirmPass } = req.body;

  if (!oldPass || !password || !confirmPass) {
    new ErrorHandeler("Please Fill All The Required Fields !!", 400)
  }
  if (password !== confirmPass) {
    new ErrorHandeler("Passwor does'n match !!", 400)
  }

  const sAdmin = req.user;
  const adminsSuper = await SuperAdminSchema.findById(sAdmin._id).select('+password');

  console.log(adminsSuper);
  if (!adminsSuper) {
    return next(new ErrorHandeler("Super Admin not Found.", 400));
  }

  // const isMatchPassword = await adminsSuper.comparePassword(password);
  const isMatchPassword = await adminsSuper.comparePassword(oldPass);

  if (!isMatchPassword) {
    return next(new ErrorHandeler("Email or Password is Wrong.", 400));
  }

  adminsSuper.password = password;

  await adminsSuper.save();

  res.status(200).json({
    success: true,
    message: "Super Admin Created !!",
  });
});