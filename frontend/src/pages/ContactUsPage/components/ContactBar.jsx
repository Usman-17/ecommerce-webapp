import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactBar = () => {
  const contactData = [
    {
      icon: <Mail size={20} />,
      title: "Email Us",
      value: "info@jemzy.pk",
    },
    {
      icon: <Phone size={20} />,
      title: "Call Us",
      value: "0302 4242047",
    },
    {
      icon: <MapPin size={20} />,
      title: "Location",
      value: "Lahore, Pakistan",
    },
    {
      icon: <Clock size={20} />,
      title: "Working Hours",
      value: "24/7",
    },
  ];

  return (
    <div className="w-full bg-[#fff5f6] border border-[#ffeef0] rounded-xl p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {contactData.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Icon Container */}
            <div className="flex items-center justify-center w-12 h-12 bg-[#feeef0] rounded-xl text-[#f43f5e]">
              {item.icon}
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <span className="text-[#0f172a] font-bold text-sm">
                {item.title}
              </span>
              <span className="text-[#64748b] text-xs mt-0.5">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactBar;
