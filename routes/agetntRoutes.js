import express from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controller/categoryController.js";
import { createAgent, deleteAgent, getAgent, updateAgent, getAgentByReferId } from "../controller/agentController.js";
const router = express.Router();

import {superAdmin, userAuth} from '../middleWare/auth.js'

// Add Category
router.route("/add_agent").post(superAdmin, createAgent);

// get category
router.route("/get_agent").get(superAdmin, getAgent);

// get category
router.route("/get_agent/:referId").get(userAuth, getAgentByReferId);

// get category by id
router.route("/get_category/:categoryId").get(getCategoryById);

// Update category
router.route(`/update_agent`).post(superAdmin, updateAgent);

//delete category
router.route("/agent_delete/:id").delete(superAdmin, deleteAgent);

export default router;