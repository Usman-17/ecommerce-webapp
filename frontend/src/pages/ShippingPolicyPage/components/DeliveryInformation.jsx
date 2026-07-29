import rainIcon from "../../../assets/privacy-policy/rain.png";
import locationIcon from "../../../assets/privacy-policy/location-pin.png";
import codIcon from "../../../assets/privacy-policy/cash-on-delivery.png";

const deliveryData = [
  {
    icon: rainIcon,
    bgColor: "bg-[#FFF3E0]",
    title: "Delivery Delays",
    description:
      "Delivery may be delayed due to weather conditions, public holidays, strikes, or courier service issues.",
  },
  {
    icon: locationIcon,
    bgColor: "bg-[#E3F2FD]",
    title: "Incorrect Address",
    description:
      "If an incorrect address is provided, the delivery may be delayed or returned. Please double-check your details before placing an order.",
  },
  {
    icon: codIcon,
    bgColor: "bg-[#F3E5F5]",
    title: "Cash on Delivery (COD)",
    description:
      "COD is available in selected areas across Pakistan. Additional verification may be required.",
  },
];

const DeliveryInformation = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {deliveryData.map((item, index) => (
          <div
            key={index}
            className="flex sm:flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-gray-50/50 transition-colors text-center"
          >
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 ${item.bgColor} rounded-full flex items-center justify-center shrink-0`}
            >
              <img src={item.icon} alt={item.title} className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="flex-1 sm:flex-none min-w-0">
              <h3 className="text-[13px] sm:text-[14px] font-black text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-[12px] text-gray-500 font-bold line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryInformation;
