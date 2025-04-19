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
import { AdminDataProps, UserProps } from "@/app/types/users";
import Button from "@/app/shared/Button";

const AdminsTable = () => {
  const [data, setData] = useState<UserProps[]>([]);
  const [adminData, setAdminData] = useState<AdminDataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    age: "",
    education: "",
    email: "",
  });

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_url}/api/admin/users`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.filter((user: UserProps) => !user.name));
    } catch (err) {
      console.error("Error:", err);
      setError(sweetAlert.errorInReceiveData);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_url}/api/records/admins`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminData(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError(sweetAlert.errorInReceiveData);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${BASE_url}/api/records/admins`,
        { ...form },
        {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAddModalOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        age: "",
        education: "",
        email: "",
      });
      fetchAdmins();
    } catch (err) {
      console.error("Error:", err);
      setError(sweetAlert.errorInReceiveData);
    }
  };

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

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
  }, []);

  const columns = useMemo<ColumnDef<UserProps>[]>(
    () => [
      {
        accessorKey: "email",
        header: adminLocalization.email,
      },
      {
        accessorKey: "createdAt",
        header: UsersLocalization.loginDate,
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString("fa-IR"),
      },
      {
        header: faLocalization.operation,
        cell: ({ row }) => (
          <div className="flex gap-2 items-center justify-center">
            <button className="text-yellow-500 hover:text-yellow-700">
              {faLocalization.edit}
            </button>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setSelectedUser(row.original)}
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold mb-4">
          {UsersLocalization.usersList}
        </h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          {UsersLocalization.add}
        </Button>
      </div>

      {/* Table */}
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

      {/* Add Admin Modal */}
      <Modal
        isOpen={isAddModalOpen}
        ariaHideApp={false}
        onRequestClose={() => setIsAddModalOpen(false)}
        contentLabel="Add Admin"
        className="bg-white p-6 mx-auto rounded-lg shadow-lg outline-none w-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold mb-4">{UsersLocalization.add}</h2>
          <div>
            <label className="block mb-1 font-medium">
              {adminLocalization.email}
            </label>
            <select
              className="w-full border p-2 rounded"
              value={data.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            >
              <option value="">-- انتخاب کنید --</option>
              {data.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          {Object.entries(form).map(([key, value]) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={value}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border p-2 rounded"
            />
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>
              {sweetAlert.cancel}
            </Button>
            <Button onClick={handleAddAdmin}>{faLocalization.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Pagination */}
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

export default AdminsTable;
