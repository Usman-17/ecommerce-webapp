import { useState } from "react";
import CustomLabel from "../../components/CustomLabel";
import CustomInput from "../../components/CustomInput";
import LoadingSpinner from "../../components/LoadingSpinner";

import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
// Imports End

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: async ({ email }) => {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Request failed. Please try again.");
      } catch (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: () => {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      toast.success("Email sent successfully!");
      setEmail("");
    },

    onError: (error) => {
      toast.error(error.message || "Invalid email");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation({ email });
  };

  return (
    <div className="flex justify-center items-center py-36 sm:py-28">
      <div className="w-full max-w-sm bg-[#fffaf5] px-4 py-8 rounded">
        <div className="grid gap-0 sm:gap-1 text-center mb-8">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-sm px-6 text-gray-500">
            Please enter your email to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <CustomLabel label={"Email"} />

            <CustomInput
              type="email"
              name="email"
              id="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit btn */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full text-white bg-gray-950 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
          >
            {isPending ? <LoadingSpinner content="Submitting..." /> : "Submit"}
          </button>
        </form>

        {showAlert && (
          <div
            className="p-4 rounded border border-green-300 bg-green-50 text-gray-700 text-xs font-semibold my-3 sm:text-sm"
            role="alert"
          >
            Email sent successfully! Please check your inbox.
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
