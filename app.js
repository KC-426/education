import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import errors from "./middleWare/errors.js";

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// For Srver Testing
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, Message: "Server is Working Fine !!!" });
});

// Import of Router
import userRoutes from "./routes/userRoute.js";
import superAdminRoute from "./routes/superAdminRoutes.js";
import courseRoute from "./routes/courseRoute.js";
import liveCourseRoute from "./routes/liveCourseRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import categoryRoute from "./routes/categoryRoutes.js";
import testimonialRoute from "./routes/testimonialRoutes.js";
import faqRoute from "./routes/faqRoutes.js";
import enquiryRoute from "./routes/enquiryRoute.js";
import teacherRoute from "./routes/teacherRoute.js";
import agentRoute from "./routes/agetntRoutes.js";
import bundleRoute from "./routes/bundleRoutes.js";
import discountRoute from "./routes/discountRoutes.js";
import withDrawEnqeryRoute from "./routes/withDrawEnqueryRoute.js";
import assesmentRoutes from "./routes/assesmentRoutes.js";

// App Router
app.use("/api/v1", superAdminRoute);
app.use("/api/v1", userRoutes);
app.use("/api/v1", courseRoute);
app.use("/api/v1", liveCourseRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", enquiryRoute);
app.use("/api/v1", bundleRoute);
//teacher route
app.use("/api/v1/", teacherRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", testimonialRoute);
app.use("/api/v1", faqRoute);
app.use("/api/v1", agentRoute);
app.use("/api/v1", withDrawEnqeryRoute);

//assesment---
app.use("/api/v1", assesmentRoutes);

//discount router
app.use("/api/v1", discountRoute);
// For Mongose Error Check
app.use(errors);

export default app;
