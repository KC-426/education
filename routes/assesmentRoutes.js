import express from "express";

import { getAssesment,createAssement,DeleteAssesment, updateAssignment, submitAssessment, getCategoryById, getAssessmentById } from "../controller/assesmentController.js";


const router = express.Router();

import {superAdmin, userAuth} from '../middleWare/auth.js'

// create assesment
router.route("/add_assesment").post(superAdmin,createAssement);

// get assesment

router.route("/get_assesment").get(getAssesment);



router.route("/delete_assesment/:id").delete(superAdmin,DeleteAssesment);
//update
router.route("/update_assesment/:id").post(superAdmin,updateAssignment);


router.route("/get_assesment_by_id/:id").get(getAssessmentById);

router.route("/submit_assessment").post(submitAssessment);


export default router;