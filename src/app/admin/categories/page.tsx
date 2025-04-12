"use client";

import {
  adminCategories,
  faLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { addCategory } from "@/app/services/addCategory";
import { deleteCategory } from "@/app/services/deleteCategory";
import { editCategory } from "@/app/services/editCategory";
import { fetchCategories } from "@/app/services/fetchCategory";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SearchInput from "@/app/shared/SearchInput";

export default function AdminCategoriesPage() {
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const { categories, error } = useAppSelector((state) => state.categories);

  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = async () => {
    if (title.trim()) {
      const isDuplicate = categories.some(
        (cat) => cat.title.trim().toLowerCase() === title.trim().toLowerCase()
      );

      if (isDuplicate) {
        Swal.fire({
          icon: "error",
          text: adminCategories.repetitive,
        });
        return;
      }

      try {
        await dispatch(addCategory(title));
        await dispatch(fetchCategories());
        setTitle("");
        setMainModalOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await Swal.fire({
      title: sweetAlert.areYouSure,
      text: sweetAlert.irrevocable,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: sweetAlert.yesDelete,
      cancelButtonText: sweetAlert.cancel,
    });

    if (result.isConfirmed) {
      await dispatch(deleteCategory(id));
      dispatch(fetchCategories());
      Swal.fire({
        title: sweetAlert.delete,
        text: sweetAlert.deleteCategory,
        icon: "success",
        confirmButtonText: sweetAlert.ok,
      });
    }
  };

  const handleEditCategory = async (id: string) => {
    if (editValue.trim()) {
      const isDuplicate = categories.some(
        (cat) =>
          cat.title.trim().toLowerCase() === editValue.trim().toLowerCase()
      );

      if (isDuplicate) {
        Swal.fire({
          icon: "error",
          text: adminCategories.repetitive,
        });
        return;
      }
      try {
        await dispatch(editCategory({ id, title: editValue })).unwrap();
        await dispatch(fetchCategories()).unwrap();
        setEditId(null);
        setEditValue("");
        Swal.fire({
          title: sweetAlert.edit,
          icon: "success",
          confirmButtonText: sweetAlert.ok,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-10 py-2 w-full">
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
        <h1 className="text-lg md:text-xl font-bold">
          {adminCategories.categoriesList}
        </h1>
        <button
          onClick={() => setMainModalOpen(true)}
          className="bg-blue-400 text-white px-2 md:px-4 py-1 md:py-2 rounded active:scale-95 hover:bg-blue-500 cursor-pointer"
        >
          {adminCategories.addCategory}
        </button>
      </div>

      <div className="mb-4 flex">
        <SearchInput
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {mainModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 flex flex-col gap-4">
            <h2 className="text-lg font-bold">{adminCategories.addCategory}</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={adminCategories.categoryName}
              className="border p-2 w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMainModalOpen(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded-md active:scale-95 cursor-pointer"
              >
                {adminCategories.cancel}
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-3 py-1 rounded-md active:scale-95 cursor-pointer"
              >
                {adminCategories.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <ul className="flex flex-col justify-between mt-6 p-3 space-y-4 shadow-2xl border rounded-2xl">
        {paginatedCategories.map((cat, index) => {
          if (!cat) return null;
          return (
            <li key={cat.id} className="px-3 py-1 border-b border-gray-300">
              <div className="flex justify-between items-center pb-1">
                {editId === cat.id ? (
                  <div className="flex gap-2 items-center justify-center">
                    <span className="font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}.{" "}
                    </span>
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-gray-600 rounded-md p-1 outline-none hover:border-black"
                    />
                    <div className="flex grid-1 items-center">
                      <button
                        onClick={() => handleEditCategory(cat.id)}
                        className="text-green-500 px-2 hover:text-green-700 cursor-pointer"
                      >
                        {adminCategories.save}
                      </button>
                      <button
                        onClick={() => {
                          setEditId(null);
                          setEditValue("");
                        }}
                        className="text-gray-600 hover:text-gray-800 cursor-pointer"
                      >
                        {adminCategories.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-xl">
                      {(currentPage - 1) * itemsPerPage + index + 1}.{" "}
                    </span>
                    <span className="text-[14px] md:text-[16px]">
                      {cat.title}
                    </span>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEditId(cat.id);
                      setEditValue(cat.title);
                    }}
                    className="text-yellow-600 hover:text-yellow-700 cursor-pointer text-[14px] md:text-[16px]"
                  >
                    {adminCategories.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer text-[14px] md:text-[16px]"
                  >
                    {adminCategories.delete}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md border border-gray-600 ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:border-black hover:translate-y-0.5"
            }`}
          >
            {faLocalization.prev}{" "}
          </button>

          <span>
            {faLocalization.page}{" "}
            <span className="text-red-500">{currentPage}</span>{" "}
            {faLocalization.from} {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md border border-gray-600 ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:border-black hover:translate-y-0.5"
            }`}
          >
            {faLocalization.next}
          </button>
        </div>
      )}
    </div>
  );
}
