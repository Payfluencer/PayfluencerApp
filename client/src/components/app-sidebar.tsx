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

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Bounties",
    url: "#",
    icon: Coins,
  },
  {
    title: "My Submissions",
    url: "#",
    icon: Receipt,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
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
                <SidebarMenuItem key={item.title} className="my-2">
                  <SidebarMenuButton asChild className="py-2">
                    <a href={item.url}>
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
