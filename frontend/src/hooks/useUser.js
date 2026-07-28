import { useState, useEffect } from "react";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const useUser = () => {
  const [user, setUser] = useState(getUser);

  useEffect(() => {
    const handleUpdate = () => setUser(getUser());
    window.addEventListener("userUpdated", handleUpdate);
    return () => window.removeEventListener("userUpdated", handleUpdate);
  }, []);

  return user;
};

export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  } else {
    localStorage.removeItem("user");
  }
  window.dispatchEvent(new Event("userUpdated"));
};
