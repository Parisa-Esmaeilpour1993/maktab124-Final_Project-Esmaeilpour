"use client";

import React, { useEffect, useState } from "react";
import { getBlogs } from "@/app/services/getBlogs";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/app/shared/Button";
import { BlogProps } from "@/app/types/blogList";
import {
  blogLocalization,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Swal from "sweetalert2";
 

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBlog, setEditBlog] = useState<BlogProps | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getBlogs();
      setBlogs(data.records || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: sweetAlert.areYouSure,
      text: sweetAlert.irrevocable,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: sweetAlert.yesDelete,
      cancelButtonText: sweetAlert.cancel,
    });

    if (result.isConfirmed) {
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
          toast.success(sweetAlert.successfullyDeleted);
          setBlogs(blogs.filter((blog) => blog.id !== id));
        } else {
          toast.error(blogLocalization.deleteError);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error(blogLocalization.deleteError);
      } finally {
        setLoading(false);
      }
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
        toast.success(sweetAlert.successfullyEdited);
        setBlogs(
          blogs.map((blog) =>
            blog.id === editBlog.id ? { ...blog, ...editBlog } : blog
          )
        );
        setEditBlog(null);
      } else {
        toast.error(blogLocalization.editError);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(blogLocalization.editError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="mt-10">{blogLocalization.loading}</p>;

  if (!blogs.length)
    return <p className="mt-10">{blogLocalization.noPostToShow}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-4">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="border rounded-lg flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition"
        >
          <div>
            {" "}
            <img
              src={`${BASE_url}${blog.image}`}
              alt={blog.title}
              className="w-full h-44 object-cover rounded-md mb-3 cursor-pointer"
            />
            <h3 className="font-bold mb-2 cursor-pointer">{blog.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{blog.summary}</p>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              onClick={() => handleEdit(blog.id)}
              className="!text-blue-600 hover:!text-blue-900"
            >
              {" "}
              <FaEdit /> {faLocalization.edit}
            </Button>
            <Button
              onClick={() => handleDelete(blog.id)}
              className="!text-red-600 hover:!text-red-800"
            >
              <FaTrash /> {faLocalization.delete}
            </Button>
          </div>
        </div>
      ))}

      {editBlog && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setEditBlog(null)}
              className="absolute top-3 left-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              {faLocalization.edit}{" "}
            </h2>

            <div className="mb-4">
              <label className="block mb-1">{blogLocalization.title}</label>
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
              <label className="block mb-1">{blogLocalization.abstract}</label>
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
              <label className="block mb-1">{blogLocalization.content}</label>
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
                {faLocalization.update}
              </button>
              <button
                onClick={() => setEditBlog(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                {sweetAlert.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
