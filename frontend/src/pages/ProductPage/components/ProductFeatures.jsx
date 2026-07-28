import { ShieldCheck, Truck, CheckCircle2 } from "lucide-react";

const ProductFeatures = () => {
  return (
    <div className="hidden sm:grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-6 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-center gap-3">
        <div className="w-8 h-8 shrink-0 bg-pink-50 rounded-lg flex items-center justify-center text-accent">
          <ShieldCheck size={18} strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-primary">Authentic</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">100% Original</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 shrink-0 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
          <Truck size={18} strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-primary">Express</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">Fast Delivery</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 shrink-0 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <CheckCircle2 size={18} strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-primary">Warranty</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">Quality Check</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
