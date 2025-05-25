import { type ColumnDef } from "@tanstack/react-table";

import { type Submission } from "@/hooks/useSubmissions";

// interface Submission {
//     id: string;
//     user_id: string;
//     bounty_id: string;
//     title: string;
//     description: string;
//     platform: string;
//     status: string;
//     createdAt: string;
//     updatedAt: string;
//   }

export const columns: ColumnDef<Submission>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "User ID",
    accessorKey: "user_id",
  },
  {
    header: "Bounty ID",
    accessorKey: "bounty_id",
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];
