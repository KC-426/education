import app from "./app.js";
import dotenv from "dotenv";
import connectDBS from "./config/connectDBS.js";
import Razorpay from "razorpay";

// Env Files Access
dotenv.config({
  path: "./config/config.env",
});

// Razor pay instance

export const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Handling Uncatch Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log(`Setting Down The Server Due to uncaught Exception Rejection. 1111`);
  process.exit(1);
});

// Connect from Database
connectDBS();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is Running on http://localhost:${process.env.PORT}`);
});

// console.log(server);

// Unhandeled Promiss Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log(`Setting Down The Server Due to Unhandled Promis Rejection. 1`);
  server.close(() => {
    process.exit(1);
  });
});