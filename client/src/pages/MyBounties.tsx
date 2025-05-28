import BountyTable from "@/components/BountyTable";
import { Input } from "@/components/ui/input";
import UserPagesWrapper from "@/components/UserPagesWrapper";
import useBounties from "@/hooks/useBounties";
import { columns } from "@/lib/bounties-columns";
import { Button } from "@/components/ui/button";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetCompanies } from "@/hooks/useGetCompanies";

function Bounties() {
  const { allBounties, isBountiesLoading, totalPayout } = useBounties();
  const { companies, isCompaniesLoading } = useGetCompanies();
  const navigate = useNavigate();

  return (
    <div className="bg-[#efeff0]">
      <UserPagesWrapper>
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <Input
            placeholder="Search Bounty"
            className="h-12 rounded-4xl w-full md:w-1/2"
            style={{ fontFamily: "KarlaRegular" }}
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center mb-8 bg-[#f8f8f8] rounded-4xl px-4 md:px-8">
          <div className="flex justify-between items-center my-2 w-full mt-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-2 rounded-2xl h-8 bg-[#fa5e06]"></div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                General Details
              </h1>
            </div>
          </div>
          <div className="w-full flex flex-col items-start mt-4 mb-4">
            <div className="flex flex-col w-full md:flex-row gap-4 items-center flex-wrap">
              <div className="bg-[#efeff0] rounded-4xl p-4 w-full md:w-64">
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Active Bounties
                </h1>
                <div className="flex items-center gap-2">
                  <p
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Number of active Bounties
                  </p>
                </div>
                <p
                  className="text-4xl text-gray-500 my-8"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {isBountiesLoading ? (
                    <FaSpinner className="text-gray-500 animate-spin" />
                  ) : (
                    allBounties?.length
                  )}
                </p>
                <p
                  className="text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Updated: 45 minutes ago
                </p>
              </div>
              <div className="bg-gray-900 rounded-4xl p-4 w-full md:w-64">
                <h1
                  className="text-2xl font-bold text-[#efeff0]"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Bounties Value
                </h1>
                <div className="flex items-center gap-2">
                  <p
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Value of all Bounties in USD
                  </p>
                </div>
                <p
                  className="text-4xl text-[#fa5e06] my-8"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  ${totalPayout.toLocaleString()}
                </p>
                <p
                  className="text-[#efeff0]"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Updated: 5 minutes ago
                </p>
              </div>

              <div className="bg-gray-900 rounded-4xl p-4 w-full md:w-64">
                <h1
                  className="text-2xl font-bold text-[#efeff0]"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Settled Bounties
                </h1>
                <div className="flex items-center gap-2">
                  <p
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Number of settled Bounties
                  </p>
                </div>
                <p
                  className="text-4xl text-[#fa5e06] my-8"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  0
                </p>
                <p
                  className="text-[#efeff0]"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Updated: 1 hour ago
                </p>
              </div>
            </div>
          </div>
        </div>
        <BountyTable columns={columns} data={allBounties!} />
      </UserPagesWrapper>
    </div>
  );
}

export default Bounties;
