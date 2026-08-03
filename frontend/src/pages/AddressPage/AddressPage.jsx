import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useUser } from "../../hooks/useUser";
import AuthModal from "../../components/AuthModal";

import AddressList from "./components/AddressList";
import EmptyAddress from "./components/EmptyAddress";
import AddressSkeleton from "./components/AddressSkeleton";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const AddressPage = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [isAuthOpen, setIsAuthOpen] = useState(!user);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/api/auth/addresses`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddAddress = () => {
    navigate("/profile/address/edit");
  };

  const handleEditAddress = (address) => {
    navigate(`/profile/address/edit?id=${address._id}`);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setAddresses(data.addresses);
    } catch {}
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/auth/addresses/${id}/default`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) setAddresses(data.addresses);
    } catch {}
  };

  if (!user) {
    return (
      <>
        <AddressSkeleton />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  if (loading) {
    return <AddressSkeleton />;
  }

  return (
    <div className="h-full">
      <div className="h-full">
        {addresses.length === 0 ? (
          <EmptyAddress onAddAddress={handleAddAddress} />
        ) : (
          <AddressList
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onSetDefault={handleSetDefault}
          />
        )}
      </div>
    </div>
  );
};

export default AddressPage;
