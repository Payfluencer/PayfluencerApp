import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FaPlus } from "react-icons/fa";
import logo from "@/assets/images/admin.png";
import { Button } from "@/components/ui/button";
import { topCompanies } from "@/lib/mock";
import Company from "@/components/Company";
import { useNavigate } from "react-router-dom";

function Companies() {
  const navigate = useNavigate();
  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AdminSidebar />

      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 overflow-y-auto">
        <div className="flex flex-row justify-between w-full md:w-[90%]">
          <SidebarTrigger className="m-2 md:m-4" />
        </div>
        <div className="w-full px-4">
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
                    onClick={() => navigate("/admin/create-company")}
                  >
                    <FaPlus className="text-white" />
                    Add Company
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center gap-8 my-4">
              <img
                src={logo}
                alt="logo"
                className="w-16 h-16 md:w-24 md:h-24 border border-gray-200 rounded-full"
              />
              <div className="flex flex-col w-full md:w-1/2">
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Hi, Admin!
                </h1>
                <div className="flex items-center justify-between mt-2 w-full">
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
                      14
                    </p>
                  </div>
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
              <h1
                className="text-2xl text-center font-bold text-gray-600 mb-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Top Companies
              </h1>
              <div className="flex flex-col w-full md:flex-row gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 w-full md:w-auto">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-100">1</h1>
                  </div>
                  <div>
                    <h1
                      className="text-lg text-gray-900"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      Company1 Name
                    </h1>
                    <p
                      className="text-sm font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      company1@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 w-full md:w-auto">
                  <div className="w-16 h-16 bg-green-300 rounded-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-500">2</h1>
                  </div>
                  <div>
                    <h1
                      className="text-lg text-gray-900"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      Company2 Name
                    </h1>
                    <p
                      className="text-sm font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      company2@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 w-full md:w-auto">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-700">3</h1>
                  </div>
                  <div>
                    <h1
                      className="text-lg text-gray-900"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      Company3 Name
                    </h1>
                    <p
                      className="text-sm font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      company3@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h1
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              All Companies
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCompanies.map((company) => (
                <Company key={company.id} company={company} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Companies;
