import { Users, TrendingUp, Package } from "lucide-react";

import Card from "../components/Card";
import SaleCard from "../components/SaleCard";
import RecentOrders from "../components/RecentOrders";
import { useGetAllOrders } from "../hooks/useGetAllOrders";
import { useGetAllUsers } from "../hooks/useGetAllUsers";
import RecentProducts from "../components/RecentProducts";

const DashboardPage = () => {
  const { orders = [] } = useGetAllOrders();
  const { users = [] } = useGetAllUsers();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4">
          <Card
            title="Orders"
            value={orders.length.toString()}
            icon={Package}
            badgeIcon={TrendingUp}
            percentage="9.05"
          />

          <Card
            title="Customers"
            value={users.length.toString()}
            icon={Users}
            badgeIcon={TrendingUp}
            percentage="11.01"
          />
        </div>

        {/* Total Sale  */}
        <div className="sm:col-span-2">
          <SaleCard orders={orders} />
        </div>
      </div>

      {/* RecentOrders Table */}
      <RecentOrders orders={orders} />
      <RecentProducts />
    </div>
  );
};

export default DashboardPage;
