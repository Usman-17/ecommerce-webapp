import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
// Imports End-----

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getView = () => {
    if (location.pathname === "/signup") return "signup";
    if (location.pathname === "/forgot-password") return "forgot";
    if (location.pathname === "/reset-password") return "reset";
    return "login";
  };

  const view = getView();

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        {view === "login" && (
          <LoginForm
            onSwitchToSignup={() => navigate("/signup")}
            onForgotPassword={() => navigate("/forgot-password")}
          />
        )}

        {view === "signup" && (
          <SignupForm onSwitchToLogin={() => navigate("/login")} />
        )}

        {view === "forgot" && (
          <ForgotPassword onBackToLogin={() => navigate("/login")} />
        )}

        {view === "reset" && (
          <ResetPassword onBackToLogin={() => navigate("/login")} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
