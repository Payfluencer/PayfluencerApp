import AdminPagesWrapper from "@/components/AdminPagesWrapper";
import BountyTable from "@/components/BountyTable";
import { Input } from "@/components/ui/input";
import useBounties from "@/hooks/useBounties";
import { columns } from "@/lib/bounties-columns";

function Bounties() {
  const { allBounties } = useBounties();
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
            <p className="text-gray-500" style={{ fontFamily: "KarlaRegular" }}>
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
        <BountyTable columns={columns} data={allBounties!} />
      </AdminPagesWrapper>
    </div>
  );
}

export default Bounties;
