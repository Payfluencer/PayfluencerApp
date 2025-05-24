import { AdminSidebar } from "./admin-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { SidebarTrigger } from "./ui/sidebar";
import TopEarners from "./TopEarners";
import { Button } from "./ui/button";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaArrowRight,
  FaCaretDown,
  FaInfo,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { AdminPayoutChart } from "./AdminPayoutChart";
import TopCompaniesSummary from "./TopCompanySummary";
import { Calendar } from "./ui/calendar";
import { useGetCompanies } from "@/hooks/useGetCompanies";
import useBounties from "@/hooks/useBounties";
import { useUsers } from "@/hooks/useUsers";

function AdminDashboard() {
  const [dateModal, setDateModal] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { companies, isCompaniesLoading } = useGetCompanies();
  const { bounties, isBountiesLoading, totalPayout, payoutChange } =
    useBounties();
  const { topEarners, isUsersLoading } = useUsers();

  console.log(companies?.data.companies);
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />

        <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4">
          <div className="flex flex-row justify-between w-full md:w-[90%]">
            <SidebarTrigger className="m-2 md:m-4" />
          </div>
          <div className="w-full px-4">
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col items-start">
                <h1 style={{ fontFamily: "KarlaRegular" }} className="text-xl">
                  Welcome Back,
                </h1>
                <p style={{ fontFamily: "KarlaSemiBold" }} className="text-2xl">
                  Admin
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="flex flex-col mt-8 w-full md:w-1/2">
                <h1
                  style={{ fontFamily: "KarlaRegular" }}
                  className="text-lg md:text-xl "
                >
                  Total Bounties Paid
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                  <p
                    style={{ fontFamily: "KarlaSemiBold" }}
                    className="text-3xl md:text-5xl my-2 text-[#fa5e06]"
                  >
                    ${totalPayout}
                  </p>
                  <div className="flex items-center gap-2 ">
                    <p
                      style={{ fontFamily: "KarlaRegular" }}
                      className={`text-sm text-gray-100 rounded-full px-2 py-1 flex items-center gap-2 ${
                        payoutChange.payoutChange >= 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {payoutChange.payoutChange >= 0 ? (
                        <FaAngleDoubleUp />
                      ) : (
                        <FaAngleDoubleDown />
                      )}
                      {payoutChange.payoutChange}%
                    </p>
                    <p
                      style={{ fontFamily: "KarlaRegular" }}
                      className={`text-sm text-gray-100 rounded-full px-2 py-1 flex items-center gap-2 ${
                        payoutChange.payoutChange >= 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {payoutChange.payoutChange >= 0 ? (
                        <FaAngleDoubleUp />
                      ) : (
                        <FaAngleDoubleDown />
                      )}
                      ${payoutChange.payoutChangeAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p
                    style={{ fontFamily: "KarlaRegular" }}
                    className="text-lg text-gray-500"
                  >
                    Vs Previous Month: $
                    {payoutChange.lastMonthPayout?.toLocaleString() || 0}
                  </p>
                  <Button
                    className=" text-gray-500 shadow-none hover:bg-transparent cursor-pointer bg-transparent text-lg flex gap-2 items-center"
                    style={{ fontFamily: "KarlaRegular" }}
                    onClick={() => setDateModal(true)}
                  >
                    {date?.toLocaleDateString() || "Select Date Range"}
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
                    Active Companies
                  </h1>
                  <p
                    style={{ fontFamily: "KarlaSemiBold" }}
                    className="text-3xl text-start mt-4 mb-8"
                  >
                    {isCompaniesLoading ? (
                      <span className="text-gray-500 animate-spin">
                        <FaSpinner />
                      </span>
                    ) : (
                      companies?.data.totalCompanies
                    )}
                  </p>
                  <Button className="text-gray-900 hover:bg-transparent  bg-transparent shadow-none left-0 right-0 flex gap-2 items-center justify-between absolute bottom-0 ">
                    More
                    <FaArrowRight size={20} />
                  </Button>
                </div>
                <div className="flex relative bg-gray-900 flex-col shadow-md rounded-lg p-4 shadow-[#f7f8f9]/10 border border-gray-200 md:w-1/2 hover:scale-95 transition-all duration-500 cursor-pointer">
                  <h1
                    style={{ fontFamily: "KarlaRegular" }}
                    className="text-lg text-gray-300"
                  >
                    Active Bounties
                  </h1>
                  <p
                    style={{ fontFamily: "KarlaSemiBold" }}
                    className="text-3xl text-start mt-4 mb-8 text-gray-300"
                  >
                    {isBountiesLoading ? (
                      <span className="text-gray-500 animate-spin">
                        <FaSpinner />
                      </span>
                    ) : (
                      bounties?.data.totalBounties
                    )}
                  </p>
                  <Button className="text-[#fa5e06] bg-transparent  shadow-none left-0 right-0 flex gap-2 items-center justify-between absolute bottom-0 ">
                    More
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
              <div className=" bg-[#efeff0] rounded-4xl p-2 mt-4 w-full md:w-3/4">
                {isUsersLoading ? (
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-center h-full">
                    <p>
                      <FaSpinner className="text-gray-500 animate-spin" />
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {topEarners?.map((earner) => (
                      <TopEarners key={earner.name} {...earner} />
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="bg-transparent text-lg shadow-none hover:bg-transparent cursor-pointer text-gray-900 mt-4 md:mt-0"
                style={{ fontFamily: "KarlaSemiBold" }}
                disabled={!topEarners || topEarners.length === 0}
              >
                {!topEarners || topEarners.length === 0
                  ? "No Earners"
                  : "View All"}
                {!topEarners || topEarners.length === 0 ? (
                  <FaInfo size={20} />
                ) : (
                  <FaArrowRight size={16} />
                )}
              </Button>
            </div>
            <div className="mt-10 flex flex-col gap-10 md:flex-row">
              <div className="w-full md:w-1/2">
                <div className="flex items-center justify-between">
                  <h1
                    style={{ fontFamily: "KarlaSemiBold" }}
                    className="text-2xl"
                  >
                    Top Companies
                  </h1>
                  <Button
                    className="bg-transparent text-sm shadow-none hover:bg-transparent cursor-pointer text-gray-900 mt-4 md:mt-0"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    View All
                    <FaArrowRight size={20} />
                  </Button>
                </div>
                {isCompaniesLoading ? (
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-center h-full">
                    <p>
                      <FaSpinner className="text-gray-500 animate-spin" />
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 bg-[#efeff0] rounded-4xl h-[400px] p-4 mt-4">
                    {companies?.data.companies.map((company) => (
                      <TopCompaniesSummary key={company.name} {...company} />
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <h1
                  style={{ fontFamily: "KarlaSemiBold" }}
                  className="text-2xl"
                >
                  Bounties Summary
                </h1>
                <div className="flex flex-col gap-1 bg-[#efeff0] rounded-4xl p-4 mt-4">
                  <AdminPayoutChart />
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
      {dateModal && (
        <div className="fixed inset-0 backdrop-blur-lg w-[100vw] h-[100vh] flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h3
              style={{ fontFamily: "KarlaSemiBold" }}
              className="font-bold text-lg"
            >
              Select Date Range
            </h3>
            <p
              style={{ fontFamily: "KarlaRegular" }}
              className="pb-4 text-gray-500"
            >
              Press ESC key or click outside to close
            </p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              style={{
                fontFamily: "KarlaRegular",
              }}
            />
            <div className="flex flex-col md:flex-row justify-between mt-4">
              <Button
                className="bg-transparent text-lg shadow-none hover:bg-transparent border border-gray-900 cursor-pointer text-gray-900 mt-4 md:mt-0"
                style={{
                  fontFamily: "KarlaRegular",
                }}
                onClick={() => setDateModal(false)}
              >
                Apply
              </Button>
              <Button
                className="bg-[#FA5E06] text-lg shadow-none hover:bg-[#FA5E06]/80 cursor-pointer text-gray-100 mt-4 md:mt-0"
                style={{
                  fontFamily: "KarlaRegular",
                }}
                onClick={() => setDateModal(false)}
              >
                Close
                <FaTimes size={20} className="text-gray-100" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
