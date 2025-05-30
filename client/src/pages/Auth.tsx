import Lottie from "lottie-react";
import animationData from "../assets/lottie/ms.json";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logo from "../assets/images/image.png";
import { useAuth } from "../hooks/useAuth";
import GoogleLoginBtn from "@/components/LoginInwithGoogle";

function UserAuthentication() {
  return (
    <div className="w-[400px] h-[400px] rounded-md flex flex-col items-center justify-center gap-4 bg-white p-4 mx-2 md:mx-0">
      <Lottie animationData={animationData} loop={true} />
      <GoogleLoginBtn />
    </div>
  );
}

function AdminAuthentication() {
  const { loginAdmin, isAdminLoading, adminError } = useAuth("admin");
  const formSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(50),
    password: z
      .string()
      .min(2, {
        message: "Password must be at least 2 characters.",
      })
      .max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      loginAdmin({
        email: values.username,
        password: values.password,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
  return (
    <div className="w-[400px] h-[400px] rounded-md flex flex-col items-center justify-center gap-4 bg-white p-4 mx-2 md:mx-0">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "KarlaSemiBold" }}
      >
        Welcome Back Admin
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@admin.com"
                    {...field}
                    style={{ fontFamily: "KarlaRegular" }}
                  />
                </FormControl>
                <FormMessage style={{ fontFamily: "KarlaRegular" }} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    type="password"
                    {...field}
                    style={{ fontFamily: "KarlaRegular" }}
                  />
                </FormControl>
                <FormMessage style={{ fontFamily: "KarlaRegular" }} />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`w-full bg-[#fa5e06] text-white mt-4 hover:bg-[#fa5e06]/80 ${
              isAdminLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isAdminLoading ? (
              <span className="animate-spin">
                <FaSpinner />
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
      {adminError && (
        <p
          className="text-red-500 text-sm"
          style={{ fontFamily: "KarlaRegular" }}
        >
          {adminError.message}
        </p>
      )}
    </div>
  );
}

function CompanyAuthentication() {
  const { loginCompany, isCompanyLoading, companyError } = useAuth("company");
  const formSchema = z.object({
    email: z
      .string()
      .email({
        message: "Please enter a valid email.",
      })
      .min(2, {
        message: "Email must be at least 2 characters.",
      }),
    password: z
      .string()
      .min(2, {
        message: "Password must be at least 2 characters.",
      })
      .max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      loginCompany({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Company login failed:", error);
    }
  }

  return (
    <div className="w-[400px] h-[400px] rounded-md flex flex-col items-center justify-center gap-4 bg-white p-4 mx-2 md:mx-0">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "KarlaSemiBold" }}
      >
        Company Manager
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="company@example.com"
                    type="email"
                    {...field}
                    style={{ fontFamily: "KarlaRegular" }}
                  />
                </FormControl>
                <FormMessage style={{ fontFamily: "KarlaRegular" }} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ fontFamily: "KarlaSemiBold" }}>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    type="password"
                    {...field}
                    style={{ fontFamily: "KarlaRegular" }}
                  />
                </FormControl>
                <FormMessage style={{ fontFamily: "KarlaRegular" }} />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`w-full bg-[#fa5e06] text-white mt-4 hover:bg-[#fa5e06]/80 ${
              isCompanyLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCompanyLoading ? (
              <span className="animate-spin">
                <FaSpinner />
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
      {companyError && (
        <p
          className="text-red-500 text-sm"
          style={{ fontFamily: "KarlaRegular" }}
        >
          {companyError.message}
        </p>
      )}
    </div>
  );
}

function Auth() {
  const [authType, setAuthType] = useState<"user" | "admin" | "company">("user");

  const renderAuthComponent = () => {
    switch (authType) {
      case "admin":
        return <AdminAuthentication />;
      case "company":
        return <CompanyAuthentication />;
      default:
        return <UserAuthentication />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#efeff0]">
      <div className="flex items-center mb-8">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <h1
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          Payfluencer
        </h1>
      </div>
      {renderAuthComponent()}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => setAuthType("user")}
          className={`px-4 py-2 rounded-md h-12 text-sm ${
            authType === "user"
              ? "bg-[#fa5e06] text-white"
              : "bg-transparent text-blue-500 hover:bg-transparent"
          }`}
          style={{ fontFamily: "KarlaRegular" }}
        >
          User Login
        </Button>
        <Button
          onClick={() => setAuthType("admin")}
          className={`px-4 py-2 rounded-md h-12 text-sm ${
            authType === "admin"
              ? "bg-[#fa5e06] text-white"
              : "bg-transparent text-blue-500 hover:bg-transparent"
          }`}
          style={{ fontFamily: "KarlaRegular" }}
        >
          Admin Login
        </Button>
        <Button
          onClick={() => setAuthType("company")}
          className={`px-4 py-2 rounded-md h-12 text-sm ${
            authType === "company"
              ? "bg-[#fa5e06] text-white"
              : "bg-transparent text-blue-500 hover:bg-transparent"
          }`}
          style={{ fontFamily: "KarlaRegular" }}
        >
          Company Login
        </Button>
      </div>
    </div>
  );
}

export default Auth;
