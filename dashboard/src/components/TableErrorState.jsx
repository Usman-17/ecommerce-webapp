import { AlertCircle } from "lucide-react";

const TableErrorState = ({ isError, message }) => {
  if (!isError) return null;

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <AlertCircle size={40} className="text-red-400 mb-3" />
      <p className="text-sm text-red-600 font-medium">
        {message || "Something went wrong"}
      </p>
    </div>
  );
};

export default TableErrorState;
