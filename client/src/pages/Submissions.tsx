import AdminPagesWrapper from "@/components/AdminPagesWrapper";
import ReportsTable from "@/components/ReportsTable";
import { SubmissionsSummary } from "@/components/SumbissionsChart";
import { Input } from "@/components/ui/input";
import { columns } from "@/lib/reports-submission-column";
import { useSubmissions } from "@/hooks/useSubmissions";

function Submissions() {
  const { submissionsResponse } = useSubmissions();
  return (
    <div className="bg-[#efeff0]">
      <AdminPagesWrapper>
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
              14
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
              14
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
              7
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
              2
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-8 justify-between md:flex-row">
          <SubmissionsSummary />
          <ReportsTable
            columns={columns}
            data={submissionsResponse?.data.reports || []}
          />
        </div>
      </AdminPagesWrapper>
    </div>
  );
}

export default Submissions;
