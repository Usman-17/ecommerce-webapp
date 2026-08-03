import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "./components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, Suspense, useState, useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

import "react-loading-skeleton/dist/skeleton.css";

import Header from "./components/Header";
import Footer from "./components/common/Footer";
import CartDrawer from "./components/CartDrawer";
import AnalyticsProvider from "./components/AnalyticsProvider";
import ScrollToTopButton from "./components/common/ScrollToTopButton";

import useTrackPage from "./hooks/useTrackPage";

import HomePage from "./pages/HomePage/HomePage";
import ProfileLayout from "./pages/ProfilePage/components/desktop/ProfileLayout";
const ShopPage = lazy(() => import("./pages/ShopPage/ShopPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage/CategoryPage"));
const NewArrivalPage = lazy(
  () => import("./pages/NewArrivalPage/NewArrivalPage"),
);
const BestSellerPage = lazy(
  () => import("./pages/BestSellerPage/BestSellerPage"),
);
const DealsPage = lazy(() => import("./pages/DealsPage/DealsPage"));
const DealDetailPage = lazy(() => import("./pages/DealsPage/DealDetailPage"));
const ScoopPage = lazy(() => import("./pages/ScoopPage/ScoopPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const PlaceOrderPage = lazy(
  () => import("./pages/PlaceOrderPage/PlaceOrderPage"),
);

const ShippingPolicyPage = lazy(
  () => import("./pages/ShippingPolicyPage/ShippingPolicyPage"),
);

const AboutUsPage = lazy(() => import("./pages/AboutUsPage/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage/ContactUsPage"));
const PrivacyPolicyPage = lazy(
  () => import("./pages/PrivacyPolicyPage/PrivacyPolicyPage"),
);
const FAQsPage = lazy(() => import("./pages/FAQsPage/FAQsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage/TermsPage"));

const TrackOrderPage = lazy(
  () => import("./pages/TrackOrderPage/TrackOrderPage"),
);
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const ProfileInfoDesktop = lazy(
  () =>
    import("./pages/ProfilePage/components/desktop/AccountSettings/ProfileInfoDesktop"),
);
const ProfileInfoPage = lazy(
  () =>
    import("./pages/ProfilePage/components/mobile/AccountSettings/ProfileInfo"),
);
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage/MyOrdersPage"));
const AccountSettingsLayout = lazy(
  () =>
    import("./pages/ProfilePage/components/desktop/AccountSettings/AccountSettingsLayout"),
);
const ChangePassword = lazy(
  () =>
    import("./pages/ProfilePage/components/mobile/AccountSettings/ChangePassword"),
);
const AddressPage = lazy(() => import("./pages/AddressPage/AddressPage"));
const AddressForm = lazy(() => import("./pages/AddressPage/AddressForm"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
// imports End----

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
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
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
                  <Route path="/category" element={<CategoryPage />} />
                  <Route path="/new-arrivals" element={<NewArrivalPage />} />
                  <Route path="/best-sellers" element={<BestSellerPage />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/deals/:slug" element={<DealDetailPage />} />
                  <Route path="/scoop" element={<ScoopPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/place-order" element={<PlaceOrderPage />} />

                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />
                  <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicyPage />}
                  />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />

                  <Route
                    path="/shipping-policy"
                    element={<ShippingPolicyPage />}
                  />
                  <Route path="/faqs" element={<FAQsPage />} />

                  <Route
                    path="/order"
                    element={
                      <ProtectedRoute>
                        <MyOrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={<ProfileLayout />}
                  >
                    <Route index element={<ProfilePage />} />
                    <Route path="info" element={<ProfileInfoPage />} />
                    <Route path="orders" element={<MyOrdersPage />} />
                    <Route path="addresses" element={<AddressPage />} />
                    <Route path="address/edit" element={<AddressForm />} />
                    <Route
                      path="account-settings"
                      element={<AccountSettingsLayout />}
                    >
                      <Route index element={<ProfileInfoDesktop />} />
                      <Route path="security" element={<ChangePassword />} />
                    </Route>
                  </Route>

                  {/* Auth  For Mobile*/}
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route path="/forgot-password" element={<AuthPage />} />
                  <Route path="/reset-password" element={<AuthPage />} />
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
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
};

export default App;
