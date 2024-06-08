import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  }
}, {timestamps: true});

export default mongoose.model("Faq", faqSchema);