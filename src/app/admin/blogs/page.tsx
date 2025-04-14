"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import BlogList from "@/app/components/admin/blogList/BlogList";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  blogLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { uploadImage } from "@/app/services/uploadService";
import axios from "axios";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
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

  const token = getAuthToken();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      toast.error(blogLocalization.addImage);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success(sweetAlert.seccessfullyAdded);
        setFormData({ title: "", summary: "", content: "", image: "" });
        setFileName(null);
        setIsModalOpen(false);
        setBlogListKey((prev) => prev + 1); //
      } else {
        toast.error(sweetAlert.errorInSubmit);
      }
    } catch (error) {
      console.error("Error sending blog:", error);
      toast.error(sweetAlert.errorInSubmit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer limit={3} />
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex gap-2 items-center justify-center w-56 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition active:scale-95"
      >
        <FaPlus />
        {blogLocalization.addPost}{" "}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 p-8 my-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-center ">
                {blogLocalization.addPost}
              </h2>

              <div>
                <div>
                  <label
                    htmlFor="fileInp"
                    className="block w-full text-center bg-blue-100 py-2 rounded-md cursor-pointer"
                  >
                    {blogLocalization.chooseImage}
                  </label>
                  <input
                    type="file"
                    id="fileInp"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-center text-sm text-red-500 mt-2">
                    {fileName || blogLocalization.notChoosen}
                  </p>
                </div>
                {blogLocalization.title}
                <div>
                  <label className="block mb-1"></label>
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
                  <label className="block mb-1">
                    {blogLocalization.abstract}
                  </label>
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
                  <label className="block mb-1">
                    {blogLocalization.content}
                  </label>
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
                  <p className="text-sm text-gray-500">
                    {faLocalization.sending}{" "}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {blogLocalization.savePost}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  {sweetAlert.cancel}
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
