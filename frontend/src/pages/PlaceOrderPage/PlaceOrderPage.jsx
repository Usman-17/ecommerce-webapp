/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import { validateCoupon } from "../../utils/coupons";
import { getCart, removeCart } from "../../utils/cartStorage";
import { errorVibrate, successVibrate, vibrate } from "../../utils/vibrate";

import {
  getInMemoryData,
  removeInMemoryData,
} from "../../services/storageService";

import useEcommerce from "../../hooks/useEcommerce";
import { useUser } from "../../hooks/useUser";

import DeliveryInfo from "./components/DeliveryInfo";
import OrderSummary from "./components/OrderSummary";
import SuccessModal from "./components/SuccessModal";
import CheckoutStepper from "./components/CheckoutStepper";
import CheckoutBottomBar from "./components/CheckoutBottomBar";
import SuggestedProducts from "./components/SuggestedProducts";
import MobileOrderSummary from "./components/MobileOrderSummary";
import PaymentModeSelector from "./components/PaymentModeSelector";
import DeliveryTypeSelector from "./components/DeliveryTypeSelector";
// Imports End------

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useUser();

  const { trackBeginCheckout, trackPurchase } = useEcommerce();

  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("appliedCoupon"));
      if (saved) setCouponSuccess("Coupon applied successfully!");
      return saved || null;
    } catch {
      return null;
    }
  });
  const [couponCode, setCouponCode] = useState(() => appliedCoupon?.code || "");

  // Address Management
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [shakeSignal, setShakeSignal] = useState(0);

  // Get All Cities
  const isPickUp = false;

  const handleSaveManualAddress = async () => {
    try {
      const { userName, contactNo, contactAddress, city } = formik.values;

      if (
        !userName?.trim() ||
        !contactNo?.trim() ||
        !contactAddress?.trim() ||
        !city?.trim()
      ) {
        formik.setTouched({
          userName: true,
          contactNo: true,
          contactEmail: true,
          contactAddress: true,
          city: true,
        });
        toast.error("Please fill all required fields", {
          id: "save-address-error",
        });
        setShakeSignal((s) => s + 1);
        return false;
      }

      if (!/^03[0-9]{9}$/.test(contactNo)) {
        formik.setTouched({ contactNo: true });
        toast.error("Please enter a valid phone number (03XXXXXXXXX)", {
          id: "save-address-error",
        });
        setShakeSignal((s) => s + 1);
        return false;
      }

      const newAddress = {
        id: `addr-${addresses.length}`,
        name: formik.values.userName,
        phone: formik.values.contactNo,
        email: formik.values.contactEmail,
        address: formik.values.contactAddress,
        city: formik.values.city,
        isDefault: addresses.length === 0,
      };

      const updatedAddresses = [newAddress, ...addresses];
      setAddresses(updatedAddresses);
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
      setSelectedAddress(newAddress);
      setIsChangingAddress(false);
      toast.success("Address saved successfully!");
      document
        .getElementById("payment-method")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return true;
    } catch (err) {
      console.error("Save address error:", err);
      toast.error("Something went wrong. Please try again.");
      return false;
    }
  };

  const validationSchema = Yup.object({
    userName: Yup.string().required("Full Name is required"),
    contactEmail: Yup.string().email("Invalid email address"),
    contactAddress: isPickUp
      ? Yup.string().notRequired()
      : Yup.string().required("Complete Address is required"),
    city: Yup.string().required("City is required"),
    contactNo: Yup.string()
      .matches(/^03[0-9]{9}$/, "Must be a valid Pakistani number")
      .required("Contact Number is required"),
    saleRemarks: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      contactEmail: "",
      contactAddress: "",
      city: "",
      contactNo: "",
      saleRemarks: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (!itemsToShow.length) {
        toast.error("No items in your order!", { id: "checkout-error" });
        errorVibrate();
        return;
      }

      const cart = {};
      itemsToShow.forEach((item) => {
        const productId = item.productId;
        if (item.variantId) {
          if (!cart[productId]) cart[productId] = {};
          cart[productId][item.variantId] = item.quantity;
        } else {
          cart[productId] = item.quantity;
        }
      });

      const payload = {
        cart,
        totalAmount: total,
        shippingCharge: shippingFee,
        deliveryInfo: {
          firstName: values.userName?.split(" ")[0] || values.userName,
          lastName: values.userName?.split(" ").slice(1).join(" ") || "",
          email: values.contactEmail,
          address: values.contactAddress,
          city: values.city,
          phone: values.contactNo,
        },
      };

      if (scoopData) {
        payload.scoop = {
          type: scoopData.scoopType,
          quantity: scoopData.quantity,
          fixedPrice: scoopData.totalAmount,
          selections: scoopData.selections,
          products:
            scoopData.scoopProducts?.map((p) => {
              const instanceId = p._instanceId || p._id;
              const selectedVariant =
                scoopData.selectedVariants?.[instanceId] || null;
              return {
                productId: p._id,
                title: p.title,
                productImages: p.productImages,
                selectedVariant,
              };
            }) || [],
        };
      }

      if (dealData) {
        payload.deal = {
          dealId: dealData.dealId,
          dealType: dealData.dealType,
          fixedPrice: dealData.totalAmount,
          products:
            dealData.dealProducts?.map((p) => ({
              productId: p._id,
              title: p.title,
              productImages: p.productImages,
              selectedVariant: p.selectedVariant || null,
            })) || [],
        };
      }

      saveOrder(payload);
    },
  });

  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    vibrate(30);
    setCouponError(""); // press feedback

    if (!isPickUp && !selectedAddress) {
      toast.error("Please add a delivery address to proceed!", {
        id: "checkout-error",
      });
      errorVibrate();
      return;
    }

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      // Mark fields as touched to show inline errors
      const touchedFields = Object.keys(errors).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      formik.setTouched(touchedFields);

      if (errors.userName && errors.contactNo) {
        toast.error("Full Name and Contact Number are required!", {
          id: "checkout-error",
        });
      } else {
        const firstError = Object.values(errors)[0];
        toast.error(firstError, { id: "checkout-error" });
      }
      errorVibrate();
      return;
    }

    trackBeginCheckout(itemsToShow, total);
    formik.handleSubmit();
  };

  // Load product/cart items
  const [buyNowItem] = useState(() => getInMemoryData("buyNowItem"));
  const [cartItems] = useState(() => getCart());

  // Scoop data from ScoopPage (passed via navigate state)
  const scoopData = location.state?.scoopProducts ? location.state : null;

  // Deal data from DealDetailPage (passed via navigate state)
  const dealData = location.state?.dealProducts ? location.state : null;

  // Detect if items are deal items from cart
  const isDealFromCart =
    !dealData &&
    !scoopData &&
    cartItems.length > 0 &&
    cartItems.every((item) => item.isDealItem);

  const computedOrderType = scoopData
    ? "scoop"
    : dealData || isDealFromCart
      ? "deal"
      : "normal";

  const itemsToShow = scoopData
    ? scoopData.scoopProducts.map((p) => {
        const instanceId = p._instanceId || p._id;
        const selectedVariant =
          scoopData.selectedVariants?.[instanceId] || null;
        return {
          productId: p._id,
          variantId: selectedVariant?._id || null,
          name: p.title,
          price: 0,
          quantity: 1,
          total: 0,
          image: p.productImages?.[0]?.url || "",
          variantImage: selectedVariant?.image?.url || "",
          selectedVariants: selectedVariant
            ? [{ detailName: selectedVariant.name }]
            : [],
          _scoopInstanceId: instanceId,
        };
      })
    : dealData
      ? [
          {
            productId: dealData.dealId,
            variantId: null,
            name: dealData.dealType,
            price: dealData.totalAmount / (dealData.dealQuantity || 1),
            quantity: dealData.dealQuantity || 1,
            total: dealData.totalAmount,
            image: dealData.dealImage || "",
            selectedVariants: [],
            isDealItem: true,
          },
        ]
      : buyNowItem
        ? [buyNowItem]
        : cartItems;

  const estimatedArrival =
    moment().add(2, "days").format("DD MMM") +
    " - " +
    moment().add(3, "days").format("DD MMM");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    // Clear coupon for Buy Now, Scoop, or Deal orders
    if (buyNowItem || scoopData || dealData) {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponSuccess("");
      setCouponError("");
      localStorage.removeItem("appliedCoupon");
    }

    return () => {
      removeInMemoryData("buyNowItem");
    };
  }, []);

  // Save Order Mutation
  const {
    mutate: saveOrder,
    isPending,
    isSuccess,
    data: savedOrderResponse,
  } = useMutation({
    mutationFn: async (orderData) => {
      const res = await fetch("/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to place order");
      }

      return json;
    },

    onSuccess: (data) => {
      removeCart();
      localStorage.removeItem("appliedCoupon");
      window.dispatchEvent(new Event("cartUpdated"));
      successVibrate();
      trackPurchase({
        transactionId: data?.id || String(Date.now()),
        items: itemsToShow.map((item) => ({
          name: item.name || item.productName,
          productId: item.productId,
          productPackId: item.packId || item.selectedOptions?.pack,
          category: item.category || "",
          subCategory: item.subCategory || "",
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingFee,
        discount: 0,
        total,
      });
    },

    onError: (error) => {
      errorVibrate();
      if (error.status === 500) {
        toast.error(
          "Internal Server Error (500). Please try again later or contact support.",
        );
      } else {
        toast.error(
          error.message || "Failed to place order! Please try again.",
        );
      }
    },
  });

  // Set selected address on mount
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      const id = setTimeout(() => setSelectedAddress(defaultAddr), 0);
      return () => clearTimeout(id);
    }

    // No saved addresses — auto-fill from logged-in user profile
    if (authUser) {
      formik.setValues({
        userName: authUser.fullName || "",
        contactEmail: authUser.email || "",
        contactAddress: "",
        city: "",
        contactNo: authUser.mobile || "",
        saleRemarks: "",
      });
    }
  }, []);

  // Sync Formik with Selected Address
  useEffect(() => {
    if (selectedAddress && !isChangingAddress) {
      formik.setValues({
        ...formik.values,
        userName: selectedAddress.name || "",
        contactNo: selectedAddress.phone || "",
        contactEmail: selectedAddress.email || "",
        contactAddress: selectedAddress.address || "",
        city: selectedAddress.city || "",
      });
    }
  }, [selectedAddress, isChangingAddress]);

  // Lock scroll when success modal is open
  useEffect(() => {
    if (isSuccess) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSuccess]);

  // Calculate totals
  const subtotal = scoopData
    ? scoopData.totalAmount
    : dealData
      ? dealData.totalAmount
      : itemsToShow.reduce((sum, item) => sum + (item.total || 0), 0);

  const FREE_SHIPPING_THRESHOLD = 5000;
  const MIN_ORDER_AMOUNT = 500;

  const shippingFee =
    isPickUp ||
    subtotal >= FREE_SHIPPING_THRESHOLD ||
    (appliedCoupon?.type === "free_shipping" &&
      subtotal >= appliedCoupon.minSubtotal)
      ? 0
      : 250;
  const total = subtotal + shippingFee;

  const isBelowMinimum = subtotal < MIN_ORDER_AMOUNT;

  const handleApplyCoupon = () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponError("Please enter a coupon code");
      setCouponSuccess("");
      setAppliedCoupon(null);
      return;
    }

    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setCouponError("");
      setCouponSuccess(result.message);
      setAppliedCoupon(result.coupon);
      localStorage.setItem(
        "appliedCoupon",
        JSON.stringify({ ...result.coupon, code }),
      );
    } else {
      setCouponError(result.message);
      setCouponSuccess("");
      setAppliedCoupon(null);
      localStorage.removeItem("appliedCoupon");
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen -mt-1 sm:mt-0 pb-18 sm:pb-0"
    >
      <CheckoutStepper currentStep={selectedAddress ? 3 : 2} />

      <div className="sm:px-[4vw] sm:py-6 mb-6">
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4"
        >
          {/* Left Column: Delivery Details */}
          <div className="lg:col-span-7">
            <div className="space-y-3 lg:space-y-4">
              {/* Combined Delivery & Payment Card */}
              <div className="bg-white p-4 sm:p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 space-y-8">
                <DeliveryTypeSelector />

                {!isPickUp && (
                  <div
                    id="payment-method"
                    className="pt-4 border-t border-gray-100"
                  >
                    <PaymentModeSelector />
                  </div>
                )}
              </div>

              <DeliveryInfo
                formik={formik}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                addresses={addresses}
                isChangingAddress={isChangingAddress}
                setIsChangingAddress={setIsChangingAddress}
                onSaveAddress={handleSaveManualAddress}
                shakeSignal={shakeSignal}
              />
            </div>

            {/* Mobile Order Summary (Visible only on Mobile */}
            <MobileOrderSummary
              itemsToShow={itemsToShow}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              isBelowMinimum={isBelowMinimum}
              minOrderAmount={MIN_ORDER_AMOUNT}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponError={couponError}
              couponSuccess={couponSuccess}
              onApplyCoupon={handleApplyCoupon}
              orderType={computedOrderType}
              scoopType={scoopData?.scoopType}
              dealType="Deal"
            />
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="lg:col-span-5 space-y-0 sm:space-y-6 lg:sticky lg:top-4 h-fit">
            {/* Order Summary Card */}
            <OrderSummary
              itemsToShow={itemsToShow}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              isPending={isPending}
              isDisabled={isBelowMinimum}
              onSubmit={handlePlaceOrder}
              isBelowMinimum={isBelowMinimum}
              minOrderAmount={MIN_ORDER_AMOUNT}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponError={couponError}
              couponSuccess={couponSuccess}
              onApplyCoupon={handleApplyCoupon}
              orderType={computedOrderType}
              scoopType={scoopData?.scoopType}
              dealType="Deal"
            />

            {isBelowMinimum && <SuggestedProducts currentItems={itemsToShow} />}
          </div>
        </form>
      </div>

      <SuccessModal
        isSuccess={isSuccess}
        navigate={navigate}
        savedOrderResponse={savedOrderResponse}
        userName={formik.values.userName}
        estimatedArrival={estimatedArrival}
        total={total}
      />

      {/* Mobile Bottom Bar — hidden on desktop */}
      <CheckoutBottomBar
        total={total}
        isPending={isPending}
        isDisabled={isBelowMinimum}
        onSubmit={handlePlaceOrder}
        isBelowMinimum={isBelowMinimum}
        minOrderAmount={MIN_ORDER_AMOUNT}
        subtotal={subtotal}
      />
    </Motion.div>
  );
};

export default PlaceOrderPage;
