import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "Please Enter Course Title"],
    },
    intro_video: {
      type: String
    },
    description: {
      type: String
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    bundle_active: {
      type: Boolean,
      default: false
    },
    courses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
    liveCourses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "LiveCourse",
      },
    ],
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    image: {
      name: {
        type: String
      },
      url: {
        type: String,
      },
      path: {
        type: String
      }
    }

  },
  { timestamps: true }
);

export default mongoose.model("Bundle", BundleSchema);
