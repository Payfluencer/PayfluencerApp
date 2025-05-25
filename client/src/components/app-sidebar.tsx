/* eslint-disable react-hooks/exhaustive-deps */
import { Home, Inbox, Settings, Receipt, Coins } from "lucide-react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "@/store/user";
import type { LoggedInUser } from "./LoginInwithGoogle";
import { authenticatedFetch } from "@/hooks/useAuth";
import { FaSpinner } from "react-icons/fa";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
    path: "/home",
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
    path: "/inbox",
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
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    path: "/settings",
  },
];
const API_URL = "http://localhost:8001";

export function AppSidebar() {
  const { setDetails, id } = useUserStore();
  const [loading, setLoading] = useState(true);

  const path = useLocation();
  const navigate = useNavigate();
  const pathname = path.pathname;

  useEffect(() => {
    const refreshUser = async () => {
      if (!id) {
        const response = await authenticatedFetch(
          `${API_URL}/api/v1/user/refresh`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        const user = data.data as LoggedInUser;
        if (user) {
          setDetails(user);
          setLoading(false);
        } else {
          navigate("/auth");
        }
      }
    };
    refreshUser();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 backdrop-blur-lg w-[100vw] h-[100vh] flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-2xl text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <Sidebar className="border-none ">
      <SidebarContent className="bg-[#f7f9f6]">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
