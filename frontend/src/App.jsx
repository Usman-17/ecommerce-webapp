import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

import "react-loading-skeleton/dist/skeleton.css";

import Header from "./components/Header";
import Footer from "./components/common/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";
import PageViewTracker from "./components/PageViewTracker";

import useGetAuth from "./hooks/useGetAuth";

import HomePage from "./pages/HomePage/HomePage";
const ShopPage = lazy(() => import("./pages/ShopPage/ShopPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const NewArrivalPage = lazy(
  () => import("./pages/NewArrivalPage/NewArrivalPage"),
);
const BestSellerPage = lazy(
  () => import("./pages/BestSellerPage/BestSellerPage"),
);
const DealsPage = lazy(() => import("./pages/DealsPage/DealsPage"));
const ScoopPage = lazy(() => import("./pages/ScoopPage/ScoopPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const PlaceOrderPage = lazy(() => import("./pages/PlaceOrderPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/Auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
// imports End

const App = () => {
  const { data: authUser } = useGetAuth();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    const handleOpenDrawer = () => setCartDrawerOpen(true);
    window.addEventListener("openCartDrawer", handleOpenDrawer);
    return () => window.removeEventListener("openCartDrawer", handleOpenDrawer);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (window.innerWidth <= 640 && e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PageViewTracker />

        <div className="px-3">
          <Header />
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen bg-[#fffaf5]">
                <Loader className="size-10 animate-spin text-primary" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/new-arrivals" element={<NewArrivalPage />} />
              <Route path="/best-sellers" element={<BestSellerPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/scoop" element={<ScoopPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/place-order"
                element={
                  authUser ? <PlaceOrderPage /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/order"
                element={authUser ? <MyOrdersPage /> : <Navigate to="/login" />}
              />

              <Route
                path="/profile"
                element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
              />

              {/* Auth */}
              <Route
                path="/login"
                element={!authUser ? <LoginPage /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!authUser ? <SignupPage /> : <Navigate to="/" />}
              />

              <Route
                path="/forgot-password"
                element={
                  !authUser ? <ForgotPasswordPage /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/reset-password/:token"
                element={
                  !authUser ? <ResetPasswordPage /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </Suspense>
        </div>
        <Footer />

        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
        />

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#363636",
              color: "#fffbfb",
              fontFamily: "outfit",
              fontSize: "13px",
              padding: "8px 16px",
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
