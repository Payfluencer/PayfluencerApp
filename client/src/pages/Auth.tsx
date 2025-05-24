import Lottie from "lottie-react";
import animationData from "../assets/lottie/ms.json";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
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

function UserAuthentication() {
  return (
    <div className="w-[400px] h-[400px] rounded-md flex flex-col items-center justify-center gap-4 bg-white p-4 mx-2 md:mx-0">
      <Lottie animationData={animationData} loop={true} />
      <Link
        to="/home"
        className="bg-[#000] text-white px-4 flex items-center w-full gap-2 py-2 rounded-xl text-xl h-12"
        style={{ fontFamily: "KarlaRegular" }}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <FaGoogle /> Sign in with Google
        </div>
      </Link>
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
        Welcome Back
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

function Auth() {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f6f7f9]">
      <div className="flex items-center mb-8">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <h1
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          Payfluence
        </h1>
      </div>
      {isAdmin ? <AdminAuthentication /> : <UserAuthentication />}
      <Button
        onClick={() => setIsAdmin(!isAdmin)}
        className="px-4 flex items-center gap-2 py-2 rounded-md h-12 justify-center text-blue-500 bg-transparent hover:bg-transparent shadow-none text-sm cursor-pointer"
        style={{ fontFamily: "KarlaRegular" }}
      >
        {isAdmin ? "User Login" : "Admin Login"}
      </Button>
    </div>
  );
}

export default Auth;
