import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  courseName: {
    type: String
  },
  rating: {
    type: Number
  },
user_detail: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'UserSchema'
},

RCourseId: { type: mongoose.Schema.ObjectId, ref: "Course" },

LCourseId: { type: mongoose.Schema.ObjectId, ref: "LiveCourse" },
});

export default mongoose.model("Testimonial", testimonialSchema);