import { useState } from "react";
import { FaEllipsisH, FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import logo from "@/assets/images/admin.png";

export interface CompanyProps {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  logo: string;
  description: string;
  website: string;
  address: string;
  manager: {
    id: string;
    name: string;
    email: string;
  };
}

function Company({ company }: { company: CompanyProps }) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (menuOpen) {
    return (
      <div className="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-[#fff] rounded-4xl p-4 flex flex-col gap-2 w-full md:w-1/2 border border-gray-200">
          <div className="w-full flex flex-col items-center justify-center mb-8 bg-[#f8f8f8] rounded-4xl px-4 md:px-8">
            <div className="flex justify-between items-center my-2 w-full mt-4">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-2 rounded-2xl h-8 bg-[#fa5e06]"></div>
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Company Details
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    className="bg-[#fa5e06] text-white flex items-center gap-2"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    <FaPlus className="text-white" />
                    Delete Company
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center gap-8 my-4">
              <img
                src={company.logo}
                alt="logo"
                className="w-16 h-16 md:w-24 md:h-24 border border-gray-200 rounded-full"
              />
              <div className="flex flex-col w-full md:w-1/2">
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {company.name}
                </h1>
                <div className="flex flex-col md:flex-row justify-between mt-2 w-full">
                  <div className="flex flex-col items-start mb-2">
                    <h1
                      className="text-lg font-bold text-gray-500"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      Email
                    </h1>
                    <p
                      className="text-md font-bold text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      {company.email}
                    </p>
                  </div>

                  <div className="flex flex-col items-start">
                    <h1
                      className="text-lg font-bold text-gray-500"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      Website
                    </h1>
                    <p
                      className="text-md font-bold text-gray-500 underline"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      {company.website}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start mb-2">
            <div className="flex flex-col items-start mb-2">
              <h1
                className="text-lg font-bold"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Manager Name
              </h1>
              <p
                className="text-md font-bold text-gray-500"
                style={{ fontFamily: "KarlaRegular" }}
              >
                {company.manager.name}
              </p>
            </div>
            <div className="flex flex-col items-start mb-2">
              <h1
                className="text-lg font-bold"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Email
              </h1>
              <p
                className="text-md font-bold text-gray-500"
                style={{ fontFamily: "KarlaRegular" }}
              >
                {company.manager.email}
              </p>
            </div>
            <div className="flex flex-col items-start mb-2">
              <h1
                className="text-lg font-bold"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Password
              </h1>
              <p
                className="text-md font-bold text-gray-500 flex justify-between items-center gap-2"
                style={{ fontFamily: "KarlaRegular" }}
              >
                **********
                <FaEye className="text-gray-500 cursor-pointer" />
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <Button
              className="bg-[#fa5e06] hover:bg-[#fa5e06]/80 text-lg transition-all duration-300 text-white flex items-center gap-2 w-full rounded-2xl md:w-1/2"
              style={{ fontFamily: "KarlaSemiBold" }}
              onClick={() => setMenuOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={company.logo}
          alt={company.name}
          className="w-14 h-14 rounded-full"
        />
        <div className="flex flex-col">
          <h1
            className="text-lg font-bold"
            style={{ fontFamily: "KarlaSemiBold" }}
          >
            {company.name}
          </h1>
          <p
            className="text-sm text-gray-500"
            style={{ fontFamily: "KarlaRegular" }}
          >
            {company.manager.email}
          </p>
        </div>
      </div>
      <FaEllipsisH
        className="text-gray-500"
        onClick={() => setMenuOpen(!menuOpen)}
      />
    </div>
  );
}

export default Company;
