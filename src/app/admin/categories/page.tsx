"use client";

import {
  adminCategories,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { addCategory } from "@/app/services/addCategory";
import { addSubCategory } from "@/app/services/addSubCategory";
import { deleteCategory } from "@/app/services/deleteCategory";
import { deleteSubCategory } from "@/app/services/deleteSubCategory";
import { editCategory } from "@/app/services/editCategory";
import { editSubCategory } from "@/app/services/editSubCategory";
import { fetchCategories } from "@/app/services/fetchCategory";
import { useEffect, useState } from "react";
import { GridLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function AdminCategoriesPage() {
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [activeAddSubId, setActiveAddSubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeEditSub, setActiveEditSub] = useState<{
    categoryId: string;
    subCategoryId: string;
  } | null>(null);
  const [subTitle, setSubTitle] = useState("");

  const dispatch = useAppDispatch();
  const { categories, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (title.trim()) {
      dispatch(addCategory(title));
      setTitle("");
      setMainModalOpen(false);
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
      dispatch(deleteCategory(id));
      dispatch(fetchCategories());
      Swal.fire({
        title: sweetAlert.delete,
        text: sweetAlert.deleteCategory,
        icon: "success",
        confirmButtonText: sweetAlert.ok,
      });
    }
  };

  const handleEditCategory = (id: string) => {
    if (editValue.trim()) {
      dispatch(editCategory({ id, title: editValue }));
      setEditId(null);
      dispatch(fetchCategories());
      Swal.fire({
        title: sweetAlert.edit,
        icon: "success",
        confirmButtonText: sweetAlert.ok,
      });
    }
  };

  const handleDeleteSubCategory = async (
    categoryId: string,
    subCategoryId: string
  ) => {
    const result = await Swal.fire({
      title: sweetAlert.areYouSure,
      text: sweetAlert.irrevocable,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: sweetAlert.yesDelete,
      cancelButtonText: sweetAlert.cancel,
    });

    if (result.isConfirmed) {
      await dispatch(deleteSubCategory({ categoryId, subCategoryId }));
      dispatch(fetchCategories());

      Swal.fire({
        title: sweetAlert.delete,
        text: sweetAlert.deleteCategory,
        icon: "success",
        confirmButtonText: sweetAlert.ok,
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
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

  const handleAddSubCategory = (categoryId: string) => {
    if (subTitle.trim()) {
      dispatch(addSubCategory({ parentId: categoryId, title: subTitle })).then(
        () => {
          setSubTitle("");
          setActiveAddSubId(null);
          dispatch(fetchCategories());
          Swal.fire({
            title: sweetAlert.addSubCategory,
            icon: "success",
            confirmButtonText: sweetAlert.ok,
          });
        }
      );
    }
  };

  const handleEditSubCategory = (categoryId: string, subCategoryId: string) => {
    if (subTitle.trim()) {
      dispatch(
        editSubCategory({ categoryId, subCategoryId, title: subTitle })
      ).then(() => {
        setSubTitle("");
        setActiveEditSub(null);
        dispatch(fetchCategories());
        Swal.fire({
          title: sweetAlert.editSubCategory,
          icon: "success",
          confirmButtonText: sweetAlert.ok,
        });
      });
    }
  };

  return (
    <div className="px-10 py-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{adminCategories.categoriesList}</h1>
        <button
          onClick={() => setMainModalOpen(true)}
          className="bg-blue-400 text-white px-4 py-2 rounded active:scale-95 hover:bg-blue-500 cursor-pointer"
        >
          {adminCategories.addCategory}
        </button>
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

      <ul className="flex flex-col justify-between mt-4 p-3 space-y-4 shadow-2xl rounded-2xl">
        {categories.map((cat, index) => (
          <li key={cat.id} className="px-3 py-1 border-b border-gray-300">
            <div className="flex justify-between items-center pb-1">
              {editId === cat.id ? (
                <div className="flex gap-2 items-center justify-center">
                  <span className="font-bold">{index + 1}. </span>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-600 rounded-md p-1 outline-none hover:border-black"
                  />
                  <button
                    onClick={() => handleEditCategory(cat.id)}
                    className="text-green-500 px-2 hover:text-green-700 cursor-pointer"
                  >
                    {adminCategories.save}
                  </button>
                </div>
              ) : (
                <div>
                  <span className="font-bold text-xl">{index + 1}. </span>
                  <span className="text-lg">{cat.title}</span>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditId(cat.id);
                    setEditValue(cat.title);
                  }}
                  className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
                >
                  {adminCategories.edit}
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  {adminCategories.delete}
                </button>
                <button
                  onClick={() => {
                    setActiveAddSubId(cat.id);
                    setSubTitle("");
                    setActiveEditSub(null);
                  }}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  {adminCategories.addSub}
                </button>
              </div>
            </div>

            {Array.isArray(cat.children) &&
              cat.children.map((sub, subIndex) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center pr-6 my-1"
                >
                  {activeEditSub?.categoryId === cat.id &&
                  activeEditSub.subCategoryId === sub.id ? (
                    <div className="flex gap-2 items-center">
                      <span className="font-medium">
                        {index + 1}.{subIndex + 1}-
                      </span>
                      <input
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        className="border p-1"
                      />
                      <button
                        onClick={() => handleEditSubCategory(cat.id, sub.id)}
                        className="text-green-600 cursor-pointer"
                      >
                        {adminCategories.save}
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex gap-2 items-center">
                        <span className="font-medium">
                          {index + 1}.{subIndex + 1}-
                        </span>
                        <span className="text-gray-700">{sub.title}</span>
                      </span>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setActiveEditSub({
                              categoryId: cat.id,
                              subCategoryId: sub.id,
                            });
                            setSubTitle(sub.title);
                            setActiveAddSubId(null);
                          }}
                          className="text-yellow-600 cursor-pointer hover:text-yellow-700"
                        >
                          {adminCategories.edit}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSubCategory(cat.id, sub.id)
                          }
                          className="text-red-500 cursor-pointer hover:text-red-700"
                        >
                          {adminCategories.delete}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

            {activeAddSubId === cat.id && (
              <div className="bg-gray-100 p-3 rounded mt-2">
                <input
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder={adminCategories.subTitle}
                  className="border p-2 w-full mb-2"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setActiveAddSubId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded cursor-pointer active:scale-95"
                  >
                    {adminCategories.cancel}
                  </button>
                  <button
                    onClick={() => handleAddSubCategory(cat.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer active:scale-95"
                  >
                    {adminCategories.add}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
