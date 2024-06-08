import mongoose from "mongoose";

const LiveCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter Course Title"],
    },

    intro_video: {
      type: String
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    blog_active: {
      type: Boolean,
      required: true,
      default: false,
    },

    description: {
      type: String,
      required: true,
    },
    inc_number: [
      {
        title: {
          type: String,
        },
        number: {
          type: String,
        },
        unit: {
          type: String,
        },
      },
    ],

    courseTeacher: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Teacher",
      },
    ],

    brochure: {
      name: {
        type: String,
      },
      url: {
        type: String,
      },
      path: {
        type: String,
      },
    },

    thumb_img: {
      name: {
        type: String,
      },
      url: {
        type: String,
      },
      path: {
        type: String,
      },
    },

    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],

    overview: [
      {
        type: String,
      },
    ],

    topic_covered: [
      {
        type: String,
      },
    ],

    faq: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Faq",
      },
    ],

    testimonials: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Testimonial",
      },
    ],

    certification: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        image: {
          name: {
            type: String,
          },
          url: {
            type: String,
          },
          path: {
            type: String,
          },
        },
      },
    ],

    timing: {
      type: String,
    },
    meet_url: {
      type: String,
    },
    intro_video: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },
    regularPrice: {
      type: Number,
    },
    topics: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("LiveCourse", LiveCourseSchema);
