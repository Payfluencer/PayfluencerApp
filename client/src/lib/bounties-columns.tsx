import { type ColumnDef } from "@tanstack/react-table";
import { type Bounty } from "@/hooks/useBounties";
import { CompanyCell } from "@/components/BountyTableCells";

export const columns: ColumnDef<Bounty>[] = [
  {
    header: "Company",
    accessorKey: "company_id",
    cell: ({ row }) => <CompanyCell companyId={row.getValue("company_id")} />,
  },
  // {
  //   header: "Active",
  //   accessorKey: "is_active",
  //   cell: ({ row }) => {
  //     const isActive = row.getValue("is_active") as boolean;
  //     return (
  //       <span
  //         className={`px-2 py-1 rounded-full text-xs font-medium ${
  //           isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  //         }`}
  //         style={{ fontFamily: "KarlaSemiBold" }}
  //       >
  //         {isActive ? "Active" : "Inactive"}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   header: "Status",
  //   accessorKey: "status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as string;
  //     const statusColors = {
  //       ACTIVE: "bg-green-100 text-green-800",
  //       INACTIVE: "bg-gray-100 text-gray-800",
  //       PENDING: "bg-yellow-100 text-yellow-800",
  //       COMPLETED: "bg-blue-100 text-blue-800",
  //     };
  //     return (
  //       <span
  //         className={`px-2 py-1 rounded-full text-xs font-medium ${
  //           statusColors[status as keyof typeof statusColors] ||
  //           "bg-gray-100 text-gray-800"
  //         }`}
  //         style={{ fontFamily: "KarlaSemiBold" }}
  //       >
  //         {status}
  //       </span>
  //     );
  //   },
  // },
  {
    header: "Max Payout",
    accessorKey: "max_payout",
    cell: ({ row }) => {
      const amount = row.getValue("max_payout") as number;
      return (
        <span
          className="font-medium text-green-600"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          ${amount.toLocaleString()}
        </span>
      );
    },
  },
  // TODO: Make this view more with a drop down menu
  {
    header: "Active",
    accessorKey: "is_active",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];
