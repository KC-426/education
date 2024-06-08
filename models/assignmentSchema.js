import mongoose from "mongoose";

const assignemntSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            // required: [true, "Please Enter Your Name"],
        },
        description: {
            type: String,
            // required: [true, "Please Enter Your Name"],
        },

        meta_title: {
            type: String,
            // required: [true, "Please Enter Your Name"],
        },
        meta_description: {
            type: String,
            // required: [true, "Please Enter Your Name"],
        },
        mcq: [{
            qus: {
                type: String,
            },
            totalMark: {
                type: Number,
            },
            options: [
                {
                    ans: {
                        type: String,
                    },
                    isTrue: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        }],
    },
    { timestamps: true }
);

export default mongoose.model("assesment", assignemntSchema);
