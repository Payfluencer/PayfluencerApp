import useUserStore from "@/store/user";
import AppSidebar from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { useUser } from "@/hooks/useUsers";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function Profile() {
  const { name, email, id } = useUserStore((state) => state);
  const { user } = useUser(id);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div
        className="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center"
        onClick={() => setIsEditing(false)}
      >
        <div className="bg-[#fff] rounded-4xl p-4 flex flex-col gap-2 w-full md:w-1/2 border border-gray-200 px-4">
          <div className="w-full flex flex-col items-center justify-center mb-8 bg-[#f8f8f8] rounded-4xl px-4 md:px-8">
            <div className="flex justify-between items-center my-2 w-full mt-4">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-2 rounded-2xl h-8 bg-[#fa5e06]"></div>
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Edit Payment Method
                </h1>
              </div>
            </div>
          </div>
          <p
            className="text-sm text-gray-500 text-center"
            style={{ fontFamily: "KarlaRegular" }}
          >
            Current payment method: Wallet Address
          </p>
          <div className="w-full flex flex-col items-center justify-center mb-4">
            <Select>
              <SelectTrigger className="w-full md:w-1/2 h-12 border border-gray-200 rounded-2xl shadow-none">
                <SelectValue
                  placeholder="Select a payment method"
                  className="py-4 h-12"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="bank">Wallet Address</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <Button
              className="bg-gray-900 hover:bg-gray-700 text-lg transition-all duration-300 text-white flex items-center gap-2 w-full rounded-2xl md:w-1/2"
              style={{ fontFamily: "KarlaSemiBold" }}
              onClick={() => setIsEditing(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AppSidebar />
      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
        <div className="flex flex-row justify-between w-full md:w-[90%]">
          <SidebarTrigger className="m-2 md:m-4" />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full md:w-1/2 mt-12 border border-gray-200 rounded-4xl p-4">
            <div className="w-full">
              <div className="w-full my-4 flex flex-col items-center justify-center">
                <h1
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Personal Details
                </h1>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  Account details
                </p>
                <div className="w-full my-4">
                  <h1
                    className="font-bold text-gray-900 text-xl"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Username
                  </h1>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    {name}
                  </p>
                </div>
                <div className="w-full my-4">
                  <h1
                    className="font-bold text-gray-900 text-xl"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Email
                  </h1>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    {email}
                  </p>
                </div>
                <div className="w-full my-4">
                  <h1
                    className="font-bold text-gray-900 text-xl"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Phone Number
                  </h1>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    {user?.phoneNumber || "Add a mobile number"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-12 border border-gray-200 rounded-4xl p-4">
            <div className="w-full">
              <div className="w-full my-4 flex flex-col items-center justify-center">
                <h1
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ fontFamily: "KarlaSemiBold" }}
                >
                  Financial Details
                </h1>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  My finances & earnings
                </p>
                <div className="w-full my-4">
                  <h1
                    className="font-bold text-gray-900 text-xl"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Wallet Address
                  </h1>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    0xgxe20o838y...
                  </p>
                </div>
                <div className="w-full my-4">
                  <h1
                    className="font-bold text-gray-900 text-xl"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Total Earnings
                  </h1>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    $0.00
                  </p>
                </div>
                <div className="w-full my-4 flex flex-row items-center justify-between">
                  <div className="">
                    <h1
                      className="font-bold text-gray-900 text-xl"
                      style={{ fontFamily: "KarlaSemiBold" }}
                    >
                      Payment Method
                    </h1>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "KarlaRegular" }}
                    >
                      Wallet Address
                    </p>
                  </div>
                  <FaEdit
                    className="text-gray-500 cursor-pointer mr-4"
                    size={20}
                    onClick={() => setIsEditing(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Profile;
