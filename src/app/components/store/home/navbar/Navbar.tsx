"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { fetchCategories } from "@/app/services/fetchCategory";
import { useEffect } from "react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <nav className="flex gap-4 mx-4 mb-4 px-4 pb-3 pt-1 border-b shadow-2xl rounded-2xl border-gray-300">
      {categories.map((cat) => (
        <button key={cat.id} className="hover:text-blue-500 cursor-pointer">
          {cat.title}
        </button>
      ))}
    </nav>
  );
}
