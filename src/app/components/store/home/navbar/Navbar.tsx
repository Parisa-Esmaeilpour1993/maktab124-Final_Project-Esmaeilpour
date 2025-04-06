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
    <nav className="flex gap-4 bg-gray-100 p-4">
      {categories.map((cat) => (
        <span key={cat.id} className="hover:text-blue-500 cursor-pointer">
          {cat.title}
        </span>
      ))}
    </nav>
  );
}
