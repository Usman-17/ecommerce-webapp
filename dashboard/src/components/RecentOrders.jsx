import { Link } from "react-router-dom";
import moment from "moment";

const RecentOrders = ({ orders }) => {
  return (
    <div className="overflow-x-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        <div className="flex items-center gap-3">
          <Link to="/orders">
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 cursor-pointer">
              See all orders
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 ">
          <thead className="bg-gray-50  text-xs uppercase text-gray-700 ">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Mobile</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order._id} className="border-b ">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 ">
                  {order.address?.firstName}
                  {order.address?.lastName}
                </td>
                <td className="px-6 py-4">{order.address?.phone}</td>
                <td className="px-6 py-4 text-center">{order.items?.length}</td>
                <td className="px-6 py-4">
                  Rs.{" "}
                  {(
                    order.amount + (order.shippingCharge || 0)
                  ).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Order Placed"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {moment(order.date).format("DD MMM YYYY, hh:mm A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
