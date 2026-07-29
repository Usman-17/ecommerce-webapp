import TextMarquee from "./TextMarquee";
import hero from "../../../assets/hero.webp";
import heroMobile from "../../../assets/hero-m.webp";

const Hero = () => {
  return (
    <div className="-mx-3">
      <div className="w-full h-170 sm:h-75 lg:h-160 overflow-hidden">
        <img src={heroMobile} alt="Banner" className="w-full h-full object-cover sm:hidden" />
        <img src={hero} alt="Banner" className="hidden sm:block w-full h-full object-cover" />
      </div>

      {/* Marquee */}
      <div className="hidden sm:block">
        <TextMarquee />
      </div>
    </div>
  );
};

export default Hero;
