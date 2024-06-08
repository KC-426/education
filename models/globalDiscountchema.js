import mongoose from "mongoose";

const globalDiscountSchema = new mongoose.Schema(
  {
    isFlatDiscount: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: String,
    },

  },
  { timestamps: true }
);

export default mongoose.model("globalDiscount", globalDiscountSchema);
