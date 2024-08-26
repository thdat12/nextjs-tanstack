"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBox from "@/components/admin/SearchBox";

import { useFetchOrderList } from "@/hooks/userOrder";
import { Order } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { CheckedState } from "@radix-ui/react-checkbox";
import { count } from "console";

type Props = {};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "customer.name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return row.getValue("status") === "PENDING" ? (
        <span className="bg-gray-300 p-2 rounded-lg">
          {row.getValue("status")}
        </span>
      ) : (
        <span className="bg-green-300 p-2 rounded-lg">
          {row.getValue("status")}
        </span>
      );
    },
  },
];

const AdminPage = (props: Props) => {
  const [searchVal, setSearchVal] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);

  const [debounceSearchVal, setDebounceSearchVal] = useState("");
  const [debounceStatusVal, setDebounceStatusVal] = useState<string[]>([]);

  const debounceValue = useDebounce(searchVal, 300);
  const debounceStatus = useDebounce(statuses, 300);
  useEffect(() => {
    setDebounceSearchVal(debounceValue);
  }, [debounceValue]);
  useEffect(() => {
    setDebounceStatusVal(debounceStatus);
  }, [debounceStatus]);

  const params = useMemo(() => {
    const where: { name?: string; status?: string } = {};
    if (debounceSearchVal !== "") {
      where.name = debounceSearchVal;
    }
    if (debounceStatusVal?.length > 0) {
      where.status = debounceStatusVal.join(",");
    }
    return where;
  }, [debounceSearchVal, debounceStatusVal]);

  const { data: orderInfo } = useFetchOrderList(params);

  const orderData = useMemo(() => orderInfo?.rows, [orderInfo]);
  const pagination = useMemo(() => orderInfo?.count, [orderInfo]);

  const table = useReactTable({
    data: orderData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const handleFilter = (state: CheckedState, value: string) => {
    let cloneStatus = structuredClone(statuses);
    if (state) {
      cloneStatus.push(value);
    } else {
      cloneStatus = cloneStatus.filter((item) => item !== value);
    }
    setStatuses(cloneStatus);
  };

  return (
    <main className="w-full p-10 font-mono">
      <section className="min-h-screen">
        <div className="flex items-start justify-center gap-x-8">
          <div className="flex w-[25vw] flex-col items-center gap-8 p-4 border-[1px] border-gray-300 rounded-md">
            <span>Total: {pagination}</span>
            <SearchBox onSearch={handleSearch} onFilter={handleFilter} />
          </div>

          <div className="flex flex-1 flex-col gap-4 px-8 py-4 border-[1px] border-gray-300 rounded-md">
            <Table>
              <TableHeader>
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
                {table.getRowModel()?.rows?.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="h-[56px]"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => table.previousPage()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => table.nextPage()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
