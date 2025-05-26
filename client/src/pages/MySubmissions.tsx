import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useUserSubmissions } from "@/hooks/useSubmissions";
import { Input } from "@/components/ui/input";
import ReportsTable from "@/components/ReportsTable";
import { columns } from "@/lib/reports-submission-column";
import { SubmissionsSummary } from "@/components/SumbissionsChart";
import useUserStore from "@/store/user";

function MySubmissions() {
  const { id } = useUserStore();
  const { userSubmissions, getPendingSubmissions, getSubmissionsByStatus } =
    useUserSubmissions(id);
  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AppSidebar />
      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
        <div className="flex flex-row justify-between w-full md:w-[90%]">
          <SidebarTrigger className="m-2 md:m-4" />
        </div>
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <Input
            placeholder="Search a Submission"
            className="h-12 rounded-4xl w-full md:w-1/2"
            style={{ fontFamily: "KarlaRegular" }}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8 flex-wrap mt-4 mb-12 justify-center">
          <div className="rounded-4xl p-4 w-full md:w-64 border border-[#bfbfc5]">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Pending
            </h1>
            <div className="flex items-center gap-2">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "KarlaRegular" }}
              >
                Number of pending submissions
              </p>
            </div>
            <p
              className="text-4xl text-gray-500 my-8"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              {getPendingSubmissions()?.length || 0}
            </p>
          </div>
          <div className="rounded-4xl p-4 w-full md:w-64 border border-[#bfbfc5]">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Approved
            </h1>
            <div className="flex items-center gap-2">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "KarlaRegular" }}
              >
                Number of approved submissions
              </p>
            </div>
            <p
              className="text-4xl text-gray-500 my-8"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              {userSubmissions?.length ||
                0 - getPendingSubmissions()?.length ||
                0}
            </p>
          </div>
          <div className=" rounded-4xl p-4 w-full md:w-64 border border-[#bfbfc5]">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Rejected
            </h1>
            <div className="flex items-center gap-2">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "KarlaRegular" }}
              >
                Number of rejected submissions
              </p>
            </div>
            <p
              className="text-4xl text-[#fa5e06] my-8"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              {getSubmissionsByStatus("REJECTED")?.length || 0}
            </p>
          </div>
          <div className=" rounded-4xl p-4 w-full md:w-64 border border-[#bfbfc5]">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Settled
            </h1>
            <div className="flex items-center gap-2">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "KarlaRegular" }}
              >
                Number of settled submissions
              </p>
            </div>
            <p
              className="text-4xl text-gray-500 my-8"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              {getSubmissionsByStatus("SETTLED")?.length || 0}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-8 justify-between md:flex-row max-w-[1240px] mx-auto my-0">
          <ReportsTable columns={columns} data={userSubmissions || []} />
          <SubmissionsSummary />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default MySubmissions;
