import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

import logo from "@/assets/images/company.png";
import {
  FaCheck,
  FaComment,
  FaEye,
  FaHeart,
  FaSave,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import bountyImage from "@/assets/images/bountyImage.png";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useGetBounty from "@/hooks/useGetBounty";

function Bounty() {
  const navigate = useNavigate();
  const params = useParams();
  const { bounty, isBountyLoading, bountyError } = useGetBounty(params.id);

  if (isBountyLoading) {
    return (
      <SidebarProvider className="bg-[#efeff0]">
        <AppSidebar />
        <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
          <div className="flex items-center justify-center h-screen">
            <div className="text-xl" style={{ fontFamily: "KarlaRegular" }}>
              <FaSpinner className="text-gray-500 animate-spin" />
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  if (bountyError) {
    return (
      <SidebarProvider className="bg-[#efeff0]">
        <AppSidebar />
        <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
          <div className="flex items-center justify-center h-96">
            <div
              className="text-xl text-red-500"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Error loading bounty: {bountyError.message}
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  if (!bounty) {
    return (
      <SidebarProvider className="bg-[#efeff0]">
        <AppSidebar />
        <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
          <div className="flex items-center justify-center h-96">
            <div className="text-xl" style={{ fontFamily: "KarlaRegular" }}>
              Bounty not found
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AppSidebar />
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
                General Details
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    bounty.is_active
                      ? "bg-[#fa5e06] animate-pulse"
                      : "bg-gray-400"
                  }`}
                ></div>
                <h1
                  className="text-md font-bold"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  {bounty.is_active ? "Active" : "Inactive"}
                </h1>
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
                {bounty.title}
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
                    {bounty.platform}
                  </p>
                </div>
                <div className="">
                  <h1
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Language
                  </h1>
                  <p
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    {bounty.language}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <h1
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Payout
                  </h1>
                  <p
                    className="text-md font-bold text-gray-500"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    ${bounty.max_payout}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:flex-row gap-4 items-center my-4">
            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 bg-white w-full md:w-auto">
              <FaHeart className="text-gray-900 text-4xl" />
              <div>
                <h1
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  {bounty.required_likes}
                </h1>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Required Likes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 bg-white w-full md:w-auto">
              <FaEye className="text-gray-900 text-4xl" />
              <div>
                <h1
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  {bounty.required_views}
                </h1>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Required Views
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 bg-white w-full md:w-auto">
              <FaComment className="text-gray-900 text-4xl" />
              <div>
                <h1
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  {bounty.required_comments}
                </h1>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Required Comments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-4 bg-white w-full md:w-auto">
              <FaSave className="text-gray-900 text-4xl" />
              <div>
                <h1
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  {bounty.required_saves}
                </h1>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Required Saves
                </p>
              </div>
            </div>
          </div>
        </div>
        <h1
          className="text-2xl px-4 md:px-8 mt-8 mb-4 font-bold"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          Bounty Details
        </h1>
        <div className="px-4 md:px-8 flex flex-col items-center justify-center md:justify-start md:flex-row gap-4 md:gap-8">
          <img
            src={bountyImage}
            alt="bountyImage"
            className="w-full h-full md:w-1/4"
          />
          <div>
            {" "}
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              {bounty.title}
            </h1>
            <p
              className="flex flex-col w-full text-gray-500 md:flex-row gap-4 items-center my-4 max-w-2xl leading-relaxed md:text-lg"
              style={{ fontFamily: "KarlaRegular" }}
            >
              {bounty.description}
            </p>
            <Button
              className="w-full bg-[#fa5e06] text-white shadow-md hover:bg-[#e05200] transition-all duration-300 ease-in-out"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              Join Bounty
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between px-4 md:px-8 gap-4 mt-8">
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
                    Other Brands
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Are other brands allowed to feature in the post?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.show_other_brands ? (
                    <FaCheck className="text-green-500 text-2xl" />
                  ) : (
                    <FaTimes className="text-red-500 text-2xl" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    NSFW
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Is the post NSFW?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.nsfw ? (
                    <FaCheck className="text-green-500 text-2xl" />
                  ) : (
                    <FaTimes className="text-red-500 text-2xl" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Cursing
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Does the post contain cursing?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.cursing ? (
                    <FaCheck className="text-green-500 text-2xl" />
                  ) : (
                    <FaTimes className="text-red-500 text-2xl" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Nudity
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Does the post contain nudity?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.nudity ? (
                    <FaCheck className="text-green-500 text-2xl" />
                  ) : (
                    <FaTimes className="text-red-500 text-2xl" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Specific Products
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    {bounty.specific_products ||
                      "No specific products mentioned"}
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.specific_products ? (
                    <FaCheck className="text-green-500 text-2xl" />
                  ) : (
                    <FaTimes className="text-red-500 text-2xl" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Age Restrictions
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Is the post age restricted?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.age_restriction > 0 ? (
                    <span className="text-orange-500">
                      {bounty.age_restriction}+
                    </span>
                  ) : (
                    <FaTimes className="text-green-500 text-2xl" />
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              Payment Details
            </h1>
            <div className="flex flex-col gap-2 mt-2 mb-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Payment Duration
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    How long will the payment take to be processed?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.pay_duration}
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
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    What is the maximum payout for this bounty?
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  ${bounty.max_payout}
                </p>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                <div className="">
                  <h1
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Status
                  </h1>
                  <p
                    className="text-xs font-bold text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Current bounty status
                  </p>
                </div>
                <p
                  className="text-md font-bold text-gray-500"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  {bounty.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Bounty;
