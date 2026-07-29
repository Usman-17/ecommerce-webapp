import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useState, useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

import "react-loading-skeleton/dist/skeleton.css";

import Header from "./components/Header";
import Footer from "./components/common/Footer";
import CartDrawer from "./components/CartDrawer";
import AnalyticsProvider from "./components/AnalyticsProvider";
import ScrollToTopButton from "./components/common/ScrollToTopButton";

import useGetAuth from "./hooks/useGetAuth";
import useTrackPage from "./hooks/useTrackPage";

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
const PlaceOrderPage = lazy(
  () => import("./pages/PlaceOrderPage/PlaceOrderPage"),
);

const ShippingPolicyPage = lazy(
  () => import("./pages/ShippingPolicyPage/ShippingPolicyPage"),
);

const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage/ContactUsPage"));
const PrivacyPolicyPage = lazy(
  () => import("./pages/PrivacyPolicyPage/PrivacyPolicyPage"),
);
const FAQsPage = lazy(() => import("./pages/FAQsPage/FAQsPage"));

const TrackOrderPage = lazy(
  () => import("./pages/TrackOrderPage/TrackOrderPage"),
);
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/Auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
// imports End----

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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

  const PageViewTracker = () => {
    useTrackPage();
    return null;
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsProvider>
          <PageViewTracker />
          <ScrollToTop />
          <ScrollToTopButton />

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
                <Route path="/place-order" element={<PlaceOrderPage />} />

                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />

                <Route
                  path="/shipping-policy"
                  element={<ShippingPolicyPage />}
                />
                <Route path="/faqs" element={<FAQsPage />} />

                <Route
                  path="/order"
                  element={
                    authUser ? <MyOrdersPage /> : <Navigate to="/login" />
                  }
                />

                <Route
                  path="/profile"
                  element={
                    authUser ? <ProfilePage /> : <Navigate to="/login" />
                  }
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
                    !authUser ? (
                      <ForgotPasswordPage />
                    ) : (
                      <Navigate to="/login" />
                    )
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
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
