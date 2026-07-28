import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { useGetAllCategories } from "../../hooks/useGetAllCategories";
import { useGetAllSubCategories } from "../../hooks/useGetAllSubCategories";

const CollectionsDropdown = () => {
  const { categories = [] } = useGetAllCategories();
  const { subCategories = [] } = useGetAllSubCategories();

  const groupedCategories = categories.slice(0, 13).map((cat) => ({
    ...cat,
    items: subCategories.filter(
      (sub) => String(sub.categoryId) === String(cat._id),
    ),
  }));

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const hoverTimer = useRef(null);

  const handleCollectionEnter = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setIsCollectionOpen(true);
    }, 250);
  };

  const handleCollectionLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setIsCollectionOpen(false);
    }, 200);
  };

  const toggleDropdown = () => {
    setIsCollectionOpen((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsCollectionOpen(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      clearTimeout(hoverTimer.current);
      setIsCollectionOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <li
      className="relative"
      onMouseEnter={handleCollectionEnter}
      onMouseLeave={handleCollectionLeave}
    >
      <button
        className="relative flex flex-col items-center cursor-pointer select-none"
        aria-expanded={isCollectionOpen}
        aria-haspopup="true"
        aria-controls="collections-dropdown"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
      >
        <>
          <span className="flex items-center gap-1">
            <span>COLLECTIONS</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollectionOpen ? "rotate-180" : ""}`}
            />
          </span>
        </>
      </button>
      <div
        id="collections-dropdown"
        role="menu"
        onMouseEnter={handleCollectionEnter}
        onMouseLeave={handleCollectionLeave}
        className={`fixed top-15 left-0 w-screen z-50 ${isCollectionOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        style={{
          transition: isCollectionOpen
            ? "opacity 0.3s ease-in-out, visibility 0s"
            : "opacity 0.3s ease-in-out, visibility 0s 0.3s",
        }}
      >
        <div className="bg-[#fffaf5] border-t border-gray-200 shadow-lg">
          <div className="px-[4vw] py-8 grid grid-cols-4 gap-8">
            {groupedCategories
              .filter((cat) => cat.items.length > 0)
              .map((cat) => (
                <div key={cat._id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.name || "")}`}
                    onClick={() => setIsCollectionOpen(false)}
                    className="text-sm font-semibold text-gray-900 mb-3 block hover:text-[#CC0D39]"
                  >
                    {cat.name}
                  </Link>
                  <ul className="space-y-2">
                    {cat.items.slice(0, 5).map((sub) => (
                      <li key={sub._id}>
                        <Link
                          to={`/shop?category=${encodeURIComponent(cat.name || "")}&subcategory=${encodeURIComponent(sub.name || "")}`}
                          onClick={() => setIsCollectionOpen(false)}
                          className="text-sm text-gray-600 hover:text-[#CC0D39]"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            <div className="col-span-1">
              <div className="bg-linear-to-br from-[#CC0D39] to-[#8b0827] rounded-lg p-5 text-white text-center">
                <h3 className="text-lg font-bold">New Collection</h3>
                <p className="text-sm text-white/80 mt-2">
                  Shop the latest trends & get up to 50% off
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCollectionOpen(false)}
                  className="inline-block mt-4 text-xs font-semibold bg-white text-[#CC0D39] px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CollectionsDropdown;
