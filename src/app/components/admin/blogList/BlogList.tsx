"use client";

import React, { useEffect, useState } from "react";
import { getBlogs } from "@/app/services/getBlogs";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getBlogs();
      setBlogs(data.records || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_url}/api/records/blogs/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
          },
        }
      );

      if (response.status === 200) {
        toast.success("پست با موفقیت حذف شد");
        setBlogs(blogs.filter((blog) => blog.id !== id));
      } else {
        toast.error("خطا در حذف پست");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("مشکلی در حذف پست پیش آمده");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const blogToEdit = blogs.find((blog) => blog.id === id);
    if (blogToEdit) {
      setEditBlog(blogToEdit);
    }
  };

  const handleUpdate = async () => {
    if (!editBlog) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_url}/api/records/blogs/${editBlog.id}`,
        editBlog,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
          },
        }
      );

      if (response.status === 200) {
        toast.success("پست با موفقیت ویرایش شد");
        setBlogs(
          blogs.map((blog) =>
            blog.id === editBlog.id ? { ...blog, ...editBlog } : blog
          )
        );
        setEditBlog(null);
      } else {
        toast.error("خطا در ویرایش پست");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("مشکلی در ویرایش پست پیش آمده");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="mt-10">در حال دریافت پست‌ها...</p>;

  if (!blogs.length) return <p className="mt-10">هیچ پستی وجود ندارد</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <img
            src={`${BASE_url}${blog.image}`}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <h3 className="text-lg font-bold mb-1">{blog.title}</h3>
          <p className="text-sm text-gray-600">{blog.summary}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleEdit(blog.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit /> ویرایش
            </button>
            <button
              onClick={() => handleDelete(blog.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash /> حذف
            </button>
          </div>
        </div>
      ))}

      {editBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setEditBlog(null)}
              className="absolute top-3 left-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              ویرایش پست
            </h2>

            <div className="mb-4">
              <label className="block mb-1">عنوان</label>
              <input
                type="text"
                value={editBlog.title}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, title: e.target.value })
                }
                className="w-full border p-2 rounded-md"
                dir="rtl"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">خلاصه</label>
              <textarea
                value={editBlog.summary}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, summary: e.target.value })
                }
                className="w-full border p-2 rounded-md"
                dir="rtl"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">محتوا</label>
              <textarea
                value={editBlog.content}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, content: e.target.value })
                }
                className="w-full border p-2 rounded-md"
                dir="rtl"
                rows={6}
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                بروزرسانی
              </button>
              <button
                onClick={() => setEditBlog(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
