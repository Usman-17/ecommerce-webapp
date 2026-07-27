import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  Ellipsis,
  Layers2,
  LayoutDashboard,
  Mails,
  ShoppingBag,
  Users,
} from "lucide-react";

import logo from "../assets/logo.png";
import logo_icon from "../assets/s-logo.png";
// Imports End

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/",
  },
  {
    name: "Manage Products",
    icon: <Layers2 />,
    subItems: [
      { name: "Add Product", path: "/product/create" },
      { name: "Manage Products", path: "/product/manage" },
      { name: "Add Brand", path: "/brand/create" },
      { name: "Product Areas", path: "/area" },
      { name: "Add Category", path: "/category/create" },
      { name: "Manage SubCategories", path: "/subcategory/manage" },
    ],
  },
  {
    name: "Users",
    icon: <Users />,
    path: "/users",
  },
  {
    name: "Orders",
    icon: <ShoppingBag />,
    path: "/orders",
  },
  {
    name: "Enquiries",
    icon: <Mails />,
    path: "/enquiries",
  },
];

const Sidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
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
    <ul className="flex flex-col gap-3">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className="flex items-center gap-3 ml-3 overflow-hidden text-gray-500 hover:text-gray-900 transition-colors cursor-pointer "
            >
              <span>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 mt-1.5  ${
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
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive(nav.path)
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{nav.icon}</span>
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
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`flex justify-between items-center px-3 py-1 rounded transition-colors  ${
                        isActive(subItem.path)
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
      className={`fixed top-0 left-0 h-screen mt-5 lg:mt-0 px-5 bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 ease-in-out z-50
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div className="py-8 sm:py-4 flex justify-center">
        <Link to="/" className="hidden sm:block">
          {isExpanded || isHovered || isMobileOpen ? (
            <img src={logo} alt="Logo" width={100} height={40} />
          ) : (
            <img src={logo_icon} alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <Ellipsis size={16} />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
