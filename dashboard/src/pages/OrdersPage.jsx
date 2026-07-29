import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Ban,
  CheckCircle,
  ChevronDown,
  Truck,
  Users,
} from "lucide-react";

import CustomTable from "../components/CustomTable";
import SummaryCard from "../components/SummaryCard";
import SectionHeading from "../components/SectionHeading";
import FullScreenModal from "../components/FullScreenModal";

import useGlobalFilter from "../hooks/useGlobalFilter";
import { useGetAllOrders } from "../hooks/useGetAllOrders";
// Imports End-----

const statusOptions = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
  Shipped: "bg-blue-100 text-blue-700",
  Packing: "bg-yellow-100 text-yellow-700",
  "Out for delivery": "bg-orange-100 text-orange-700",
  "Order Placed": "bg-gray-100 text-gray-600",
};

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const { orders = [], error, isLoading, isError } = useGetAllOrders();

  const [searchParams, setSearchParams] = useSearchParams();

  const [globalSearch, setGlobalSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [statusFilter, setStatusFilter] = useState(() => {
    const param = searchParams.get("status");
    if (param === "pending") return "Pending";
    if (param === "delivered") return "Delivered";
    if (param === "cancelled") return "Cancelled";
    return null;
  });

  useEffect(() => {
    setViewOrder(null);
    setStatusDropdown(false);
    const param = searchParams.get("status");
    if (param === "pending") setStatusFilter("Pending");
    else if (param === "delivered") setStatusFilter("Delivered");
    else if (param === "cancelled") setStatusFilter("Cancelled");
    else setStatusFilter(null);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
  const pendingOrders = orders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status),
  ).length;

  const statusFilteredOrders = statusFilter
    ? statusFilter === "Pending"
      ? orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status))
      : orders.filter((o) => o.status === statusFilter)
    : orders;

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await fetch(`/api/order/status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      return res.json();
    },
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries(["orders"]);
      const previousOrders = queryClient.getQueryData(["orders"]);
      queryClient.setQueryData(["orders"], (oldOrders) =>
        oldOrders?.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );
      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["orders"], context.previousOrders);
      toast.error("Failed to update order status");
    },
    onSettled: () => queryClient.invalidateQueries(["orders"]),
    onSuccess: () => toast.success("Order status updated"),
  });

  const filteredData = useGlobalFilter(statusFilteredOrders, globalSearch, [
    "sr",
    "customerName",
    "customerPhone",
    "amountStr",
    "status",
  ]);

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "sr",
      key: "sr",
      width: 60,
      align: "center",
      sorter: (a, b) => a.sr - b.sr,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
      render: (_, record) => (
        <div>
          <p className="font-medium text-gray-900">{record.customerName}</p>
          {record.customerPhone && (
            <p className="text-xs text-gray-400">{record.customerPhone}</p>
          )}
        </div>
      ),
    },
    {
      title: "Products",
      dataIndex: "itemsCount",
      key: "products",
      align: "center",
      sorter: (a, b) => a.itemsCount - b.itemsCount,
      render: (_, record) => (
        <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {record.itemsCount} item(s)
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (_, record) => (
        <span className="font-semibold text-right block">
          Rs. {record.amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "dateFormatted",
      key: "dateFormatted",
      sorter: (a, b) => a.date - b.date,
      render: (_, record) => (
        <span className="block text-right">{record.dateFormatted}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (_, record) => (
        <div className="flex justify-center">
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[record.status] || "bg-yellow-100 text-yellow-700"}`}
          >
            {record.status}
          </span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <button
            title="View"
            onClick={() => setViewOrder(record)}
            className="p-2 rounded-full border border-gray-300 bg-white text-(--secondary-color) hover:bg-[color-mix(in_srgb,var(--secondary-color)_8%,transparent)] transition-colors cursor-pointer"
          >
            <ArrowUpRight size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <SectionHeading
        title={statusFilter ? `${statusFilter} Orders` : "Orders List"}
        subtitle="Manage all users orders below"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <SummaryCard
          icon={Users}
          title="Total Orders"
          count={totalOrders}
          color="#3B82F6"
          active={statusFilter === null}
          onClick={() => {
            setStatusFilter(null);
            setSearchParams({});
          }}
        />
        <SummaryCard
          icon={CheckCircle}
          title="Delivered"
          count={deliveredOrders}
          color="#10B981"
          active={statusFilter === "Delivered"}
          onClick={() => {
            setStatusFilter("Delivered");
            setSearchParams({ status: "delivered" });
          }}
        />
        <SummaryCard
          icon={Truck}
          title="Pending"
          count={pendingOrders}
          color="#F59E0B"
          active={statusFilter === "Pending"}
          onClick={() => {
            setStatusFilter("Pending");
            setSearchParams({ status: "pending" });
          }}
        />
        <SummaryCard
          icon={Ban}
          title="Cancelled"
          count={cancelledOrders}
          color="#EF4444"
          active={statusFilter === "Cancelled"}
          onClick={() => {
            setStatusFilter("Cancelled");
            setSearchParams({ status: "cancelled" });
          }}
        />
      </div>

      <CustomTable
        loading={isLoading}
        isError={isError}
        error={error}
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        searchPlaceholder="Search orders..."
      />

      {/* View Order Modal */}
      <FullScreenModal
        open={!!viewOrder}
        onClose={() => setViewOrder(null)}
        title="Order Details"
        subtitle="Manage order details below"
      >
        {viewOrder && (
          <div className="pb-4">
            {/* Top Summary Strip */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-sm text-gray-400">
                {new Date(viewOrder.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <div className="flex-1" />
              <span
                className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg ${statusColors[viewOrder.status] || "bg-yellow-100 text-yellow-700"}`}
              >
                {viewOrder.status}
              </span>
              <div className="h-5 w-px bg-gray-200" />
              <span className="text-2xl font-bold text-gray-900">
                Rs. {viewOrder.amount.toLocaleString()}
              </span>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Items (2 cols wide) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-(--secondary-color) text-white flex items-center justify-center font-semibold text-sm">
                        {viewOrder.address.firstName?.[0]}
                        {viewOrder.address.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {viewOrder.address.firstName}{" "}
                          {viewOrder.address.lastName}
                        </h3>
                        {viewOrder.address.email && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {viewOrder.address.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {viewOrder.address.phone}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {viewOrder.address.address}, {viewOrder.address.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Items ({viewOrder.items.length})
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {viewOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          {item.productImages?.[0]?.url ? (
                            <img
                              src={item.productImages[0].url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-[15px]">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm text-gray-500">
                              Rs. {item.price.toLocaleString()}
                            </span>
                            <span className="text-gray-300">×</span>
                            <span className="text-sm text-gray-500">
                              {item.quantity}
                            </span>
                            {item.variantName && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium">
                                  {item.variantName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Sidebar Info */}
              <div className="space-y-4">
                {/* Payment */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Method</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {viewOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Items</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {viewOrder.items.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Quantity</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {viewOrder.items.reduce(
                          (sum, i) => sum + i.quantity,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {viewOrder.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Order Status
                  </h3>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setStatusDropdown(!statusDropdown)}
                      className={`w-full flex items-center justify-between text-sm font-semibold border border-gray-200 rounded-xl px-3 py-3 focus:outline-none transition-all cursor-pointer hover:border-gray-300 ${statusColors[viewOrder.status] || "bg-yellow-50 text-yellow-700 border-yellow-200"}`}
                    >
                      {viewOrder.status}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${statusDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {statusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        {statusOptions.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              if (s !== viewOrder.status) {
                                updateStatus({
                                  orderId: viewOrder._id,
                                  status: s,
                                });
                                setViewOrder((prev) => ({
                                  ...prev,
                                  status: s,
                                }));
                              }
                              setStatusDropdown(false);
                            }}
                            className={`w-full text-left text-sm font-medium px-3 py-2.5 transition-colors cursor-pointer ${
                              viewOrder.status === s
                                ? `${statusColors[s] || "bg-yellow-50 text-yellow-700"} font-semibold`
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Updated {new Date(viewOrder.updatedAt).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(viewOrder.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Quick Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Order Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Placed on</span>
                      <span className="text-gray-600 font-medium">
                        {new Date(viewOrder.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment</span>
                      <span className="text-gray-600 font-medium">
                        {viewOrder.payment ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FullScreenModal>
    </>
  );
};

export default OrdersPage;
