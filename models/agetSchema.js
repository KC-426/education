import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name Cannot Exceed 30 Character"],
      minLength: [3, "Name Cannot Less than 3 Character"],
    },

    agent_id: {
      type: String,
    },

    email: {
      type: String,
    },

    isFlatDiscount: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: String,
    },

    phoneNumber: {
      type: Number,
    },

    saledCourse: [
      {
        RCourseId: { type: mongoose.Schema.ObjectId, ref: "Course" },
        LCourseId: { type: mongoose.Schema.ObjectId, ref: "LiveCourse" },
        BCourseId: { type: mongoose.Schema.ObjectId, ref: "Bundle" },
        user_detail: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserSchema",
        },
        paymentDetail: {
          paymentId: {
            type: String,
            required: [true, "Please Enter Your Email."],
          },
          
          payedAmount: {
            type: Number,
          },
          totalAmount: {
            type: Number,
          },
          isFlatDiscount: {
            type: Boolean,
            default: false,
          },
      
          discount: {
            type: String,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Agents", agentSchema);
