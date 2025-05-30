import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/user";
import { type Bounty } from "@/hooks/useBounties";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function BountyTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const { role } = useUserStore();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: Row<TData>) => {
    const bounty = row.original as Bounty;
    const bountyId = bounty.id;

    if (role === "ADMIN") {
      navigate(`/admin/bounties/${bountyId}`);
    } else {
      navigate(`/bounties/${bountyId}`);
    }
  };

  return (
    <div className="w-full bg-[#efeff0] rounded-4xl p-4">
      <div className="">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "KarlaRegular" }}
        >
          Bounties
        </h1>
        <p className="text-gray-500" style={{ fontFamily: "KarlaRegular" }}>
          Recent published bounties
        </p>
      </div>
      <Table style={{ fontFamily: "KarlaRegular" }}>
        <TableHeader style={{ fontFamily: "KarlaSemiBold" }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => handleRowClick(row)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default BountyTable;
