import { useState } from "react";
import { Mail, Loader, ArrowRight, CheckCircle, Inbox } from "lucide-react";

import CustomInput from "../../../components/CustomInput";
import inboxImage from "../../../assets/inbox.webp";
// Imports End-----

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setIsSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl min-h-[75vh] flex items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md">
        {isSent ? (
          /* Success State */
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Reset link sent!
            </h1>
            <p className="text-sm text-gray-500 font-medium mb-6 max-w-xs mx-auto">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-gray-900">{email}</span>.
              Check your inbox.
            </p>
            <button
              onClick={() => window.open("https://mail.google.com", "_blank")}
              className="w-full py-3.5 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Inbox size={16} />
              Open Gmail
            </button>
            <button
              onClick={onBackToLogin}
              className="w-full py-3 mt-3 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-5">
                <img
                  src={inboxImage}
                  alt="Inbox"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                No worries! Enter your email and we&apos;ll send you a secure
                link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <CustomInput
                label="Email address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your email"
                icon={Mail}
                error={error}
              />

              {/* Helper text */}
              <div className="flex items-center gap-2 ml-1">
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                <p className="text-[10px] text-gray-400 font-medium">
                  We&apos;ll only use your email to send you a password reset
                  link.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200" />
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  Remembered your password?{" "}
                  <button
                    onClick={onBackToLogin}
                    className="text-accent font-bold hover:text-accent/80 transition-colors"
                  >
                    Log in
                  </button>
                </p>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
