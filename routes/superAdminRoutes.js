import {
    AllSuperAdmin,
    createSuperAdmin,
    fetchLoginSuperAdmin,
    logOurSuperAdmin,
    loginSuperAdmin,
    updatePassword,
    updateSuperAdmin,
  } from "../controller/supterAdminController.js";
  import express from "express";
  import { superAdmin } from "../middleWare/auth.js";
  const router = express.Router();
  
  //create Super Admin
  router.route("/create_super_admin").post(createSuperAdmin);
  
  //login super admin
  router.route("/login_super_admin").post(loginSuperAdmin);
  
  //Fetch login super admin
  router.route("/fetch_login_super_admin").post(superAdmin, fetchLoginSuperAdmin);
  
  //fetch Super Admin
  router.route("/all_admin").get(superAdmin, AllSuperAdmin);
  
  //Update super admin
  router.route("/update_super_admin").post(superAdmin, updateSuperAdmin);
  
  //Update super admin
  router.route("/logout_super_admin").post(superAdmin, logOurSuperAdmin);
  
  //Update Password
  router.route("/update_password").post(superAdmin,updatePassword)
  
  export default router;