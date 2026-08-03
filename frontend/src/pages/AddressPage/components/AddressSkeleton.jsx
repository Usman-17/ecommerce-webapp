const AddressSkeleton = () => {
  return (
    <div className="flex min-h-[82vh] bg-white h-full flex-col items-center justify-center py-16 px-4 rounded-lg animate-pulse">
      {/* Lottie placeholder */}
      <div className="w-40 h-40 bg-gray-200 rounded-full" />

      {/* Text placeholders */}
      <div className="h-5 w-40 bg-gray-200 rounded mt-4" />
      <div className="h-3 w-56 bg-gray-100 rounded mt-3" />

      {/* Button placeholder */}
      <div className="h-10 w-44 bg-gray-200 rounded-full mt-6" />
    </div>
  );
};

export default AddressSkeleton;
