import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin-sidebar";
import AdminChatList from "@/components/AdminChatList";

function AdminInbox() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4">
        <div className="flex flex-row justify-between w-full md:w-[90%]">
          <SidebarTrigger className="m-2 md:m-4" />
        </div>
        <div className="w-full px-4 pb-8">
          <h1 
            className="text-2xl font-bold mb-6" 
            style={{ fontFamily: "KarlaSemiBold" }}
          >
            Admin Inbox
          </h1>
          <p 
            className="text-gray-600 mb-6" 
            style={{ fontFamily: "KarlaRegular" }}
          >
            Manage conversations with users. Click on any chat to start messaging.
          </p>
          
          <AdminChatList />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default AdminInbox;
