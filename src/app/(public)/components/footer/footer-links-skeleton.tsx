export const FooterLinksSkeleton = () => {
  return (
    <div
      className="w-full animate-pulse flex flex-col lg:flex-row gap-5"
      role="status"
      aria-label="Cargando enlaces del pie de página"
      aria-busy="true"
    >
      <div className="bg-gray-500 rounded w-1/4 h-5" />
      <div className="bg-gray-500 rounded w-1/4 h-5" />
      <div className="bg-gray-500 rounded w-1/4 h-5" />
      <div className="bg-gray-500 rounded w-1/4 h-5" />
    </div>
  );
};

export default FooterLinksSkeleton;
