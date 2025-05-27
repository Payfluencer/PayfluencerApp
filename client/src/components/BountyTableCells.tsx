import { useCompany } from "@/hooks/useCompany";
import { FaSpinner } from "react-icons/fa";

// Company cell component
export const CompanyCell = ({ companyId }: { companyId: string }) => {
  const { company, isCompanyLoading, companyError } = useCompany(companyId);

  if (isCompanyLoading) {
    return (
      <div className="flex items-center gap-2">
        <FaSpinner className="animate-spin text-gray-400" size={16} />
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-500">?</span>
        </div>
        <span className="text-gray-500">Unknown</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-6">
      <img
        src={company.logo}
        alt={company.name}
        className="w-10 h-10 rounded-full object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center hidden">
        <span className="text-lg text-gray-500">{company.name.charAt(0)}</span>
      </div>
      <span className="font-medium" style={{ fontFamily: "KarlaSemiBold" }}>
        {company.name}
      </span>
    </div>
  );
};

// Truncated ID cell component
export const TruncatedIdCell = ({ id }: { id: string }) => {
  const truncatedId = id.substring(0, 6);
  return (
    <span
      className="font-mono text-sm text-gray-600"
      title={id} // Show full ID on hover
    >
      {truncatedId}...
    </span>
  );
};
