import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  UserRound,
  LogOut,
  Menu,
  ChevronDown,
  Lock,
  Bell,
  Package,
} from "lucide-react";

import useLogout from "../hooks/useLogout";
import useGetAuth from "../hooks/useGetAuth";
import useNewOrders from "../hooks/useNewOrders";
import { useSidebar } from "../context/SidebarContext";
import ChangePasswordModal from "../components/ChangePasswordModal";
// Imports End----

const Header = () => {
  const { logoutMutation } = useLogout();
  const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
  const { data: authUser } = useGetAuth();
  const navigate = useNavigate();
  const { orders, unseenCount, markAsSeen } = useNewOrders();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 flex w-full bg-white z-99999 ${isMobileOpen ? "hidden" : ""}`}
      >
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          <div className="flex items-center justify-between w-full gap-2 px-3 py-1.5 border-b border-gray-200 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-2">
            {/* 1 Menu Button */}
            <button
              className="flex items-center justify-center w-9 h-9 text-gray-500 rounded-lg z-99999 transition-colors cursor-pointer hover:bg-gray-100 hover:text-gray-700"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            {/* Menu Button End */}

            <div className="flex items-center justify-end gap-3">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    if (!notifOpen) markAsSeen();
                  }}
                  className="relative flex items-center justify-center w-9 h-9 text-gray-500 rounded-lg transition-colors cursor-pointer hover:bg-gray-100 hover:text-gray-700"
                >
                  <Bell size={20} />
                  {unseenCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {unseenCount > 99 ? "99+" : unseenCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        New Orders
                      </p>
                      <span className="text-xs text-gray-500">
                        Last 24 hours
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {orders.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-400">
                          No new orders
                        </div>
                      ) : (
                        orders.map((order) => (
                          <button
                            key={order.id}
                            onClick={() => {
                              setNotifOpen(false);
                              navigate("/orders");
                            }}
                            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0 text-left"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <Package size={16} className="text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {order.customerName || "Customer"}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {order.itemsCount} item
                                {order.itemsCount !== 1 ? "s" : ""} · Rs{" "}
                                {order.amount?.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                    order.status === "Order Placed"
                                      ? "bg-blue-100 text-blue-700"
                                      : order.status === "Shipped"
                                        ? "bg-purple-100 text-purple-700"
                                        : order.status === "Delivered"
                                          ? "bg-green-100 text-green-700"
                                          : order.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {order.status}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {order.timeAgo}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    {orders.length > 0 && (
                      <div className="px-4 py-2.5 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/orders");
                          }}
                          className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          View all orders
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Notification Bell End */}

              {/* 2 User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div>
                    {authUser?.profileImg?.url ? (
                      <img
                        src={authUser.profileImg.url}
                        alt="image"
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <UserRound className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <div className="hidden sm:flex flex-col text-sm leading-tight text-left">
                    <span className="font-medium text-gray-800">
                      {authUser?.fullName}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {authUser?.email}
                    </span>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`hidden sm:block text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {authUser?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {authUser?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowChangePassword(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Lock size={15} />
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logoutMutation();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
};

export default Header;
