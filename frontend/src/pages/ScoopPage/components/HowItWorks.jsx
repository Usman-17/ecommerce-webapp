import InViewAnimation from "../../../components/InViewAnimation";

import stepsImg from "../../../assets/scoop/steps.webp";
import stepsImgMobile from "../../../assets/scoop/steps-m.webp";

const HowItWorks = () => {
  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <InViewAnimation>
        <img
          src={stepsImgMobile}
          alt="Four simple steps: choose your scoop, scoop your products, select your variants, and buy now"
          className="w-full h-auto object-contain sm:hidden"
        />
        <img
          src={stepsImg}
          alt="Four simple steps: choose your scoop, scoop your products, select your variants, and buy now"
          className="hidden w-full h-auto object-contain sm:block"
        />
      </InViewAnimation>
    </section>
  );
};

export default HowItWorks;
