import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "./useAuth";
import { useMemo } from "react";

const API_URL = "http://localhost:8001";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string | null;
  created_at: string;
}

interface UseUsersResponse {
  status: string;
  message: string;
  data: {
    users: User[];
    totalUsers: number;
    page: number;
  };
}

export const useUsers = () => {
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await authenticatedFetch(`${API_URL}/api/v1/user/all`, {
        method: "GET",
      });
      const data = await response.json();
      return data as UseUsersResponse;
    },
  });
  const topEarners = useMemo(() => {
    return users?.data.users.filter((user) => user.role === "USER");
  }, [users]);
  return {
    users,
    isUsersLoading,
    usersError,
    topEarners,
  };
};
