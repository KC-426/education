import mongoose from "mongoose";
const withDrawEnqery = new mongoose.Schema(
    {
        withDrawAmount: {
          type: String
        },
        user_detail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSchema"
        }
    }, {timestamps: true}
)

export default mongoose.model("WithdrawEnquery", withDrawEnqery)