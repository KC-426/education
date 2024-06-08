import crypto from "crypto";

export const verifyRazerPay = async (
  order_id,
  payment_id,
  razorpay_signature
) => {
  const body = (await order_id) + "|" + payment_id;
  const expectedSignature = await crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature == razorpay_signature) {
    return true;
  } else {
    return false;
  }
};