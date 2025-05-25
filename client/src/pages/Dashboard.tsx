import AdminDashboard from "./AdminDashboard";
import UserDashboard from "@/components/UserDashboard";
import useUserStore from "@/store/user";

function Dashboard() {
  const { role } = useUserStore((state) => state);
  if (role === "ADMIN") {
    return <AdminDashboard />;
  }
  return (
    <div className="bg-[#efeff0]">
      <UserDashboard />
    </div>
  );
}

export default Dashboard;
