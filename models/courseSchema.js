import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    intro_video: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
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

    courseReview: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "UserSchema",
        },

        message: {
          type: String,
        },
      },
    ],

    course_overview: [
      {
        type: String,
      },
    ],

    blog_active: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
    },
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
    assessment: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "assesment",
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

    topic_covered: [
      {
        type: String,
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

    amount: {
      type: Number,
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
        video_url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
