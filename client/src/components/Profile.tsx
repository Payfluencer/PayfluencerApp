import useUserStore from "@/store/user";
import AppSidebar from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { useUser } from "@/hooks/useUsers";

function Profile() {
  const { name, email, id } = useUserStore((state) => state);
  const { user } = useUser(id);

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
                <div className="w-full my-4">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Profile;
