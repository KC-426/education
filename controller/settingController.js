
import catchAsyncError from "../utils/catchAsyncError.js";
import globalDiscountchema from '../models/globalDiscountchema.js'

export const createDiscount = catchAsyncError(async (req, res, next) => {
    const { discount, isFlatDiscount } = req.body;

    if (!discount) {
        return next(new ErrorHandeler("Please Fill the all Required Fields", 500));
    }

    const stuDis = await globalDiscountchema.find();

    if (stuDis.length <= 0) {
        const discountres = await globalDiscountchema.create({
            discount, isFlatDiscount
        });

        return res.status(200).json({
            success: true,
            message: "Discount Created Successful",
            discountresponse: discountres,
        });
    }

    const dis = await globalDiscountchema.findById(stuDis[0]._id);
    dis.isFlatDiscount = isFlatDiscount;
    dis.discount = discount;

    await dis.save();

    res.status(200).json({
        success: true,
        message: "Discount Created Successful",
        discountresponse: dis,
    });

})


export const getStudentDiscount = catchAsyncError(async (req, res, next) => {

    const stuDis = await globalDiscountchema.find();

    return res.status(200).json({
        success: true,
        message: "Discount Created Successful",
        discountresponse: stuDis,
    });

});