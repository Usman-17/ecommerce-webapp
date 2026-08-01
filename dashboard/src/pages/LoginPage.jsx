import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import LoadingSpinner from "../components/LoadingSpinner";

const REMEMBER_ME_KEY = "dashboard_remember_me";

const LoginPage = () => {
  const [isShow, setIsShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_ME_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEmail(parsed.email || "");
        setPassword(parsed.password || "");
        setRememberMe(true);
      } catch {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    }
  }, []);

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async ({ email, password, rememberMe }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Login failed. Please try again.");
      } catch (error) {
        throw new Error(error.message || "Login failed. Please try again.");
      }
    },

    onSuccess: (_, variables) => {
      if (variables.rememberMe) {
        localStorage.setItem(
          REMEMBER_ME_KEY,
          JSON.stringify({
            email: variables.email,
            password: variables.password,
          }),
        );
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },

    onError: (error) => {
      if (error.message.includes("locked")) {
        toast.error(error.message);
      } else {
        toast.error(error.message || "Invalid email or password");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md sm:p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-base text-gray-500 px-20 sm:px-8">
            Enter your email and password below to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Email */}
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

          {/* Password */}
          <div className="grid">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-base font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={isShow ? "text" : "password"}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-gray-300 px-2 py-2 rounded text-black pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {password && (
                <div
                  role="button"
                  aria-label={isShow ? "Hide password" : "Show password"}
                  tabIndex={0}
                  onClick={() => setIsShow(!isShow)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-black"
                >
                  {isShow ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              )}
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-600 cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          {/* Submit */}
          <div className="mt-2">
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition cursor-pointer select-none"
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner content="Logging in..." /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
