"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  asideBarLocalization,
  faLocalization,
} from "@/app/constants/localization/fa/localization";
import { BlogProps } from "@/app/types/blogList";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

export default function ArticlesSection() {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = getAuthToken();

  useEffect(() => {
    axios
      .get(`${BASE_url}/api/records/blogs`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBlogs(res.data.records);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-10 m-8 rounded-md shadow-accent">
      <div className="mx-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center">
          {faLocalization.articles}{" "}
          <span className="text-primary">{asideBarLocalization.storeName}</span>
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            <p>{faLocalization.loading}</p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl overflow-hidden border border-secondary hover:shadow-accent transition duration-300 hover:-translate-y-1 hover:translate-x-1"
              >
                <div className="flex items-center justify-center h-48 p-8">
                  <img src={`${BASE_url}${blog.image}`} alt={blog.title} />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {blog.summary}
                  </p>
                  <Link
                    href={`/articles/${blog.id}`}
                    className="text-primary font-medium hover:underline flex items-center justify-center gap-2"
                  >
                    <FaArrowTrendUp /> {faLocalization.readMore}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
