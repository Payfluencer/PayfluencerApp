import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8001";

interface Admin {
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      phoneNumber: string;
      createdAt: string;
      isActive: boolean;
    };
  };
}
export const useAuth = (role: "admin" | "user") => {
  const navigate = useNavigate();
  const {
    mutate: loginAdmin,
    isPending: isAdminLoading,
    error: adminError,
  } = useMutation({
    mutationKey: ["admin", role],
    mutationFn: async (loginData: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/v1/user/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const adminData = await response.json();
      console.log(adminData);
      return adminData as Admin;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        navigate("/home", { state: { adminDetails: data } });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    loginAdmin,
    isAdminLoading,
    adminError,
  };
};

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please login again");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

export default useAuth;
