"use client";
import EditModal from "@/app/components/admin/pages/aboutUs/EditModal";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PrivacyProps {
  id?: string;
  title: string;
  description: string;
}

export default function PrivacyPage() {
  const [formData, setFormData] = useState<PrivacyProps>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_url}/api/records/privacy`, {
        headers: { api_key: API_KEY },
      });

      const records = response.data.records;
      if (records && records.length > 0) {
        setFormData({
          id: records[0].id,
          title: records[0].title,
          description: records[0].description,
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
          `${BASE_url}/api/records/privacy/${formData.id}`,
          {
            title: formData.title,
            description: formData.description,
          },
          {
            headers: {
              api_key: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("قوانین و مقررات با موفقیت ویرایش شد");
      } else {
        response = await axios.post(
          `${BASE_url}/api/records/privacy`,
          {
            title: formData.title,
            description: formData.description,
          },
          {
            headers: {
              api_key: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("قوانین و مقررات با موفقیت ارسال شد");
      }

      if (response.data?.records) {
        setFormData({
          id: response.data.records.id,
          title: response.data.records.title,
          description: response.data.records.description,
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
      <h2 className="text-2xl font-bold mb-6"> قوانین و مقررات </h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">عنوان</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">توضیحات</label>
          <textarea
            name="description"
            value={formData.description}
            disabled
            className="w-full border rounded px-3 py-2 h-28 resize-none bg-gray-100"
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
