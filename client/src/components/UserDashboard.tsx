import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "./ui/button";
import { FaAngleDoubleUp, FaArrowRight, FaCaretDown } from "react-icons/fa";
import { topBounties, topEarners } from "@/lib/mock";
import TopEarners from "./TopEarners";
import TopBounties from "./TopBounties";
import { PayoutChart } from "./PayoutChart";

function UserDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4">
        <div className="flex flex-row justify-between w-full md:w-[90%]">
          <SidebarTrigger className="m-2 md:m-4" />
        </div>
        <div className="w-full px-4">
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-start">
              <h1 style={{ fontFamily: "KarlaRegular" }} className="text-xl">
                Good Afternoon,
              </h1>
              <p style={{ fontFamily: "KarlaSemiBold" }} className="text-2xl">
                Sylus Abel
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex flex-col mt-8 w-full md:w-1/2">
              <h1 style={{ fontFamily: "KarlaRegular" }} className="text-xl ">
                Revenue
              </h1>
              <div className="flex items-center gap-2 md:gap-4">
                <p
                  style={{ fontFamily: "KarlaSemiBold" }}
                  className="text-4xl my-2 text-[#fa5e06]"
                >
                  $190.86
                </p>
                <div className="flex items-center gap-2 ">
                  <p
                    style={{ fontFamily: "KarlaRegular" }}
                    className="text-sm text-gray-900 bg-green-500 rounded-full px-2 py-1 flex items-center gap-2"
                  >
                    <FaAngleDoubleUp />
                    +10%
                  </p>
                  <p
                    style={{ fontFamily: "KarlaRegular" }}
                    className="text-sm text-gray-900 bg-green-500 rounded-full px-2 py-1 flex items-center gap-2"
                  >
                    <FaAngleDoubleUp />
                    +$45.24
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <p
                  style={{ fontFamily: "KarlaRegular" }}
                  className="text-lg text-gray-500"
                >
                  Vs Previous Month: $145.86
                </p>
                <Button
                  className=" text-gray-500 shadow-none hover:bg-transparent cursor-pointer bg-transparent text-lg flex gap-2 items-center"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  1 March - 31 March
                  <FaCaretDown size={20} />
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex gap-4 mt-8 md:mt-0">
              <div className="flex relative flex-col shadow-md rounded-lg p-4 shadow-[#f7f8f9]/10 border border-gray-200 hover:scale-95 transition-all duration-500 cursor-pointer">
                <h1
                  style={{ fontFamily: "KarlaRegular" }}
                  className="text-lg text-gray-500"
                >
                  My Submissions
                </h1>
                <p
                  style={{ fontFamily: "KarlaSemiBold" }}
                  className="text-3xl text-start mt-4 mb-8"
                >
                  10
                </p>
                <Button className="text-gray-900 hover:bg-transparent  bg-transparent shadow-none left-0 right-0 flex gap-2 items-center justify-between absolute bottom-0 ">
                  View All
                  <FaArrowRight size={20} />
                </Button>
              </div>
              <div className="flex relative bg-gray-900 flex-col shadow-md rounded-lg p-4 shadow-[#f7f8f9]/10 border border-gray-200 md:w-1/2 hover:scale-95 transition-all duration-500 cursor-pointer">
                <h1
                  style={{ fontFamily: "KarlaRegular" }}
                  className="text-lg text-gray-300"
                >
                  Pending Reports
                </h1>
                <p
                  style={{ fontFamily: "KarlaSemiBold" }}
                  className="text-3xl text-start mt-4 mb-8 text-gray-300"
                >
                  3
                </p>
                <Button className="text-[#fa5e06] bg-transparent  shadow-none left-0 right-0 flex gap-2 items-center justify-between absolute bottom-0 ">
                  View All
                  <FaArrowRight size={20} />
                </Button>
              </div>
            </div>
          </div>
          <h1
            style={{ fontFamily: "KarlaSemiBold" }}
            className="text-2xl mt-10"
          >
            Top Earners
          </h1>
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className=" bg-[#f6f7f9] rounded-4xl p-1 mt-4 w-full md:w-3/4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {topEarners.map((earner) => (
                  <TopEarners key={earner.name} {...earner} />
                ))}
              </div>
            </div>
            <Button
              className="bg-transparent text-lg shadow-none hover:bg-transparent cursor-pointer text-gray-900 mt-4 md:mt-0"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              View All
              <FaArrowRight size={20} />
            </Button>
          </div>
          <div className="mt-10 flex flex-col gap-10 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="flex items-center justify-between">
                <h1
                  style={{ fontFamily: "KarlaSemiBold" }}
                  className="text-2xl"
                >
                  Top Bounties
                </h1>
                <Button
                  className="bg-transparent text-sm shadow-none hover:bg-transparent cursor-pointer text-gray-900 mt-4 md:mt-0"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  View All
                  <FaArrowRight size={20} />
                </Button>
              </div>
              <div className="flex flex-col gap-1 bg-[#f6f7f9] rounded-4xl p-4 mt-4">
                {topBounties.map((bounty) => (
                  <TopBounties key={bounty.name} {...bounty} />
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h1 style={{ fontFamily: "KarlaSemiBold" }} className="text-2xl">
                Payout Summary
              </h1>
              <div className="flex flex-col gap-1 bg-[#f6f7f9] rounded-4xl p-4 mt-4">
                <PayoutChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default UserDashboard;
