"use client";
import EditModal from "@/app/components/admin/contactUs/EditModal";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ContactUsData {
  id?: string;
  email: string;
  phone: number;
  managerEmail: string;
  resumeEmail: string;
  address: string;
}

export default function AboutUsPage() {
  const [formData, setFormData] = useState<ContactUsData>({
    email: "",
    phone: 0,
    managerEmail: "",
    resumeEmail: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_url}/api/records/contactUs`, {
        headers: { api_key: API_KEY },
      });

      const records = response.data.records;
      if (records && records.length > 0) {
        setFormData({
          id: records[0].id,
          email: records[0].email,
          address: records[0].address,
          phone: records[0].phone,
          managerEmail: records[0].managerEmail,
          resumeEmail: records[0].resumeEmail,
        });
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات:", error);
      toast.error("دریافت اطلاعات با خطا مواجه شد");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!formData.id;

    try {
      let response;

      if (isEdit) {
        response = await axios.put(
          `${BASE_url}/api/records/contactUs/${formData.id}`,
          {
            email: formData.email,
            address: formData.address,
            phone: formData.phone,
            managerEmail: formData.managerEmail,
            resumeEmail: formData.resumeEmail,
          },
          {
            headers: {
              api_key: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("اطلاعات با موفقیت ویرایش شد");
      } else {
        response = await axios.post(
          `${BASE_url}/api/records/contactUs`,
          {
            email: formData.email,
            address: formData.address,
            phone: formData.phone,
            managerEmail: formData.managerEmail,
            resumeEmail: formData.resumeEmail,
          },
          {
            headers: {
              api_key: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("اطلاعات با موفقیت ارسال شد");
      }

      if (response.data?.records) {
        setFormData({
          id: response.data.records.id,
          email: response.data.records.email,
          address: response.data.records.address,
          phone: response.data.records.phone,
          managerEmail: response.data.records.managerEmail,
          resumeEmail: response.data.records.resumeEmail,
        });
        setIsEditMode(true);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارسال اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">تماس با ما</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">آدرس</label>
          <textarea
            value={formData.address}
            name="address"
            className="w-full border rounded px-3 py-2 h-28 resize-none bg-gray-100"
            rows={2}
            disabled
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">ایمیل</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">شماره تماس</label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">ارتباط با مدیریت</label>
          <input
            type="email"
            name="managerEmail"
            value={formData.managerEmail}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">ارسال رزومه</label>
          <input
            type="email"
            name="resumeEmail"
            value={formData.resumeEmail}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {isEditMode ? "ویرایش" : "جدید"}
        </button>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <ToastContainer />
    </div>
  );
}
