import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./layout/Layout";
import { Toaster } from "react-hot-toast";
import useGetAuth from "./hooks/useGetAuth";
import "react-loading-skeleton/dist/skeleton.css";
import { lazy, Suspense, useEffect } from "react";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const ProductListingPage = lazy(() => import("./pages/ProductListingPage"));
const AddBrandPage = lazy(() => import("./pages/AddBrandPage"));
const BrandListingPage = lazy(() => import("./pages/BrandListingPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AreaPage = lazy(() => import("./pages/AreaPage"));
const SubCategoryPage = lazy(() => import("./pages/SubCategoryPage"));

const UsersPage = lazy(() => import("./pages/UsersPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const EnquiryDetailsPage = lazy(() => import("./pages/EnquiryDetailsPage"));

const App = () => {
  const { data: authUser, isLoading } = useGetAuth();

  if (isLoading && !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={authUser ? <Layout /> : <LoginPage />}>
            <Route
              index
              element={authUser ? <DashboardPage /> : <LoginPage />}
            />

            {/* Product Routes */}
            <Route
              path="/product/create"
              element={authUser ? <AddProductPage /> : <Navigate to="/login" />}
            />
            <Route
              path="product/edit/:id"
              element={authUser ? <AddProductPage /> : <Navigate to="/login" />}
            />
            <Route
              path="product/manage"
              element={
                authUser ? <ProductListingPage /> : <Navigate to="/login" />
              }
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
          </Route>

          {/* Login & Fallback */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route path="*" element={!authUser ? <LoginPage /> : <Layout />} />
        </Routes>
      </Suspense>

      <Toaster
        position="bottom-center"
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
