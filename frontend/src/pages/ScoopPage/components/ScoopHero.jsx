import { useState } from "react";
import { motion as Motion } from "framer-motion";
import heroBanner from "../../../assets/scoop/hero.webp";
import heroBannerMobile from "../../../assets/scoop/hero-m.webp";

const HeroImage = ({ src, alt, ratio, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

const ScoopHero = ({ onStart }) => {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl cursor-pointer"
      onClick={onStart}
    >
      <HeroImage
        src={heroBannerMobile}
        alt="Build Your Scoop - Surprise Products"
        ratio="916 / 1717"
        className="md:hidden"
      />
      <HeroImage
        src={heroBanner}
        alt="Build Your Scoop - Surprise Products"
        ratio="1717 / 731"
        className="hidden md:block"
      />
    </Motion.section>
  );
};

export default ScoopHero;
