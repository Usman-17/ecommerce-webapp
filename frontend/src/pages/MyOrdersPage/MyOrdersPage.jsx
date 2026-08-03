import { useState } from "react";

import { useUser } from "../../hooks/useUser";
import AuthModal from "../../components/AuthModal";

import DesktopOrders from "./components/DesktopOrders";
import MobileOrders from "./components/MobileOrders";
import OrdersSkeleton from "./components/OrdersSkeleton";
// Imports End-----

const MyOrdersPage = () => {
  const user = useUser();
  const [isAuthOpen, setIsAuthOpen] = useState(!user);

  if (!user) {
    return (
      <>
        <OrdersSkeleton />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block h-full">
        <DesktopOrders />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileOrders />
      </div>
    </>
  );
};

export default MyOrdersPage;
