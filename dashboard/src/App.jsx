import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Layout from "./layout/Layout";
import useGetAuth from "./hooks/useGetAuth";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AddBrandPage = lazy(() => import("./pages/AddBrandPage"));
const BrandListingPage = lazy(() => import("./pages/BrandListingPage"));
const AreaPage = lazy(() => import("./pages/AreaPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SubCategoryPage = lazy(() => import("./pages/SubCategoryPage"));

const UsersPage = lazy(() => import("./pages/UsersPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const DealsPage = lazy(() => import("./pages/DealsPage"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const EnquiryDetailsPage = lazy(() => import("./pages/EnquiryDetailsPage"));
const ProductReviewsPage = lazy(() => import("./pages/ProductReviewsPage"));
// Imports End----

const App = () => {
  const { data: authUser, isLoading } = useGetAuth();

  if (isLoading && !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader size={32} className="animate-spin text-gray-400" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={authUser ? <Layout /> : <LoginPage />}>
            <Route
              index
              element={authUser ? <DashboardPage /> : <LoginPage />}
            />

            <Route
              path="product"
              element={authUser ? <ProductPage /> : <Navigate to="/login" />}
            />

            {/* Brand Routes */}
            <Route
              path="/brand/create"
              element={authUser ? <AddBrandPage /> : <Navigate to="/login" />}
            />
            <Route
              path="brand/edit/:id"
              element={authUser ? <AddBrandPage /> : <Navigate to="/login" />}
            />
            <Route
              path="brand/manage"
              element={
                authUser ? <BrandListingPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/area"
              element={authUser ? <AreaPage /> : <Navigate to="/login" />}
            />

            <Route
              path="category"
              element={authUser ? <CategoryPage /> : <Navigate to="/login" />}
            />

            <Route
              path="subcategory"
              element={
                authUser ? <SubCategoryPage /> : <Navigate to="/login" />
              }
            />

            {/* User & Order Routes */}
            <Route
              path="/users"
              element={authUser ? <UsersPage /> : <LoginPage />}
            />

            <Route
              path="/orders"
              element={authUser ? <OrdersPage /> : <LoginPage />}
            />

            <Route
              path="/deals"
              element={authUser ? <DealsPage /> : <LoginPage />}
            />

            {/* Enquiry Routes */}
            <Route
              path="/enquiries"
              element={authUser ? <EnquiriesPage /> : <LoginPage />}
            />

            <Route
              path="/enquiries/:id"
              element={
                authUser ? <EnquiryDetailsPage /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/product-reviews"
              element={
                authUser ? <ProductReviewsPage /> : <Navigate to="/login" />
              }
            />
          </Route>

          {/* Login & Fallback */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/forgot-password"
            element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}
          />

          <Route
            path="/reset-password/:token"
            element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
          />

          <Route path="*" element={!authUser ? <LoginPage /> : <Layout />} />
        </Routes>
      </Suspense>

      <Toaster
        position="bottom-center"
        containerStyle={{ zIndex: 9999999 }}
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fffbfb",
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            padding: "8px 16px",
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
