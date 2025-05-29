import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import useBounties from "@/hooks/useBounties";
import AppSidebar from "@/components/app-sidebar";
import { useCompany } from "@/hooks/useCompany";

export const CreateReportSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  platform: z.string().min(1, { message: "Platform is required" }),
});

function CreateReport() {
  const { id: bountyId } = useParams();
  const { createSubmission, isCreatingSubmission } = useCreateSubmission();
  const { bounties, isBountiesLoading } = useBounties();

  // Find the specific bounty by ID
  const currentBounty = bounties.find((bounty) => bounty.id === bountyId);
  const { company, isCompanyLoading } = useCompany(currentBounty?.company_id);

  const form = useForm<z.infer<typeof CreateReportSchema>>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      title: "",
      description: "",
      platform: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateReportSchema>) {
    if (!bountyId) {
      console.error("Bounty ID is required");
      return;
    }

    const reportData = {
      bounty_id: bountyId,
      title: values.title,
      description: values.description,
      platform: values.platform,
    };

    try {
      console.log("Submitting report data:", reportData);
      createSubmission(reportData);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  }

  if (isBountiesLoading) {
    return (
      <SidebarProvider className="bg-[#efeff0]">
        <AppSidebar />
        <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              <span style={{ fontFamily: "KarlaRegular" }}>
                Loading bounty details...
              </span>
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AppSidebar />
      <main className="w-full mt-4 md:mt-10 md:ml-10 bg-white rounded-3xl mb-4 px-2">
        <div className="flex flex-row justify-between w-full md:w-[90%] ">
          <div className="flex items-center justify-between w-full">
            <SidebarTrigger className="m-2 md:m-4" />
          </div>
        </div>
        <h1
          className="text-2xl font-bold text-center mb-4"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          Create Report
        </h1>
        {currentBounty ? (
          <div className="text-center mb-6">
            <p
              className="text-lg font-semibold text-gray-800"
              style={{ fontFamily: "KarlaSemiBold" }}
            >
              {currentBounty.title}
            </p>
            {isCompanyLoading ? (
              <div className="flex gap-2 items-center w h-full justify-center">
                <FaSpinner className="animate-spin" />
              </div>
            ) : (
              <div className="flex gap-2 items-center w h-full justify-center">
                <img
                  src={company?.logo}
                  alt="company logo"
                  className="w-7 h-7 rounded-full"
                />
                <p
                  className="text-sm text-[#fa5e06] underline"
                  style={{ fontFamily: "KarlaRegular" }}
                >
                  {company?.name}
                </p>
              </div>
            )}
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "KarlaRegular" }}
            >
              Max Payout: ${currentBounty.max_payout}
            </p>
          </div>
        ) : (
          <p
            className="text-center text-gray-600 mb-6"
            style={{ fontFamily: "KarlaRegular" }}
          >
            Bounty not found for ID: {bountyId}
          </p>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-2xl mx-auto flex flex-col gap-4"
          >
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2 mb-4"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Report Details
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Report Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a descriptive title for your report"
                          {...field}
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 h-14 rounded-3xl shadow-none"
                        />
                      </FormControl>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Report Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Provide a detailed description of your findings, steps to reproduce, and any relevant information"
                          {...field}
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 rounded-3xl shadow-none resize-none"
                        />
                      </FormControl>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Platform
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Web, iOS, Android, API, etc."
                          {...field}
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 h-14 rounded-3xl shadow-none"
                        />
                      </FormControl>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <Button
                type="submit"
                className="w-full mx-auto mt-4 mb-8 h-12 rounded-3xl"
                style={{ fontFamily: "KarlaSemiBold" }}
                onClick={() => {
                  console.log("Form errors:", form.formState.errors);
                  console.log("Form is valid:", form.formState.isValid);
                }}
                disabled={isCreatingSubmission}
              >
                {isCreatingSubmission ? (
                  <div className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Submitting Report...
                  </div>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </SidebarProvider>
  );
}

export default CreateReport;
