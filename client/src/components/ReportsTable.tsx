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
  type Row,
  useReactTable,
} from "@tanstack/react-table";
import useUserStore from "@/store/user";
import { useNavigate } from "react-router-dom";
import { type Submission } from "@/hooks/useSubmissions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function ReportsTable<TData, TValue>({
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
    const submission = row.original as Submission;
    const submissionId = submission.id;

    if (role === "ADMIN") {
      navigate(`/admin/submissions/${submissionId}`);
    } else {
      navigate(`/submissions/${submissionId}`);
    }
  };
  return (
    <div className="w-full md:w-[75%] bg-[#f6f7f9] rounded-4xl p-4 max-w-[1240px] mx-auto my-0">
      <div className="">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "KarlaRegular" }}
        >
          Submissions
        </h1>
        <p className="text-gray-500" style={{ fontFamily: "KarlaRegular" }}>
          Recent submissions
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

export default ReportsTable;
