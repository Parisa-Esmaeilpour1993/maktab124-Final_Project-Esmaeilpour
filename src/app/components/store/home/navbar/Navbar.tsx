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
    <nav className="flex gap-6 font-medium text-gray-800 mx-4 mb-4 px-4 py-3 border-b border-accent rounded-2xl shadow-accent overflow-x-auto whitespace-nowrap custom-scrollbar ">
      {categories.map((cat) => (
        <div className="transition-transform duration-300  hover:translate-y-1 hover:-translate-x-1 hover:text-secondary cursor-pointer">
          <button key={cat.id}>{cat.title}</button>
          <span className="font-normal" key={cat.id}>
            {" > "}
          </span>
        </div>
      ))}
    </nav>
  );
}
