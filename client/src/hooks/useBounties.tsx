import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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

interface UseBountyResponse {
  status: string;
  message: string;
  data: {
    bounties: Bounty[];
    totalBounties: number;
    page: number;
  };
}

const useBounties = () => {
  const {
    data: bounties,
    isLoading: isBountiesLoading,
    error: bountiesError,
  } = useQuery({
    queryKey: ["bounties"],
    queryFn: async () => {
      const response = await authenticatedFetch(`${API_URL}/api/v1/bounties`, {
        method: "GET",
      });
      const data = await response.json();
      return data as UseBountyResponse;
    },
  });

  const totalPayout = useMemo(() => {
    if (!bounties?.data?.bounties || bounties.data.bounties.length === 0)
      return 0;
    return bounties.data.bounties.reduce(
      (acc, bounty) => acc + bounty.max_payout,
      0
    );
  }, [bounties?.data?.bounties]);

  const payoutChange = useMemo(() => {
    if (!bounties?.data?.bounties || bounties.data.bounties.length === 0)
      return {
        payoutChange: 0,
        payoutChangeAmount: 0,
      };
    const lastMonth = bounties.data.bounties.filter((bounty) => {
      const bountyDate = new Date(bounty.created_at);
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return bountyDate > lastMonthDate;
    });
    const thisMonth = bounties.data.bounties.filter((bounty) => {
      const bountyDate = new Date(bounty.created_at);
      const thisMonthDate = new Date();
      thisMonthDate.setMonth(thisMonthDate.getMonth());
      return bountyDate > thisMonthDate;
    });
    const lastMonthPayout = lastMonth.reduce(
      (acc, bounty) => acc + bounty.max_payout,
      0
    );
    const thisMonthPayout = thisMonth.reduce(
      (acc, bounty) => acc + bounty.max_payout,
      0
    );
    return {
      payoutChange:
        ((thisMonthPayout - lastMonthPayout) / lastMonthPayout) * 100,
      payoutChangeAmount: thisMonthPayout - lastMonthPayout,
      lastMonthPayout,
    };
  }, [bounties?.data?.bounties]);

  return {
    bounties: bounties?.data?.bounties || [],
    isBountiesLoading,
    bountiesError,
    totalPayout,
    payoutChange,
    allBounties: bounties?.data?.bounties || [],
  };
};

export default useBounties;
