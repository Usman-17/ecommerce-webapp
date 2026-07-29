const coupons = [
  {
    code: "FREESHIP2000",
    type: "free_shipping",
    minSubtotal: 2000,
    description: "Free shipping on orders above Rs 2,000",
  },
];

export const validateCoupon = (code, subtotal) => {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
  );

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      message: `Minimum subtotal of Rs ${coupon.minSubtotal.toLocaleString("en-US")} required`,
    };
  }

  return { valid: true, coupon, message: "Coupon applied successfully!" };
};
