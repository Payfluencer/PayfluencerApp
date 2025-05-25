import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "./useAuth";
import type { LoggedInUser } from "@/components/LoginInwithGoogle";

interface RefreshedUserResponse {
  status: string;
  message: string;
  data: LoggedInUser;
}

const API_URL = "http://localhost:8001";

export const useRefresh = () => {
  const {
    data: refreshedUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["refresh"],
    queryFn: async () => {
      const response = await authenticatedFetch(
        `${API_URL}/api/v1/user/refresh`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = (await response.json()) as RefreshedUserResponse;
      return data.data;
    },
  });
  return { refreshedUser, isLoading, error };
};
