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
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "@/store/user";
import type { LoggedInUser } from "./LoginInwithGoogle";
import { FaSignOutAlt, FaSpinner } from "react-icons/fa";

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
const API_URL = "http://localhost:8001";

export function AppSidebar() {
  const { setDetails, id, logout } = useUserStore();
  const [loading, setLoading] = useState(true);

  const path = useLocation();
  const navigate = useNavigate();
  const pathname = path.pathname;

  useEffect(() => {
    const refreshUser = async () => {
      console.log("User store id:", id);
      console.log("id length:", id.length);
      if (id.length === 0) {
        setLoading(true);
        try {
          console.log("Attempting to refresh user session...");
          console.log("Current cookies:", document.cookie);
          const response = await fetch(`${API_URL}/api/v1/user/refresh`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Refresh response status:", response.status);
          console.log("Refresh response ok:", response.ok);

          if (!response.ok) {
            console.log(
              `Authentication failed with status ${response.status}, redirecting to auth`
            );
            const errorText = await response.text();
            console.log("Error response:", errorText);
            navigate("/auth");
            return;
          }

          const data = await response.json();
          console.log("Refresh response data:", data);
          const user = data.data?.user as LoggedInUser;

          if (user && data.status === "success") {
            console.log("Successfully refreshed user:", user);
            setDetails(user);
            setLoading(false);
          } else {
            console.log("No valid user in response, redirecting to auth");
            navigate("/auth");
          }
        } catch (error) {
          console.error("Error refreshing user:", error);
          navigate("/auth");
        }
      } else {
        setLoading(false);
      }
    };
    refreshUser();
  }, []);

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
