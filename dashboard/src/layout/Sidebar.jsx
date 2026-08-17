import { Link, useLocation } from "react-router";
import { ChevronDownIcon, Ellipsis, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSidebar } from "../context/SidebarContext";

import logo from "../assets/logo.png";
import logo_icon from "../assets/s-logo.png";

import navItems from "./navItems";
// Imports End----

const Sidebar = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => {
      if (path.includes("?")) {
        return location.pathname + location.search === path;
      }
      return location.pathname === path && !location.search;
    },
    [location.pathname, location.search],
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-0.5">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg overflow-hidden text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className="shrink-0">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="text-sm flex-1 text-left">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                onClick={() => isMobileOpen && toggleMobileSidebar()}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(nav.path)
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="shrink-0">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="pt-1 pb-1 pl-6 space-y-0.5">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      onClick={() => isMobileOpen && toggleMobileSidebar()}
                      className={`flex items-center px-3 py-1.5 rounded-md transition-colors text-[13px] ${
                        isActive(subItem.path)
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen pt-6 lg:pt-4 bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 ease-in-out z-50
        ${
          isMobileOpen
            ? "w-full px-4"
            : isExpanded || isHovered
              ? "w-[220px] px-3"
              : "w-[56px] px-2"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div className="pb-5 flex items-center justify-between">
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img src={logo} alt="Logo" width={90} height={36} />
          ) : (
            <img src={logo_icon} alt="Logo" width={28} height={28} />
          )}
        </Link>
        {isMobileOpen && (
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav>
          <div>
            <h2
              className={`mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${
                !isExpanded && !isHovered ? "justify-center" : "px-1"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Menu"
              ) : (
                <Ellipsis size={14} className="mx-auto" />
              )}
            </h2>
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
