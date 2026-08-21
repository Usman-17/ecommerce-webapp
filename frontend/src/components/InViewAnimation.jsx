import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const InViewAnimation = ({ children, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationProps = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: inView ? 1 : 0, y: inView ? 0 : 15 },
    transition: { delay, duration: 0.2, ease: "easeOut" },
  };

  return (
    <motion.div ref={ref} {...animationProps}>
      {children}
    </motion.div>
  );
};

export default InViewAnimation;
