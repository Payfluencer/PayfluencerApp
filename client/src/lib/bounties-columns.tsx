import { type ColumnDef } from "@tanstack/react-table";

import { type Bounty } from "@/hooks/useBounties";

// export interface Bounty {
//     id: string;
//     title: string;
//     description: string;
//     company_id: string;
//     max_payout: number;
//     nsfw: boolean;
//     cursing: boolean;
//     nudity: boolean;
//     language: string;
//     age_restriction: number;
//     required_views: number;
//     required_likes: number;
//     required_comments: number;
//     required_saves: number;
//     platform: string;
//     status: string;
//     is_active: boolean;
//     show_other_brands: boolean;
//     specific_products: string;
//     pay_duration: string;
//     created_at: string;
//     update_at: string;
//   }

export const columns: ColumnDef<Bounty>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Company",
    accessorKey: "company_id",
  },
  {
    header: "Active",
    accessorKey: "is_active",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Platform",
    accessorKey: "platform",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
  },
  {
    header: "Amount",
    accessorKey: "max_payout",
  },
];
