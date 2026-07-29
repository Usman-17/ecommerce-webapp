import { Headset } from "lucide-react";

const SupportCard = ({ clientInfo }) => {
  return (
    <div className="hidden sm:block lg:w-72 bg-[#fff5f6] border border-[#ffeef0] rounded-xl p-6 shadow-sm">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-6">
        <div className="mt-1">
          {/* Lucide Headset Icon */}
          <Headset size={36} className="text-[#f43f5e]" strokeWidth={1.5} />
        </div>

        <div>
          <h2 className="text-[#0f172a] text-md font-semibold tracking-tight">
            Need Help?
          </h2>
          <p className="text-[#64748b] text-xs leading-snug mt-1">
            Our support team is here to help you with anything.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#feeef0] rounded-xl py-4 px-3">
        <p className="text-[#f43f5e] font-bold text-sm">
          Call Us:{" "}
          <span className="ml-1 tracking-wide">{clientInfo?.data?.cellNo}</span>
        </p>
      </div>
    </div>
  );
};

export default SupportCard;
