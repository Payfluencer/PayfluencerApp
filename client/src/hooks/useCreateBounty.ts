import { serverUrl } from "@/lib/config";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export interface CreateBountyForm {
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
  show_other_brands: boolean;
  specific_products: string;
  pay_duration: string;
}

interface CreateBountyResponse {
  status: string;
  message: string;
  data: {
    bounty: {
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
    };
  };
}

export const useCreateBounty = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async (bounty: CreateBountyForm) => {
      const response = await fetch(serverUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bounty),
      });
      if (!response.ok) {
        throw new Error("Failed to create bounty");
      }
      const data: CreateBountyResponse = await response.json();
      return data;
    },
    onSuccess: (data) => {
      console.log("Bounty created successfully", data);
      navigate("/admin/bounties");
    },
    onError: (error) => {
      console.error("Error creating bounty", error);
    },
  });

  return { mutate, isPending };
};
