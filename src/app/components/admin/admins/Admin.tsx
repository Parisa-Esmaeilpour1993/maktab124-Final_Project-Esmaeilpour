"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import Button from "@/app/shared/Button";
import Modal from "@/app/components/admin/modal/Modal";
import { adminEmails } from "@/app/utils/adminsEmail";
import {
  confirmDelete,
  successDelete,
  unSuccessDelete,
} from "@/app/utils/sweetAlert";
import {
  adminLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import { AdminProps } from "@/app/types/admins";

export default function Admin() {
  const [adminsList, setAdminsList] = useState<AdminProps[]>(() => {
    const stored = localStorage.getItem("adminsList");
    return stored ? JSON.parse(stored) : adminEmails;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminsList", JSON.stringify(adminsList));
  }, [adminsList]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAdmin(null);
    setViewMode(false);
  };

  const handleSave = () => {
    const updatedAdmins = adminsList.map((admin) =>
      admin.id === currentAdmin.id ? { ...currentAdmin } : admin
    );
    setAdminsList(updatedAdmins);
    closeModal();
  };

  const handleDelete = (id: number) => {
    confirmDelete().then((result) => {
      if (result.isConfirmed) {
        try {
          setAdminsList((prev) => prev.filter((admin) => admin.id !== id));
          successDelete();
        } catch (error) {
          unSuccessDelete();
        }
      }
    });
  };

  return (
    <div className="px-0 text-sm lg:p-6 lg:tex-[16px] space-y-6 rounded-lg pt-2">
      <h1 className=" text-xl lg:text-2xl font-bold text-primary">
        {adminLocalization.adminsList}{" "}
      </h1>

      <Card>
        <CardContent>
          <table className="min-w-full table-auto">
            <thead className="bg-accent">
              <tr>
                <th className="px-4 py-2 border-b border-accent text-center">
                  {adminLocalization.username}
                </th>
                <th className="px-4 py-2 border-b border-accent text-center">
                  {adminLocalization.email}
                </th>
                <th className="px-4 py-2 border-b border-accent text-center">
                  {adminLocalization.operation}
                </th>
              </tr>
            </thead>
            <tbody>
              {adminsList.map((admin, index) => (
                <tr
                  key={admin.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-light"}
                >
                  <td className="p-4 border-b border-light text-center font-semibold">
                    {admin.username}
                  </td>
                  <td className="p-4 border-b border-light text-center">
                    {admin.email}
                  </td>
                  <td className="p-4 border-b border-light text-center flex flex-col md:flex-row gap-2 items-center justify-center">
                    <Button
                      onClick={() => {
                        setCurrentAdmin(admin);
                        setViewMode(true);
                        setIsModalOpen(true);
                      }}
                    >
                      {faLocalization.show}
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentAdmin(admin);
                        setViewMode(false);
                        setIsModalOpen(true);
                      }}
                    >
                      {faLocalization.edit}
                    </Button>

                    <Button onClick={() => handleDelete(admin.id)}>
                      {faLocalization.delete}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            {viewMode
              ? adminLocalization.showAdmin
              : adminLocalization.editAdmin}
          </h2>

          {currentAdmin &&
            (viewMode ? (
              <table className="w-full rounded overflow-hidden">
                <tbody>
                  <tr>
                    <td className="p-2 font-medium border-b-secondary border-b-2">
                      {adminLocalization.fullName}
                    </td>
                    <td className="p-2 border-b-secondary border-b-2">
                      {currentAdmin.fullName}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-b-secondary border-b-2">
                      {adminLocalization.email}
                    </td>
                    <td className="p-2 border-b-secondary border-b-2">
                      {currentAdmin.email}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-b-secondary border-b-2">
                      {adminLocalization.phone}
                    </td>
                    <td className="p-2 border-b-secondary border-b-2">
                      {currentAdmin.phone}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-b-secondary border-b-2">
                      {adminLocalization.education}
                    </td>
                    <td className="p-2 border-b-secondary border-b-2">
                      {currentAdmin.education}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-b-secondary border-b-2">
                      {adminLocalization.age}
                    </td>
                    <td className="p-2 border-b-secondary border-b-2">
                      {currentAdmin.age}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">
                    {adminLocalization.fullName}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-accent rounded"
                    value={currentAdmin.fullName}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    {adminLocalization.email}
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-accent rounded"
                    value={currentAdmin.email}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    {adminLocalization.phone}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-accent rounded"
                    value={currentAdmin.phone}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    {adminLocalization.education}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-accent rounded"
                    value={currentAdmin.education}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        education: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">{adminLocalization.age}</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-accent rounded"
                    value={currentAdmin.age}
                    onChange={(e) =>
                      setCurrentAdmin({ ...currentAdmin, age: +e.target.value })
                    }
                  />
                </div>
              </div>
            ))}

          <div className="mt-6 text-right space-x-2 rtl:space-x-reverse">
            <Button className="bg-gray-500 text-white" onClick={closeModal}>
              {adminLocalization.close}
            </Button>
            {!viewMode && (
              <Button className="bg-blue-600 text-white" onClick={handleSave}>
                {adminLocalization.saveChanges}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
