import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },

  RCourseId: { type: mongoose.Schema.ObjectId, ref: "Course" },

  LCourseId: { type: mongoose.Schema.ObjectId, ref: "LiveCourse" },

  user_detail: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema',
    // requried: true
  }
}, {timestamps: true});

export default mongoose.model("Enquiry", enquirySchema);
