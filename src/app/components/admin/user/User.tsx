"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  adminLocalization,
  faLocalization,
  profileLocalization,
  sweetAlert,
  UsersLocalization,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import SearchInput from "@/app/shared/SearchInput";
import { UserProps } from "@/app/types/users";
import { confirmDelete } from "@/app/utils/sweetAlert";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";

const UsersTable = () => {
  const [data, setData] = useState<UserProps[]>([]);
  const [dataDetail, setDataDetail] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      console.log(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError(sweetAlert.adminError);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersDetail = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_url}/api/records/users`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setDataDetail(response.data.records);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const handleSelectUser = (basicUser: UserProps) => {
    const detail = dataDetail.find((d: any) => d.userIdi === basicUser.userIdi);
    if (detail) {
      setSelectedUser({ ...basicUser, ...detail });
    } else {
      setSelectedUser(basicUser);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUsersDetail();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    return data.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (userId: string) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) return;

    try {
      const token = getAuthToken();

      const adminUser = data.find((user) => user._id === userId);
      console.log(adminUser);
      const userIdi = adminUser?.userIdi;
      console.log(userIdi);

      if (!userIdi) throw new Error("userIdi not found in admin data");

      const record = dataDetail.find(
        (user) => String(user.userIdi) === String(userIdi)
      );
      const recordId = record?.id;

      if (!recordId) throw new Error("Record ID not found in user records");

      await axios.delete(`${BASE_url}/api/records/users/${recordId}`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.delete(`${BASE_url}/api/admin/users/${userId}`, {
        headers: {
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      setData((prev) => prev.filter((user) => user._id !== userId));
      setDataDetail((prev) => prev.filter((user: any) => user.id !== recordId));
    } catch (error) {
      console.error("Delete error:", error);
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
          <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
            <button
              onClick={() => handleSelectUser(row.original)}
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
    data: filteredUsers,
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
      <div className="flex flex-col gap-2 md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{UsersLocalization.usersList}</h2>
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={UsersLocalization.search}
        />
      </div>
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-2 text-gray-500"
              >
                {UsersLocalization.noUsersFound}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={!!selectedUser}
        ariaHideApp={false}
        onRequestClose={() => setSelectedUser(null)}
        contentLabel="User Info"
        className="bg-white px-6 py-12 w-2/3 md:w-1/2 max-h-96 lg:max-h-fit overflow-y-auto rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        {selectedUser && (
          <div className="flex flex-col gap-3 text-xs md:text-sm lg:text-[16px]">
            <h2 className="text-xl font-bold mb-4">
              {UsersLocalization.usersDetail}
            </h2>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.username}:</strong> {selectedUser.name}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.firstName}:</strong>{" "}
              {selectedUser.firstName}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.lastName}:</strong>{" "}
              {selectedUser.lastName}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.email}:</strong> {selectedUser.email}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.phone}:</strong>{" "}
              {selectedUser.phoneNumber}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.age}:</strong> {selectedUser.birthDate}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{adminLocalization.education}:</strong>{" "}
              {selectedUser.education}
            </p>
            <p className="border-b border-secondary pb-1">
              <strong>{profileLocalization.gender}:</strong>{" "}
              {selectedUser.gender}
            </p>
            <div className="border-b border-secondary pb-1">
              <strong>{adminLocalization.address}:</strong>{" "}
              {Array.isArray(selectedUser?.addresses) &&
                selectedUser.addresses.map((add, id) => (
                  <div key={id}>
                    <ul>
                      <li>{add.value}</li>
                    </ul>
                  </div>
                ))}
            </div>

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
          {filteredUsers.length > 0
            ? `${faLocalization.page} ${
                table.getState().pagination.pageIndex + 1
              } ${faLocalization.from} ${table.getPageCount()}`
            : `${faLocalization.noPageFound}`}
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
