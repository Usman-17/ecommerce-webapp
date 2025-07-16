import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PreLoader from "./components/PreLoader";
import ScrollToTop from "./components/ScrollToTop";
import PageViewTracker from "./components/PageViewTracker";

import HomePage from "./pages/HomePage";
import useGetAuth from "./hooks/useGetAuth";
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PlaceOrderPage = lazy(() => import("./pages/PlaceOrderPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(() =>
  import("./pages/Auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
// imports End

const App = () => {
  const { data: authUser } = useGetAuth();

  return (
    <div className="px-4 sm:px-[5vw] md:px-[3vw] lg:px-[3vw]">
      <BrowserRouter>
        <PageViewTracker />
        <Header />

        <Suspense
          fallback={
            <div className="min-h-[100vh] flex items-center justify-center">
              <PreLoader />
            </div>
          }
        >
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/cart"
              element={authUser ? <CartPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/place-order"
              element={authUser ? <PlaceOrderPage /> : <Navigate to="/login" />}
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
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
