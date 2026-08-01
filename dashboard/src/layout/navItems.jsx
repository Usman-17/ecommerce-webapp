import {
  Layers2,
  LayoutDashboard,
  Mails,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/",
  },
  {
    name: "Manage Products",
    icon: <Layers2 size={18} />,
    subItems: [
      { name: "Add Brand", path: "/brand/create" },
      { name: "Product Areas", path: "/area" },
      { name: "Category", path: "/category" },
      { name: "Sub Category", path: "/subcategory" },
      { name: "Products", path: "/product" },
    ],
  },
  {
    name: "Deals",
    icon: <Tag size={18} />,
    path: "/deals",
  },
  {
    name: "Orders",
    icon: <ShoppingBag size={18} />,
    subItems: [
      { name: "All Orders", path: "/orders" },
      { name: "Pending", path: "/orders?status=pending" },
      { name: "Delivered", path: "/orders?status=delivered" },
      { name: "Cancelled", path: "/orders?status=cancelled" },
    ],
  },
  {
    name: "Users",
    icon: <Users size={18} />,
    path: "/users",
  },
  {
    name: "Enquiries",
    icon: <Mails size={18} />,
    path: "/enquiries",
  },
];

export default navItems;
