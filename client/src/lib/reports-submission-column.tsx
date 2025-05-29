import { type ColumnDef } from "@tanstack/react-table";
import { type Submission } from "@/hooks/useSubmissions";
import UserCell from "@/components/UserCell";
import { TruncatedIdCell } from "@/components/BountyTableCells";

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
  // {
  //   header: "ID",
  //   accessorKey: "id",
  //   cell: ({ row }) => {
  //     return (
  //       <span className="text-blue-500 underline cursor-pointer">
  //         {row.original.id.slice(0, 6)}...
  //       </span>
  //     );
  //   },
  // },
  {
    header: "User",
    accessorKey: "user_id",
    cell: ({ row }) => {
      return <UserCell id={row.original.user_id} />;
    },
  },
  {
    header: "Bounty ID",
    accessorKey: "bounty_id",
    cell: ({ row }) => {
      return <TruncatedIdCell id={row.original.bounty_id} />;
    },
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

export const userColumns: ColumnDef<Submission>[] = [
  {
    header: "ID",
    accessorKey: "id",
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
