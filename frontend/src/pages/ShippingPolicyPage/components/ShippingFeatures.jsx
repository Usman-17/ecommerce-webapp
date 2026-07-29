import { ClipboardList , Clock, TruckElectric, MapPin } from "lucide-react";

const ShippingFeatures = () => {
  const features = [
    {
      icon: ClipboardList,
      title: "Processing Time",
      bgColor: "bg-[#EDE7F6]",
      iconColor: "text-[#7C3AED]",
      content: (
        <p className="text-[11px] sm:text-[13px] text-gray-500 font-bold leading-relaxed">
          Orders are processed within 1–2 business days.
          <br />
          <span className="text-gray-400">
            Sundays and public holidays are excluded.
          </span>
        </p>
      ),
    },
    {
      icon: Clock,
      title: "Delivery Time",
      bgColor: "bg-[#FCE4EC]",
      iconColor: "text-[#E91E63]",
      content: (
        <ul className="text-[11px] sm:text-[13px] text-gray-500 font-bold leading-relaxed space-y-1.5 sm:space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1.5 shrink-0" />
            Lahore: 1–3 Business Days
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1.5 shrink-0" />
            Major Cities: 2–5 Business Days
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1.5 shrink-0" />
            Remote Areas: 4–7 Business Days
          </li>
        </ul>
      ),
    },
    {
      icon: TruckElectric,
      title: "Shipping Charges",
      bgColor: "bg-[#E8F5E9]",
      iconColor: "text-[#4CAF50]",
      content: (
        <ul className="text-[11px] sm:text-[13px] text-gray-500 font-bold leading-relaxed space-y-1.5 sm:space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] mt-1.5 shrink-0" />
            Orders under Rs. 5,000: Rs. 250 delivery charges
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] mt-1.5 shrink-0" />
            <span>
              Orders above Rs. 5,000:
              <br />
              <span className="text-[#4CAF50]">Free Delivery</span>
            </span>
          </li>
        </ul>
      ),
    },
    {
      icon: MapPin,
      title: "Order Tracking",
      bgColor: "bg-[#FFF8E1]",
      iconColor: "text-[#FF9800]",
      content: (
        <p className="text-[11px] sm:text-[13px] text-gray-500 font-bold leading-relaxed">
          Once your order is dispatched, we will share the tracking number via
          SMS or WhatsApp.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 sm:flex-col sm:items-center sm:text-center p-3 sm:p-0 rounded-xl sm:rounded-none bg-gray-50/50 sm:bg-transparent ${index < features.length - 1 ? 'border-b sm:border-b-0 border-gray-100 pb-4 sm:pb-0' : ''}`}
          >
            <div
              className={`w-10 h-10 sm:w-16 sm:h-16 ${item.bgColor} rounded-full flex items-center justify-center shrink-0`}
            >
              <item.icon size={20} className={`${item.iconColor} sm:hidden`} />
              <item.icon size={28} className={`${item.iconColor} hidden sm:block`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] sm:text-[15px] font-black text-gray-900 mb-1 sm:mb-3">
                {item.title}
              </h3>
              <div className="w-full">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingFeatures;
