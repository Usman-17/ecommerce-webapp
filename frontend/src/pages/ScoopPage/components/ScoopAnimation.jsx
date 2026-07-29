import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const ScoopAnimation = ({ isActive, onComplete, duration = 2500 }) => {
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [isActive, duration, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Animated scoop circles */}
            <div className="relative h-28 w-28">
              {[0, 1, 2].map((i) => (
                <Motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-accent/60"
                  style={{ margin: `${i * 8}px` }}
                />
              ))}

              {/* Center sparkle */}
              <Motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-4xl">&#10024;</span>
              </Motion.div>
            </div>

            {/* Text */}
            <Motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white font-bold text-lg tracking-wide"
            >
              Scooping your surprises...
            </Motion.p>

            {/* Progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="h-2 w-2 rounded-full bg-accent"
                />
              ))}
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScoopAnimation;
