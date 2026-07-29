import { Check } from "lucide-react";
import { motion as Motion } from "framer-motion";

const CheckoutStepper = ({ currentStep = 2 }) => {
  const steps = [
    { id: 1, label: "Cart" },
    { id: 2, label: "Address" },
    { id: 3, label: "Place Order" },
  ];

  return (
    <div className="hidden sm:block sm:pt-6 sm:px-[4vw]">
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center shrink-0">
              {/* Step Item */}
              <div className="flex items-center gap-2">
                {/* Circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isCompleted || isActive ? "bg-accent" : "bg-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm sm:text-base font-bold transition-colors duration-300 ${
                    isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line (except for last step) */}
              {idx < steps.length - 1 && (
                <div className="mx-4 sm:mx-6 w-8 sm:w-12 h-0.5 bg-gray-200 relative">
                  {(isCompleted || (isActive && idx === 0)) && (
                    <Motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      className="absolute inset-0 bg-accent"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStepper;
