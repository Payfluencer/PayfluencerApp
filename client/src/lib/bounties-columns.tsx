import { type ColumnDef } from "@tanstack/react-table";

import { type Bounty } from "@/hooks/useBounties";

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
