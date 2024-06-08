import express from "express";
import {userAuth} from "../middleWare/auth.js"
import { allEnquery, deleteEnquery, createEnquery } from "../controller/withDrawController.js";


const router = express.Router()

router.route("/create_enquery").post(userAuth, createEnquery)

router.route("/get_enquery").get(allEnquery)

router.route("/delete_enquery/:id").delete(deleteEnquery)

export default router