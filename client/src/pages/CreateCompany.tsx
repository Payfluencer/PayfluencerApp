import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin-sidebar";
import { Input } from "@/components/ui/input";
import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
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
import { useCreateCompany } from "@/hooks/useCreateCompany";

export interface CreateCompanyForm {
  name: string;
  logo: string;
  description: string;
  website: string;
  phone_number: string;
  email: string;
  address?: string;
  manager: {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
  };
}

export const CreateCompanySchema = z.object({
  name: z.string().min(3),
  logo: z.string().url(),
  description: z.string().min(20),
  website: z.string().url(),
  phone_number: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5).optional(),

  // Company manager details
  manager: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    phone_number: z.string().min(10).optional(),
  }),
});

function CreateCompany() {
  const { mutate, isPending } = useCreateCompany();
  const form = useForm<z.infer<typeof CreateCompanySchema>>({
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
      logo: "",
      description: "",
      website: "",
      phone_number: "",
      email: "",
      address: "",
      manager: {
        name: "",
        email: "",
        phone_number: "",
        password: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof CreateCompanySchema>) {
    const formData: CreateCompanyForm = {
      name: values.name,
      logo: values.logo,
      description: values.description,
      website: values.website,
      email: values.email,
      phone_number: values.phone_number,
      address: values.address,
      manager: values.manager,
    };

    try {
      console.log("Processed form data:", formData);
      const res = mutate(formData);
      console.log("Response:", res);
    } catch (error) {
      console.error("Error creating company:", error);
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
          Create Company
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-2xl mx-auto flex flex-col gap-4"
          >
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center w-full">
                  <h1
                    className="text-lg font-bold flex items-center gap-2"
                    style={{ fontFamily: "KarlaSemiBold" }}
                  >
                    Company Logo
                    {form.watch("logo") && (
                      <FaCheck className="text-green-500" />
                    )}
                  </h1>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "KarlaRegular" }}
                  >
                    Upload a logo for your company
                  </p>
                  <div className="flex flex-col items-center justify-center w-full">
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          {field.value ? (
                            <div className="relative w-24 h-24 mt-2 flex items-center justify-center p-1 rounded-full border border-gray-200 mx-auto">
                              <img
                                src={field.value}
                                alt="company logo"
                                className="h-16 rounded-2xl w-16"
                              />
                              <div className="absolute top-0 cursor-pointer right-0 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                                <FaTimes
                                  className="text-white"
                                  onClick={() => {
                                    field.onChange("");
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 items-center w-full">
                              <FormControl>
                                <Input
                                  className="w-full mt-2 h-14 rounded-3xl shadow-none md:w-3/4"
                                  style={{ fontFamily: "KarlaRegular" }}
                                  placeholder="Image URL of the company"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage
                                style={{ fontFamily: "KarlaRegular" }}
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Company Details
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Name"
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
                        Company Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Company Description"
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Company Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Website"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Company Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Email"
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
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Company Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Phone Number"
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Company Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company Address"
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
            <div className="flex flex-col items-center justify-center w-full border border-gray-200 rounded-4xl p-4">
              <h1
                className="text-lg font-bold flex items-center gap-2"
                style={{ fontFamily: "KarlaSemiBold" }}
              >
                Manager Details
              </h1>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="manager.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Manager Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Manager Name"
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
                  name="manager.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Manager Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Manager Email"
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
                  name="manager.phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{ fontFamily: "KarlaSemiBold" }}
                        className="mt-2"
                      >
                        Manager Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Manager Phone Number"
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
                  name="manager.password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                        Manager Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Manager Password"
                          {...field}
                          style={{ fontFamily: "KarlaRegular" }}
                          className="w-full mt-2 h-14 rounded-3xl shadow-none"
                        />
                      </FormControl>
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
                      "Create Company"
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

export default CreateCompany;
