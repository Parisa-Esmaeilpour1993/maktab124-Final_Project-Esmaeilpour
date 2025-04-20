"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  adminLocalization,
  faLocalization,
  sweetAlert,
  UsersLocalization,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { AdminDataProps, placeholders, UserProps } from "@/app/types/users";
import { confirmDelete } from "@/app/utils/sweetAlert";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { resetForm } from "./resetForm";

const AdminsTable = () => {
  const [data, setData] = useState<UserProps[]>([]);
  const [adminData, setAdminData] = useState<AdminDataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminDataProps | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAdminId, setEditAdminId] = useState<string | null>(null);

  const [form, setForm] = useState(resetForm);

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
      setAdminData(response.data.records);
    } catch (err) {
      console.error("Error:", err);
      setError(sweetAlert.errorInReceiveData);
    }
  };

  const handleSubmitAdmin = async () => {
    const token = getAuthToken();

    try {
      if (isEditing && editAdminId) {
        await axios.put(
          `${BASE_url}/api/records/admins/${editAdminId}`,
          {
            ...form,
          },
          {
            headers: {
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(sweetAlert.successfullyEdited);
      } else {
        await axios.post(
          `${BASE_url}/api/records/admins`,
          {
            ...form,
          },
          {
            headers: {
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(sweetAlert.seccessfullyAdded);
      }
      setIsAddModalOpen(false);
      setForm(resetForm);
      setIsEditing(false);
      setEditAdminId(null);
      fetchAdmins();
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setError(sweetAlert.errorInSendingData);
    }
  };

  const handleEmailChange = (email: string) => {
    const existingAdmin = adminData.find((admin) => admin.email === email);

    if (existingAdmin) {
      setForm({
        firstName: existingAdmin.firstName || "",
        lastName: existingAdmin.lastName || "",
        phone: existingAdmin.phone || "",
        address: existingAdmin.address || "",
        age: existingAdmin.age || "",
        education: existingAdmin.education || "",
        email: existingAdmin.email || "",
      });
      setIsEditing(true);
      setEditAdminId(existingAdmin.id);
    } else {
      setForm((prev) => ({ ...prev, email }));
      setIsEditing(false);
      setEditAdminId(null);
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
        fetchAdmins();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleView = (email: string) => {
    const admin = adminData.find((admin) => admin.email === email);
    if (!admin) {
      toast.error(sweetAlert.noAdminFound);
      return;
    }
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEditing(false);
    setEditAdminId(null);
    setForm(resetForm);
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
            <button
              className="text-secondary hover:text-primary"
              onClick={() => handleView(row.original.email)}
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
    [data]
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
    <div>
      <ToastContainer />
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

        {/* Main Modal */}
        <Modal
          isOpen={isAddModalOpen}
          ariaHideApp={false}
          onRequestClose={closeAddModal}
          contentLabel="Add Admin"
          className="bg-white p-6 mx-auto rounded-lg shadow-lg outline-none w-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold mb-4">
              {UsersLocalization.adminDetail}
            </h2>
            <div>
              <label className="block mb-1 font-medium">
                {adminLocalization.email}
              </label>
              <select
                className="w-full border p-2 rounded-md border-secondary outline-none focus:ring-2 ring-secondary"
                value={form.email}
                onChange={(e) => handleEmailChange(e.target.value)}
              >
                <option value="">--{UsersLocalization.choose}--</option>
                {data.map((user) => (
                  <option key={user._id} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
            {Object.entries(form).map(([key, value]) =>
              key !== "email" ? (
                <Input
                  key={key}
                  placeholder={placeholders[key] || key}
                  value={value}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  title={placeholders[key] || key}
                />
              ) : null
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleSubmitAdmin}>{faLocalization.save}</Button>
              <button
                onClick={closeAddModal}
                className="bg-gray-300 hover:bg-gray-400 rounded-md px-3 py-1"
              >
                {sweetAlert.cancel}
              </button>
            </div>
          </div>
        </Modal>

        {/* View Admin Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onRequestClose={() => {
            setIsViewModalOpen(false);
            setSelectedAdmin(null);
          }}
          ariaHideApp={false}
          className="bg-white p-6 mx-auto rounded-lg shadow-lg outline-none w-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold mb-4">
              {UsersLocalization.detail}
            </h2>
            {selectedAdmin ? (
              <div className="space-y-4 text-sm">
                <div className="border-b border-secondary pb-2">
                  <strong>{adminLocalization.firstName}:</strong>{" "}
                  {selectedAdmin.firstName}
                </div>
                <div className="border-b border-secondary pb-2">
                  <strong>{adminLocalization.lastName} :</strong>{" "}
                  {selectedAdmin.lastName}
                </div>
                <div className="border-b border-secondary pb-2">
                  <strong>{adminLocalization.email}:</strong>{" "}
                  {selectedAdmin.email}
                </div>
                <div className="border-b border-secondary pb-2">
                  <strong> {adminLocalization.phone}:</strong>{" "}
                  {selectedAdmin.phone}
                </div>
                <div className="border-b border-secondary pb-2">
                  <strong>{adminLocalization.age}:</strong> {selectedAdmin.age}
                </div>
                <div className="border-b border-secondary pb-2">
                  <strong>{adminLocalization.education}:</strong>{" "}
                  {selectedAdmin.education}
                </div>
                <div className="border-b border-secondary pb-2">
                  <strong>{adminLocalization.address}:</strong>{" "}
                  {selectedAdmin.address}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">{faLocalization.noData}</div>
            )}
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedAdmin(null);
                }}
              >
                {faLocalization.close}
              </Button>
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
    </div>
  );
};

export default AdminsTable;
