import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin-sidebar";
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
import {
  useCreateBounty,
  type CreateBountyForm,
} from "@/hooks/useCreateBounty";
import { useGetCompanies } from "@/hooks/useGetCompanies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CreateBounty() {
  const { mutate, isPending } = useCreateBounty();
  const { companies, isCompaniesLoading } = useGetCompanies();

  const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    company_id: z.string().min(1, { message: "Company is required" }),
    max_payout: z.number().min(1, { message: "Max payout must be at least 1" }),
    nsfw: z.boolean(),
    cursing: z.boolean(),
    nudity: z.boolean(),
    language: z.string().min(1, { message: "Language is required" }),
    age_restriction: z
      .number()
      .min(1, { message: "Age restriction must be at least 1" }),
    required_views: z
      .number()
      .min(1, { message: "Required views must be at least 1" }),
    required_likes: z
      .number()
      .min(1, { message: "Required likes must be at least 1" }),
    required_comments: z
      .number()
      .min(1, { message: "Required comments must be at least 1" }),
    required_saves: z
      .number()
      .min(1, { message: "Required saves must be at least 1" }),
    platform: z.string().min(1, { message: "Platform is required" }),
    show_other_brands: z.boolean(),
    specific_products: z
      .string()
      .min(1, { message: "Specific products is required" }),
    pay_duration: z.string().min(1, { message: "Pay duration is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      company_id: "",
      max_payout: 1,
      nsfw: true,
      cursing: true,
      nudity: true,
      language: "",
      age_restriction: 1,
      required_views: 1,
      required_likes: 1,
      required_comments: 1,
      required_saves: 1,
      platform: "",
      show_other_brands: true,
      specific_products: "",
      pay_duration: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData: CreateBountyForm = {
      title: values.title,
      description: values.description,
      company_id: values.company_id,
      max_payout: values.max_payout,
      nsfw: values.nsfw,
      cursing: values.cursing,
      nudity: values.nudity,
      language: values.language,
      age_restriction: values.age_restriction,
      required_views: values.required_views,
      required_likes: values.required_likes,
      required_comments: values.required_comments,
      required_saves: values.required_saves,
      platform: values.platform,
      show_other_brands: values.show_other_brands,
      specific_products: values.specific_products,
      pay_duration: values.pay_duration,
    };

    try {
      console.log("Processed form data:", formData);
      const res = mutate(formData);
      console.log("Response:", res);
    } catch (error) {
      console.error("Error creating bounty:", error);
    }
  }

  return (
    <SidebarProvider className="bg-[#efeff0]">
      <AdminSidebar />
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
          Create Bounty
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-2xl mx-auto flex flex-col gap-4"
          >
            {/* Basic Information */}
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Basic Information
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Bounty Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter bounty title"
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
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Enter bounty description"
                          {...field}
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 rounded-3xl shadow-none"
                        />
                      </FormControl>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Company
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2 h-14 rounded-3xl shadow-none">
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isCompaniesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading companies...
                            </SelectItem>
                          ) : (
                            companies?.data.companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_payout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Max Payout ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max payout amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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

            {/* Platform & Requirements */}
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Platform & Requirements
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Platform
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2 h-14 rounded-3xl shadow-none">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="required_views"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                          Required Views
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                    name="required_likes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                          Required Likes
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                    name="required_comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                          Required Comments
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                    name="required_saves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                          Required Saves
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
            </div>

            {/* Content Guidelines */}
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Content Guidelines
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Language
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2 h-14 rounded-3xl shadow-none">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="portuguese">Portuguese</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age_restriction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Age Restriction
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum age"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 h-14 rounded-3xl shadow-none"
                        />
                      </FormControl>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="nsfw"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                            Allow NSFW Content
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cursing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                            Allow Cursing
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nudity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                            Allow Nudity
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="show_other_brands"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                            Allow Other Brands to be Shown
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Additional Details
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="specific_products"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Specific Products
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Describe specific products to feature"
                          {...field}
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 rounded-3xl shadow-none"
                        />
                      </FormControl>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pay_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Payment Duration
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2 h-14 rounded-3xl shadow-none">
                            <SelectValue placeholder="Select payment duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="7_days">7 Days</SelectItem>
                          <SelectItem value="14_days">14 Days</SelectItem>
                          <SelectItem value="30_days">30 Days</SelectItem>
                          <SelectItem value="60_days">60 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage style={{ fontFamily: "KarlaRegular" }} />
                    </FormItem>
                  )}
                />
                <div className="w-full flex justify-center">
                  <Button
                    type="submit"
                    className="w-full mx-auto mt-4 mb-8 h-10 rounded-3xl"
                    style={{ fontFamily: "KarlaSemiBold" }}
                    onClick={() => {
                      console.log("Form errors:", form.formState.errors);
                      console.log("Form is valid:", form.formState.isValid);
                    }}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Create Bounty"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </SidebarProvider>
  );
}

export default CreateBounty;
