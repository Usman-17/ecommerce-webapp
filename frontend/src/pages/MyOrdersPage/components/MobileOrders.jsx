import { useSearchParams } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import OrderItem from "./OrderItem";
import OrderTabs from "./OrderTabs";
import EmptyOrders from "./EmptyOrders";

const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const MobileOrders = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "All";

  const [orders] = useState(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        return JSON.parse(storedOrders);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState(initialTab);
  const touchStartX = useRef(0);
  const tabsContainerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diffX) > 50) {
        const currentIndex = TABS.indexOf(activeTab);
        if (diffX < 0 && currentIndex < TABS.length - 1) {
          setActiveTab(TABS[currentIndex + 1]);
        } else if (diffX > 0 && currentIndex > 0) {
          setActiveTab(TABS[currentIndex - 1]);
        }
      }
    },
    [activeTab],
  );

  const getCount = (tab) => {
    if (tab === "All") return orders.length;
    return orders.filter(
      (order) => order.status?.toLowerCase() === tab.toLowerCase(),
    ).length;
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    return order.status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="px-1 pt-0 sm:pb-4"
    >
      <OrderTabs
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabsContainerRef={tabsContainerRef}
        counts={TABS.reduce(
          (acc, tab) => ({ ...acc, [tab]: getCount(tab) }),
          {},
        )}
      />

      <div className="pb-10">
        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <Motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-0 sm:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <Motion.div
                  key={order.orderId || order.orderNo || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OrderItem order={order} />
                </Motion.div>
              ))}
            </AnimatePresence>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default MobileOrders;
