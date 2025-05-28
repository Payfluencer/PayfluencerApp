/* eslint-disable react-hooks/exhaustive-deps */
import { Home, Inbox, Receipt, Coins } from "lucide-react";
import logo from "../assets/images/image.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import useUserStore from "@/store/user";
import withUserAuthRequired from "@/HOC/user-hoc";
import { FaSignOutAlt, FaSpinner } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
    path: "/home",
  },
  {
    title: "Notifications",
    url: "#",
    icon: Inbox,
    path: "/notifications",
  },
  {
    title: "Bounties",
    url: "#",
    icon: Coins,
    path: "/bounties",
  },
  {
    title: "My Submissions",
    url: "#",
    icon: Receipt,
    path: "/submissions",
  },
];

function AppSidebar() {
  const { logout } = useUserStore();
  const [loading] = useState(false);

  const path = useLocation();
  const navigate = useNavigate();
  const pathname = path.pathname;

  if (loading) {
    return (
      <div className="fixed inset-0 backdrop-blur-lg w-[100vw] h-[100vh] flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-2xl text-gray-00" />
          <p
            style={{ fontFamily: "KarlaRegular" }}
            className="text-gray-900 mt-4"
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Sidebar className="border-none ">
      <SidebarContent className="bg-[#efeff0]">
        <SidebarGroup className="">
          <SidebarGroupLabel className="my-10">
            <div className="flex items-center">
              <img src={logo} alt="logo" className="w-10 h-10" />
              <h1
                className="text-2xl font-bold uppercase"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Payfluencer
              </h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-2">
                  <SidebarMenuButton
                    asChild
                    className={`py-4 h-10 my-2 duration-300 ease-in-out transition-all hover:bg-[#fa5e06] hover:text-white ${
                      pathname === item.path ? "bg-[#fa5e06] text-white" : ""
                    }`}
                  >
                    <a href={item.path} className="">
                      <item.icon style={{ width: "20px", height: "20px" }} />
                      <span
                        style={{ fontFamily: "KarlaRegular" }}
                        className="ml-2 text-lg"
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuButton
                asChild
                className={`py-4 h-10 my-2 duration-300 ease-in-out transition-all hover:bg-[#fa5e06] hover:text-white`}
                onClick={() => {
                  logout(); // Clear the persisted store
                  navigate("/auth");
                }}
              >
                <a href="/" className="">
                  <FaSignOutAlt />
                  <span
                    style={{ fontFamily: "KarlaRegular" }}
                    className="ml-2 text-lg"
                  >
                    Logout
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default withUserAuthRequired(AppSidebar);
