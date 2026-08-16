import moment from "moment";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Package,
  Truck,
  XCircle,
  Banknote,
  CalendarDays,
  ChevronDown,
  Check,
} from "lucide-react";

import Card from "./components/Card";
import SaleCard from "./components/SaleCard";
import RecentOrders from "./components/RecentOrders";

import { useGetAllOrders } from "../../hooks/useGetAllOrders";
// Imports End----

const filterOptions = [
  { key: "today", label: "Today" },
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "thisYear", label: "This Year" },
  { key: "all", label: "All Time" },
];

const getDateRange = (key) => {
  switch (key) {
    case "today":
      return { start: moment().startOf("day"), label: "Today" };
    case "thisWeek":
      return { start: moment().startOf("week"), label: "This Week" };
    case "thisMonth":
      return { start: moment().startOf("month"), label: "This Month" };
    case "lastMonth":
      return {
        start: moment().startOf("month").subtract(1, "month"),
        end: moment().startOf("month").subtract(1, "day").endOf("day"),
        label: "Last Month",
      };
    case "thisYear":
      return { start: moment().startOf("year"), label: "This Year" };
    case "all":
      return { start: null, label: "All Time" };
    default:
      return { start: null, label: "All Time" };
  }
};

const isInRange = (date, range) => {
  if (!range.start) return true;
  const d = moment(date);
  if (range.end) {
    return d.isSameOrAfter(range.start) && d.isSameOrBefore(range.end);
  }
  return d.isSameOrAfter(range.start);
};

const DashboardPage = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { orders = [] } = useGetAllOrders();

  const range = useMemo(() => getDateRange(timeFilter), [timeFilter]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => isInRange(o.date, range)),
    [orders, range],
  );

  const stats = useMemo(() => {
    const fOrders = filteredOrders;
    const delivered = fOrders.filter((o) => o.status === "Delivered");
    const cancelled = fOrders.filter((o) => o.status === "Cancelled");

    const totalRevenue = delivered.reduce(
      (sum, o) => sum + (o.amount || 0) + (o.shippingCharge || 0),
      0,
    );
    const totalProfit = delivered.reduce(
      (sum, o) => sum + (o.profit || 0) - (o.extraExpense || 0),
      0,
    );
    const totalCostPrice = delivered.reduce(
      (sum, o) => sum + (o.totalPurchasePrice || 0),
      0,
    );
    const totalShipping = delivered.reduce(
      (sum, o) => sum + (o.shippingCharge || 0),
      0,
    );

    return {
      totalOrders: fOrders.length,
      delivered: delivered.length,
      cancelled: cancelled.length,
      totalRevenue,
      totalProfit,
      totalCostPrice,
      totalShipping,
    };
  }, [filteredOrders]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLabel =
    filterOptions.find((o) => o.key === timeFilter)?.label || "All Time";

  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <CalendarDays size={16} className="text-gray-400" />
            {currentLabel}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setTimeFilter(opt.key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                    timeFilter === opt.key
                      ? "bg-[#465FFF] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                  {timeFilter === opt.key && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          color="#465FFF"
        />
        <Card
          title="Delivered"
          value={stats.delivered}
          icon={Truck}
          color="#00B67A"
        />
        <Card
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          color="#EF4444"
        />
        <Card
          title="Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={Banknote}
          color="#F59E0B"
        />
      </div>

      {/* Profit Summary + Sale Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Profit Summary
          </h3>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium">Net Profit</p>
            <p className="text-xl font-bold text-green-700 mt-1">
              Rs. {stats.totalProfit.toLocaleString()}
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-medium">Cost Price</p>
            <p className="text-xl font-bold text-blue-700 mt-1">
              Rs. {stats.totalCostPrice.toLocaleString()}
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-xs text-orange-600 font-medium">Shipping</p>
            <p className="text-xl font-bold text-orange-700 mt-1">
              Rs. {stats.totalShipping.toLocaleString()}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs text-purple-600 font-medium">
              Avg Order Value
            </p>
            <p className="text-xl font-bold text-purple-700 mt-1">
              Rs.{" "}
              {(stats.totalRevenue / (stats.delivered || 1)).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <SaleCard orders={filteredOrders} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrders orders={filteredOrders} />
    </div>
  );
};

export default DashboardPage;
