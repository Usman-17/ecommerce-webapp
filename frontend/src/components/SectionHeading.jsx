const SectionHeading = ({ title, subtitle }) => {
  return (
    <>
      <h2 className="text-lg md:text-2xl font-bold text-heading capitalize">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-500 text-sm md:text-base font-medium">
          {subtitle}
        </p>
      )}
    </>
  );
};

export default SectionHeading;
