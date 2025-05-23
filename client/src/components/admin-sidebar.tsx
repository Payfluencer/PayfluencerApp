import { Home, Inbox, Settings, Receipt, Coins, Users } from "lucide-react";
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
import { useLocation } from "react-router-dom";

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
    path: "/admin/inbox",
  },
  {
    title: "Bounties",
    url: "#",
    icon: Coins,
    path: "/bounties",
  },
  {
    title: "Submissions",
    url: "#",
    icon: Receipt,
    path: "/submissions",
  },
  {
    title: "Companies",
    url: "#",
    icon: Users,
    path: "/companies",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    path: "/settings",
  },
];

export function AdminSidebar() {
  const path = useLocation();
  const pathname = path.pathname;
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
                Payfluence
              </h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="">
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
