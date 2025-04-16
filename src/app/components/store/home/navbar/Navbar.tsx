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
    <nav className="flex gap-4 text-gray-800 mx-4 mb-4 px-4 pb-3 pt-1 border-b drop-shadow-2xl  shadow-primary border-secondary rounded-2xl">
      {categories.map((cat) => (
        <button key={cat.id} className="hover:text-primary cursor-pointer">
          {cat.title}
        </button>
      ))}
    </nav>
  );
}
