import OrderItemDesktop from "./OrderItemDesktop";
import OrderItemMobile from "./OrderItemMobile";

const OrderItem = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "processing":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "confirmed":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <>
      {/* Mobile Layout  */}
      <OrderItemMobile order={order} getStatusColor={getStatusColor} />

      {/* Desktop Layout */}
      <OrderItemDesktop order={order} getStatusColor={getStatusColor} />
    </>
  );
};

export default OrderItem;
