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
  Sparkles,
  ShoppingBag,
  Tag,
  TrendingUp,
  RefreshCw,
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
  const {
    orders = [],
    error,
    isLoading,
    isError,
    isRefetching,
  } = useGetAllOrders();

  const [searchParams, setSearchParams] = useSearchParams();

  const [globalSearch, setGlobalSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [dateFrom, setDateFrom] = useState(() => {
    const now = new Date();
    const year =
      now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-07-01`;
  });
  const [dateTo, setDateTo] = useState(() => {
    const now = new Date();
    const year =
      now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
    return `${year}-06-30`;
  });
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

  const dateFilteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.date);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (orderDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (orderDate > to) return false;
    }
    return true;
  });

  const totalOrders = dateFilteredOrders.length;
  const deliveredOrders = dateFilteredOrders.filter(
    (o) => o.status === "Delivered",
  ).length;
  const cancelledOrders = dateFilteredOrders.filter(
    (o) => o.status === "Cancelled",
  ).length;
  const pendingOrders = dateFilteredOrders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status),
  ).length;

  const totalProfit = dateFilteredOrders.reduce(
    (sum, o) => sum + (o.profit ?? 0),
    0,
  );

  const statusFilteredOrders = statusFilter
    ? statusFilter === "Pending"
      ? dateFilteredOrders.filter(
          (o) => !["Delivered", "Cancelled"].includes(o.status),
        )
      : dateFilteredOrders.filter((o) => o.status === statusFilter)
    : dateFilteredOrders;

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
    "orderTypeLabel",
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
      title: "Type",
      dataIndex: "orderType",
      key: "orderType",
      width: 120,
      align: "center",
      sorter: (a, b) => a.orderType.localeCompare(b.orderType),
      render: (_, record) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            record.orderType === "scoop"
              ? "bg-accent/10 text-accent"
              : record.orderType === "deal"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {record.orderType === "scoop" ? (
            <Sparkles size={10} />
          ) : record.orderType === "deal" ? (
            <Tag size={10} />
          ) : (
            <ShoppingBag size={10} />
          )}
          {record.orderTypeLabel}
        </span>
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
      sorter: (a, b) =>
        a.amount +
        (a.shippingCharge || 0) -
        (b.amount + (b.shippingCharge || 0)),
      render: (_, record) => (
        <span className="font-semibold text-right block">
          Rs. {(record.amount + (record.shippingCharge || 0)).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "dateFormatted",
      key: "dateFormatted",
      sorter: (a, b) => a.date - b.date,
      render: (_, record) => (
        <div className="text-right">
          <p className="text-sm text-gray-900">{record.dateFormatted}</p>
          <p className="text-xs text-gray-400">{record.timeFormatted}</p>
        </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
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
        <SummaryCard
          icon={TrendingUp}
          title="Total Profit"
          count={`Rs. ${totalProfit.toLocaleString()}`}
          color="#10B981"
        />
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm text-gray-500 font-medium">
          Filter by date:
        </span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-(--secondary-color) cursor-pointer"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-(--secondary-color) cursor-pointer"
        />
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
          >
            Clear
          </button>
        )}

        <div className="flex-1" />
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["orders"] })
          }
          disabled={isLoading || isRefetching}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
          Refresh
        </button>
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
                {" at "}
                {new Date(viewOrder.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  viewOrder.orderType === "scoop"
                    ? "bg-accent/10 text-accent"
                    : viewOrder.orderType === "deal"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {viewOrder.orderType === "scoop" ? (
                  <Sparkles size={10} />
                ) : viewOrder.orderType === "deal" ? (
                  <Tag size={10} />
                ) : (
                  <ShoppingBag size={10} />
                )}
                {viewOrder.orderTypeLabel}
              </span>
              <div className="flex-1" />
              <span
                className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg ${statusColors[viewOrder.status] || "bg-yellow-100 text-yellow-700"}`}
              >
                {viewOrder.status}
              </span>
              <div className="h-5 w-px bg-gray-200" />
              <span className="text-2xl font-bold text-gray-900">
                Rs.{" "}
                {(
                  viewOrder.amount + (viewOrder.shippingCharge || 0)
                ).toLocaleString()}
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
                  {viewOrder.items.length === 0 &&
                  viewOrder.orderType === "deal" ? (
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                      <Tag size={24} className="text-purple-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-purple-700">
                        {viewOrder.dealDetails?.dealType || "Deal Order"}
                      </p>
                      <p className="text-xs text-purple-400 mt-1">
                        Fixed price: Rs.{" "}
                        {viewOrder.dealDetails?.fixedPrice?.toLocaleString() ||
                          (
                            viewOrder.amount + (viewOrder.shippingCharge || 0)
                          )?.toLocaleString()}
                      </p>
                    </div>
                  ) : (
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
                            {item.purchasePrice > 0 && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">
                                  CP: Rs. {item.purchasePrice.toLocaleString()}
                                </span>
                                <span className="text-xs text-green-600 font-medium">
                                  Profit: Rs.{" "}
                                  {(
                                    (item.price - item.purchasePrice) *
                                    item.quantity
                                  ).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 whitespace-nowrap">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.purchasePrice > 0 && (
                            <span className="text-[10px] text-red-400 font-medium block text-right">
                              Cost: Rs. {item.purchasePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
                        Rs.{" "}
                        {(
                          viewOrder.amount + (viewOrder.shippingCharge || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                    {viewOrder.items.some((i) => i.purchasePrice > 0) && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Cost Price
                          </span>
                          <span className="text-sm font-semibold text-red-500">
                            Rs.{" "}
                            {(
                              viewOrder.totalPurchasePrice ||
                              viewOrder.items.reduce(
                                (sum, i) =>
                                  sum + (i.purchasePrice || 0) * i.quantity,
                                0,
                              )
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-green-600">
                            Profit
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            Rs.{" "}
                            {(
                              viewOrder.profit ??
                              viewOrder.amount +
                                (viewOrder.shippingCharge || 0) -
                                viewOrder.items.reduce(
                                  (sum, i) =>
                                    sum + (i.purchasePrice || 0) * i.quantity,
                                  0,
                                )
                            ).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Scoop Details (only for scoop orders) */}
                {viewOrder.orderType === "scoop" && viewOrder.scoopDetails && (
                  <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Scoop Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {viewOrder.scoopDetails.scoopType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Scoops</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {viewOrder.scoopDetails.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Fixed Price
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Rs.{" "}
                          {viewOrder.scoopDetails.fixedPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deal Details (only for deal orders) */}
                {viewOrder.orderType === "deal" && viewOrder.dealDetails && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Tag size={12} />
                      Deal Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {viewOrder.dealDetails.dealType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Fixed Price
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Rs.{" "}
                          {viewOrder.dealDetails.fixedPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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
