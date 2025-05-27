import AdminPagesWrapper from "@/components/AdminPagesWrapper";
import BountyTable from "@/components/BountyTable";
import { Input } from "@/components/ui/input";
import useBounties from "@/hooks/useBounties";
import { columns } from "@/lib/bounties-columns";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Bounties() {
  const { allBounties } = useBounties();
  const navigate = useNavigate();
  console.log(allBounties);

  return (
    <div className="bg-[#efeff0]">
      <AdminPagesWrapper>
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <Input
            placeholder="Search Bounty"
            className="h-12 rounded-4xl w-full md:w-1/2"
            style={{ fontFamily: "KarlaRegular" }}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8 flex-wrap mt-4 mb-12 justify-center">
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    className="bg-[#fa5e06] text-white flex items-center gap-2"
                    style={{ fontFamily: "KarlaSemiBold" }}
                    onClick={() => navigate("/admin/create-bounty")}
                  >
                    <FaPlus className="text-white" />
                    Add Bounty
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center gap-8 my-4">
              <div className="flex flex-col w-full md:w-1/2">
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Bounties Summary
                </h1>
                <div className="flex items-center justify-between mt-2 w-full">
                  <div className="">
                    <h1
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      Bounties
                    </h1>
                    <p
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      14
                    </p>
                  </div>
                  <div className="">
                    <h1
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      Companies
                    </h1>
                    <p
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      89
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <h1
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      Revenue
                    </h1>
                    <p
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      $100K
                    </p>
                  </div>
                </div>
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
                    14
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
                    $14K
                  </p>
                  <p
                    className="text-[#efeff0]"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Updated: 5 minutes ago
                  </p>
                </div>
                <div className="bg-[#fa5e06] rounded-4xl p-4 w-full md:w-64">
                  <h1
                    className="text-2xl font-bold text-[#efeff0]"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Companies
                  </h1>
                  <div className="flex items-center gap-2">
                    <p
                      className="text-gray-300 text-sm"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      Number of companies with active Bounties
                    </p>
                  </div>
                  <p
                    className="text-4xl text-[#efeff0] my-8"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    7
                  </p>
                  <p
                    className="text-[#efeff0]"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Updated: 25 minutes ago
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
                    2
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
        </div>
        <BountyTable columns={columns} data={allBounties!} />
      </AdminPagesWrapper>
    </div>
  );
}

export default Bounties;
