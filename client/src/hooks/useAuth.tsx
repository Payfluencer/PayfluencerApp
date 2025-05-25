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

interface User {
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
      profilePicture: string;
      isNewUser: true;
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
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const adminData = await response.json();
      return adminData as Admin;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        navigate("/admin");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const {
    mutate: loginUser,
    isPending: isUserLoading,
    error: userError,
  } = useMutation({
    mutationKey: ["user", role],
    mutationFn: async (idToken: string) => {
      const response = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const userData = await response.json();
      console.log(userData);
      return userData as User;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        navigate("/home", { state: { userDetails: data.data.user } });
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
    loginUser,
    isUserLoading,
    userError,
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
