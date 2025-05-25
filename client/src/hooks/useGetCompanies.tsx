import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "./useAuth";

export interface Company {
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
}

interface UseGetCompaniesResponse {
  status: string;
  message: string;
  data: {
    companies: Company[];
    totalCompanies: number;
    page: number;
  };
}

const API_URL = "http://localhost:8001";

export const useGetCompanies = () => {
  const {
    data: companies,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await authenticatedFetch(
        `${API_URL}/api/v1/company/all`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as UseGetCompaniesResponse;
    },
  });
  return { companies, isCompaniesLoading, companiesError };
};
