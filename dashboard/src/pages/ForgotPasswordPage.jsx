import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (email) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "dashboard" }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send reset email.");

      return data;
    },

    onSuccess: () => {
      toast.success("Reset email sent. Check your inbox.");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to send reset email.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md sm:p-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-base text-gray-500 mt-2 px-4">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
            <p className="text-sm text-green-700 font-medium">
              Reset email sent successfully!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Check your inbox and follow the link to reset your password. The
              link expires in 10 minutes.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-sm text-black font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid">
              <label htmlFor="email" className="text-base font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                autoComplete="email"
                className="border border-gray-300 px-2 py-2 rounded text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition cursor-pointer select-none"
                disabled={isPending}
              >
                {isPending ? (
                  <LoadingSpinner content="Sending..." />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
