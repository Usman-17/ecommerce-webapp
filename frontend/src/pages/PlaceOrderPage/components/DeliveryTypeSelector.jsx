import fastDeliveryIcon from "../../../assets/place-order/fast-delivery.png";

const DeliveryTypeSelector = () => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">
          Delivery Method
        </h3>
        <p className="text-xs text-gray-500 sm:mt-1">
          Choose how you want to receive your order
        </p>
      </div>

      <label className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-accent bg-accent/3 cursor-default">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-accent/10">
          <img
            src={fastDeliveryIcon}
            alt="Delivery"
            className="w-10 h-10 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <span className="block font-bold text-gray-900 text-base">
            Delivery
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
            Get your order delivered to your doorstep
          </p>
        </div>

        <div className="absolute top-4 right-4">
          <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
        </div>

        <div className="absolute bottom-2 right-2 hidden sm:flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-lg">
          <span className="text-[9px] font-bold text-accent flex items-center gap-1">
            <span className="text-[10px]">★</span> Most Popular
          </span>
        </div>
      </label>
    </div>
  );
};

export default DeliveryTypeSelector;
