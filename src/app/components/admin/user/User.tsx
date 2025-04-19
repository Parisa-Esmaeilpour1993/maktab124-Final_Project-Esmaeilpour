"use client";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  adminLocalization,
  faLocalization,
  sweetAlert,
  UsersLocalization,
} from "@/app/constants/localization/fa/localization";
import { ClipLoader } from "react-spinners";
import { confirmDelete } from "@/app/utils/sweetAlert";
import { UserProps } from "@/app/types/users";
import Button from "@/app/shared/Button";

const UsersTable = () => {
  const [data, setData] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_url}/api/admin/users`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.filter((user: UserProps) => user.name));
    } catch (err) {
      console.error("Error:", err);
      setError(sweetAlert.errorInReceiveData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        const token = getAuthToken();
        await axios.delete(`${BASE_url}/api/admin/users/${userId}`, {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prev) => prev.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const columns = useMemo<ColumnDef<UserProps>[]>(
    () => [
      {
        accessorKey: "name",
        header: adminLocalization.username,
      },
      {
        accessorKey: "email",
        header: adminLocalization.email,
      },
      {
        header: faLocalization.operation,
        cell: ({ row }) => (
          <div className="flex gap-2 items-center justify-center">
            <button
              onClick={() => setSelectedUser(row.original)}
              className="text-secondary hover:text-primary"
            >
              {faLocalization.show}
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="text-red-600 hover:text-red-700"
            >
              {faLocalization.delete}
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ClipLoader size={40} color="#67ae6e" />
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{UsersLocalization.usersList}</h2>
      <table className="w-full border border-gray-200 rounded-md text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 border text-center">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="even:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={!!selectedUser}
        ariaHideApp={false}
        onRequestClose={() => setSelectedUser(null)}
        contentLabel="User Info"
        className="bg-white p-6 mx-auto mt-20 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50"
      >
        {selectedUser && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">
              {UsersLocalization.usersDetail}
            </h2>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.username}:</strong> {selectedUser.name}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.email}:</strong> {selectedUser.email}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{UsersLocalization.loginDate}:</strong>{" "}
              {new Date(selectedUser.createdAt).toLocaleDateString("fa-IR")}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => setSelectedUser(null)}
                className="mt-4 px-4 py-2 bg-secondary text-white rounded"
                children={faLocalization.close}
              />
            </div>
          </div>
        )}
      </Modal>

      <div className="flex gap-4 items-center justify-center mt-4">
        <button
          className={`px-3 py-1 border rounded ${
            !table.getCanPreviousPage()
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {faLocalization.prev}
        </button>
        <div>
          {faLocalization.page} {table.getState().pagination.pageIndex + 1}{" "}
          {faLocalization.from} {table.getPageCount()}
        </div>
        <button
          className={`px-3 py-1 border rounded ${
            !table.getCanNextPage()
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {faLocalization.next}
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
