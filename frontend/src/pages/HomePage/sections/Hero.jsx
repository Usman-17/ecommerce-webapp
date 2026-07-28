import TextMarquee from "./TextMarquee";
import hero from "../../../assets/hero.webp";
const Hero = () => {
  return (
    <div className="-mx-3">
      <div className="w-full h-170 sm:h-75 lg:h-160 overflow-hidde">
        <img src={hero} alt="Banner" className="w-full h-full object-cover" />
      </div>

      {/* Marquee */}
      <div className="hidden sm:block">
        <TextMarquee />
      </div>
    </div>
  );
};

export default Hero;
