"use client";

import BlogList from "@/app/components/admin/blogList/BlogList";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GridLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddBlogPage() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogListKey, setBlogListKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${BASE_url}/api/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            api_key: API_KEY,
            Authorization: `Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjNiZDZjNTNkNjcxZTRkMWU0YTMzNiIsImlhdCI6MTc0NDEyMzY3NCwiZXhwIjoxNzQ0Mjk2NDc0fQ.YnOQiFkheOpKw0J3G9coEw1L3asOnD3_CfrJC7XBAuY}`, // توکن را واقعی بگذار
          },
        }
      );
      return response.data?.downloadLink || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("آپلود تصویر با خطا مواجه شد");
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const imageUrl = await uploadImage(file);

    if (imageUrl) {
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("لطفاً تصویر را بارگذاری کنید");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_url}/api/records/blogs`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjNiZDZjNTNkNjcxZTRkMWU0YTMzNiIsImlhdCI6MTc0NDEyMzY3NCwiZXhwIjoxNzQ0Mjk2NDc0fQ.YnOQiFkheOpKw0J3G9coEw1L3asOnD3_CfrJC7XBAuY}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("پست بلاگ با موفقیت اضافه شد");
        setFormData({ title: "", summary: "", content: "", image: "" });
        setFileName(null);
        setIsModalOpen(false);
        setBlogListKey((prev) => prev + 1); //
      } else {
        toast.error("خطا در افزودن پست");
      }
    } catch (error) {
      console.error("Error sending blog:", error);
      toast.error("مشکلی در ارسال اطلاعات پیش آمده");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
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
    <div className="p-4">
      <ToastContainer />
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex gap-2 items-center justify-center w-56 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition active:scale-95"
      >
        <FaPlus />
        افزودن پست جدید
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 p-8 my-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-center ">
                افزودن پست جدید
              </h2>

              <div>
                <div>
                  <label
                    htmlFor="fileInp"
                    className="block w-full text-center bg-blue-100 py-2 rounded-md cursor-pointer"
                  >
                    انتخاب تصویر پست
                  </label>
                  <input
                    type="file"
                    id="fileInp"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-center text-sm text-red-500 mt-2">
                    {fileName || "فایلی انتخاب نشده است"}
                  </p>
                </div>

                <div>
                  <label className="block mb-1">عنوان</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block mb-1">خلاصه</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    dir="rtl"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block mb-1">محتوا</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    dir="rtl"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 ">
                {loading && (
                  <p className="text-sm text-gray-500">در حال ارسال...</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  ذخیره پست
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BlogList key={blogListKey} />
    </div>
  );
}
