import { motion as Motion } from "framer-motion";
import heroBanner from "../../../assets/scoop/hero.webp";
import heroBannerMobile from "../../../assets/scoop/hero-m.webp";

const ScoopHero = ({ onStart }) => {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl cursor-pointer"
      onClick={onStart}
    >
      <img
        src={heroBannerMobile}
        alt="Build Your Scoop - Surprise Products"
        className="w-full h-auto object-cover md:hidden"
      />
      <img
        src={heroBanner}
        alt="Build Your Scoop - Surprise Products"
        className="hidden w-full h-auto object-cover md:block"
      />
    </Motion.section>
  );
};

export default ScoopHero;
