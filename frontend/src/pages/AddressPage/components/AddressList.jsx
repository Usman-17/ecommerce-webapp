import { Edit2, Trash2, Check, SquarePen } from "lucide-react";

const AddressList = ({ addresses, onAddAddress, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">My Addresses</h2>
        <button
          onClick={onAddAddress}
          className="flex items-center gap-2 py-2 px-4 bg-[#CC0D39] text-white rounded-lg text-xs font-bold hover:bg-[#B00C31] transition-all duration-200 active:scale-[0.98]"
        >
          <SquarePen size={14} />
          Add New
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => {
          return (
            <div
              key={address._id}
              className="bg-[#FFF8F5] rounded-xl p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-black text-gray-800 capitalize">
                      {address.type}
                    </h3>

                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 font-semibold">
                        <Check size={12} />
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(address)}
                    className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(address._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {address.fullName}
                </p>
                <p className="text-sm text-gray-500">{address.phone}</p>
                {address.email && (
                  <p className="text-sm text-gray-500">{address.email}</p>
                )}
                <p className="text-sm text-gray-500">{address.address}</p>
                <p className="text-sm text-gray-500">{address.city}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddressList;
