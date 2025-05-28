import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useCompanyStore from "@/store/company";
import { UserRole } from "@/types/user";

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

interface Company {
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
    company: {
      id: string;
      name: string;
      phone_number: string;
      email: string;
      logo: string;
      description: string;
      website: string;
      address: string;
      manager: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
}

export const useAuth = (role: "admin" | "user" | "company") => {
  const navigate = useNavigate();
  const { setCompanyDetails } = useCompanyStore();

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
    mutate: loginCompany,
    isPending: isCompanyLoading,
    error: companyError,
  } = useMutation({
    mutationKey: ["company", role],
    mutationFn: async (loginData: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/v1/company/login`, {
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
      const companyData = await response.json();
      return companyData as Company;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        setCompanyDetails(
          { ...data.data.user, role: data.data.user.role as UserRole }, 
          data.data.company
        );
        navigate("/company");
      }
    },
    onError: (error) => {
      console.error("Company login failed:", error);
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
      console.log("Login response:", userData);
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
    loginCompany,
    isCompanyLoading,
    companyError,
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
