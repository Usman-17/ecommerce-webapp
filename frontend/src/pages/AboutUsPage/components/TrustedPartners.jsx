import mpLogo from "../../../assets/partners/m&p.png";
import lepLogo from "../../../assets/partners/lep.png";
import traxLogo from "../../../assets/partners/trax.svg";
import jazzcashLogo from "../../../assets/partners/jazzcash.png";
import easypaisaLogo from "../../../assets/partners/easypaisa.png";

const partners = [
  {
    name: "Leopards",
    logo: lepLogo,
  },
  {
    name: "M&P",
    logo: mpLogo,
  },
  {
    name: "Trax",
    logo: traxLogo,
  },
  {
    name: "JazzCash",
    logo: jazzcashLogo,
  },
  {
    name: "EasyPaisa",
    logo: easypaisaLogo,
  },
];

const TrustedPartners = () => {
  return (
    <section className="flex-1 rounded-xl border border-gray-100 bg-white p-6">
      {/* Heading */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Our Trusted Partners
        </h2>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          We collaborate with leading delivery services and payment partners to
          bring you a seamless shopping experience.
        </p>
      </div>

      {/* Partners */}
      <div className="mt-6 grid grid-cols-5 gap-3">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="flex h-20 items-center justify-center rounded-xl bg-[#fafafa] p-3 transition-all duration-300"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="max-h-10 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedPartners;
