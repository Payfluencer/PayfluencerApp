import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "./useAuth";

const API_URL = "http://localhost:8001";

export interface Bounty {
  id: string;
  title: string;
  description: string;
  company_id: string;
  max_payout: number;
  nsfw: boolean;
  cursing: boolean;
  nudity: boolean;
  language: string;
  age_restriction: number;
  required_views: number;
  required_likes: number;
  required_comments: number;
  required_saves: number;
  platform: string;
  status: string;
  is_active: boolean;
  show_other_brands: boolean;
  specific_products: string;
  pay_duration: string;
  created_at: string;
  update_at: string;
}

interface UseGetBountyResponse {
  status: string;
  message: string;
  data: {
    bounty: Bounty;
  };
}

const useGetBounty = (id: string | undefined) => {
  const {
    data: bountyData,
    isLoading: isBountyLoading,
    error: bountyError,
    refetch: refetchBounty,
  } = useQuery({
    queryKey: ["bounty", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Bounty ID is required");
      }
      const response = await authenticatedFetch(
        `${API_URL}/api/v1/bounties/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      return data as UseGetBountyResponse;
    },
    enabled: !!id,
  });

  return {
    bounty: bountyData?.data?.bounty,
    isBountyLoading,
    bountyError,
    refetchBounty,
  };
};

export default useGetBounty;
