import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

import logo from "@/assets/images/google.png";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import AdminSidebar from "@/components/admin-sidebar";

function Submission() {
  const navigate = useNavigate();
  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AdminSidebar />
      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
        <div className="flex flex-row justify-between w-full md:w-[90%] ">
          <div className="flex items-center justify-between w-full">
            <SidebarTrigger className="m-2 md:m-4" />
            <p
              className="flex md:hidden underline text-md px-4"
              style={{ fontFamily: "KarlaRegular" }}
              onClick={() => navigate(-1)}
            >
              Back
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center mb-8 bg-[#f8f8f8] rounded-4xl px-4 md:px-8">
          <div className="flex justify-between items-center my-2 w-full mt-4">
            <div className="flex items-center gap-4">
              <div className="w-2 rounded-2xl h-8 bg-[#fa5e06]"></div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Report Details
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#fa5e06] animate-pulse"></div>
                <h1
                  className="text-md font-bold"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Active
                </h1>
              </div>
              <FaEdit className="text-gray-900 text-lg cursor-pointer" />
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
                Bounty Name
              </h1>
              <div className="flex items-center justify-between mt-2 w-full">
                <div className="">
                  <h1
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Platform
                  </h1>
                  <p
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Twitter
                  </p>
                </div>
                <div className="">
                  <h1
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Status
                  </h1>
                  <p
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    PENDING
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <h1
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Submission Date
                  </h1>
                  <p
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    2025-05-26
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-8 my-4">
          <div className="flex flex-col gap-2">
            <h1
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Submission Title
            </h1>
            <p
              className="text-md font-bold text-gray-500 max-w-2xl leading-relaxed"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
          </div>
        </div>

        <div className=" px-4 md:px-8 gap-4 mt-8">
          <div className="w-full md:w-1/2">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              Additional Details
            </h1>
            <div className="flex flex-col gap-2 mt-2 mb-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Submitted By
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  ></p>
                </div>
                <p
                  className="text-md font-bold text-gray-500 underline cursor-pointer"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  John Doe
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Max Payout
                  </h1>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  $1,000
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Payment Method
                  </h1>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Wallet address
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Submission;
