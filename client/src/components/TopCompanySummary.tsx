import { type Company as CompanyType } from "@/hooks/useGetCompanies";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function TopCompaniesSummary({ name, id, logo }: CompanyType) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-between border border-gray-200 shadow-none rounded-3xl p-2 px-4"
      onClick={() => navigate(`/admin/companies`)}
    >
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt={name}
          width={40}
          height={40}
          className="rounded-full object-contain border-[1px] border-gray-400 w-14 h-14"
        />
        <p style={{ fontFamily: "KarlaRegular" }} className="text-lg">
          {name}
        </p>
      </div>
      <Link
        to={`/company/${id}`}
        style={{ fontFamily: "KarlaSemiBold" }}
        className="text-lg"
      >
        <FaExternalLinkAlt size={20} />
      </Link>
    </div>
  );
}

export default TopCompaniesSummary;
