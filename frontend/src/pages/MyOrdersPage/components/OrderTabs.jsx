import { useRef, useEffect, useCallback } from "react";

const OrderTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  counts = {},
  tabsContainerRef,
}) => {
  const tabsRef = useRef(null);

  const setRefs = useCallback(
    (node) => {
      tabsRef.current = node;
      if (tabsContainerRef) {
        tabsContainerRef.current = node;
      }
    },
    [tabsContainerRef],
  );

  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const idx = tabs.indexOf(activeTab);
    const btn = container.children[idx];
    if (btn) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="mb-4 sm:mb-4">
      <div
        ref={setRefs}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2 sm:px-0"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = counts[tab] || 0;

          return (
            <button
              key={tab}
              onClick={(e) => {
                setActiveTab(tab);
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });
              }}
              className={`relative py-1.5 px-4 text-[13px] font-bold transition-all whitespace-nowrap rounded-2xl ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-800 hover:bg-[#f0e4da]"
              }`}
            >
              {tab}
              {count > 0 && (
                <span
                  className={`ml-1 text-[11px] font-medium ${
                    isActive ? "text-white/70" : "text-gray-300"
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTabs;
