"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import Button from "@/app/shared/Button";
import Modal from "@/app/components/admin/modal/Modal";
import Swal from "sweetalert2";
import { GridLoader } from "react-spinners";

const admins = [
  {
    id: 1,
    username: "admin1",
    email: "admin1@example.com",
    fullName: "رضا رضایی",
    phone: "09121234567",
    education: "کارشناسی",
    age: 30,
  },
  {
    id: 2,
    username: "admin2",
    email: "admin2@example.com",
    fullName: "زهرا مرادی",
    phone: "09351234567",
    education: "کارشناسی ارشد",
    age: 28,
  },
  {
    id: 3,
    username: "admin3",
    email: "admin3@example.com",
    fullName: "امیر احمدی",
    phone: "09211234567",
    education: "دکترا",
    age: 35,
  },
];

export default function AdminPage() {
  const [adminsList, setAdminsList] = useState(admins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(true);

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
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
    }).then((result) => {
      if (result.isConfirmed) {
        setAdminsList((prev) => prev.filter((admin) => admin.id !== id));
        Swal.fire({
          title: "حذف شد!",
          text: "ادمین با موفقیت حذف شد.",
          icon: "success",
          confirmButtonText: "باشه",
        });
      }
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GridLoader
          color="#677284"
          size={24}
          className="absolute top-72 left-2/5 transform -translate-x-1/2"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">لیست ادمین‌ها</h1>

      <Card>
        <CardContent>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300 text-center">
                  نام کاربری
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-center">
                  ایمیل
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-center">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {adminsList.map((admin, index) => (
                <tr
                  key={admin.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    {admin.username}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    {admin.email}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center flex gap-2 items-center justify-center">
                    <Button
                      className="bg-yellow-600 text-white"
                      onClick={() => {
                        setCurrentAdmin(admin);
                        setViewMode(true);
                        setIsModalOpen(true);
                      }}
                    >
                      مشاهده
                    </Button>
                    <Button
                      className="bg-blue-600 text-white"
                      onClick={() => {
                        setCurrentAdmin(admin);
                        setViewMode(false);
                        setIsModalOpen(true);
                      }}
                    >
                      ویرایش
                    </Button>

                    <Button
                      className="bg-red-600 text-white"
                      onClick={() => handleDelete(admin.id)}
                    >
                      حذف
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
          <h2 className="text-xl font-semibold mb-4">
            {viewMode ? "مشاهده اطلاعات ادمین" : "ویرایش اطلاعات ادمین"}
          </h2>

          {currentAdmin &&
            (viewMode ? (
              <table className="w-full border border-gray-300 rounded overflow-hidden">
                <tbody>
                  <tr>
                    <td className="p-2 font-medium bg-gray-100">
                      نام و نام خانوادگی
                    </td>
                    <td className="p-2">{currentAdmin.fullName}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-gray-100">ایمیل</td>
                    <td className="p-2">{currentAdmin.email}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-gray-100">شماره تلفن</td>
                    <td className="p-2">{currentAdmin.phone}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-gray-100">تحصیلات</td>
                    <td className="p-2">{currentAdmin.education}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-gray-100">سن</td>
                    <td className="p-2">{currentAdmin.age}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
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
                  <label className="block mb-1">ایمیل</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded"
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
                  <label className="block mb-1">شماره تلفن</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
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
                  <label className="block mb-1">تحصیلات</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
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
                  <label className="block mb-1">سن</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
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
              بستن
            </Button>
            {!viewMode && (
              <Button className="bg-blue-600 text-white" onClick={handleSave}>
                ذخیره تغییرات
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
