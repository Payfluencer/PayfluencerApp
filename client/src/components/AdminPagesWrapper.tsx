import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";

function AdminPagesWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4">
        <div className="flex flex-row justify-between w-full md:w-[90%]">
          <SidebarTrigger className="m-2 md:m-4" />
        </div>
        <div className="w-full px-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default AdminPagesWrapper;
