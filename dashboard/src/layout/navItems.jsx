import {
  Layers2,
  LayoutDashboard,
  Mails,
  ShoppingBag,
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
      { name: "Category", path: "/category/create" },
      { name: "Sub Category", path: "/subcategory/manage" },
      { name: "Add Product", path: "/product/create" },
      { name: "Manage Products", path: "/product/manage" },
    ],
  },
  {
    name: "Users",
    icon: <Users size={18} />,
    path: "/users",
  },
  {
    name: "Orders",
    icon: <ShoppingBag size={18} />,
    path: "/orders",
  },
  {
    name: "Enquiries",
    icon: <Mails size={18} />,
    path: "/enquiries",
  },
];

export default navItems;
