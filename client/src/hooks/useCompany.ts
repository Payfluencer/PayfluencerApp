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

interface UseCompanyResponse {
  status: string;
  message: string;
  data: {
    company: Company;
  };
}

const API_URL = "http://localhost:8001";

export const useCompany = (companyId: string | undefined) => {
  const {
    data: company,
    isLoading: isCompanyLoading,
    error: companyError,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const response = await authenticatedFetch(
        `${API_URL}/api/v1/company?id=${companyId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as UseCompanyResponse;
    },
    enabled: !!companyId, // Only run query if companyId is provided
  });

  return {
    company: company?.data?.company,
    isCompanyLoading,
    companyError,
  };
};
