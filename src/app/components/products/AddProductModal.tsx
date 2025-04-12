// components/products/AddProductModal.tsx
"use client";

import React from "react";
import { Category } from "@/app/types/category";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
  loading: boolean;
  category: Category[];
  editId: string | null;
}

const AddProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  onFileChange,
  fileName,
  loading,
  category,
  editId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white py-4 px-6 w-full h-full flex flex-col gap-2">
        <h2 className="text-xl font-bold text-center">
          {editId ? "ویرایش محصول" : "افزودن محصول"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex justify-center gap-4">
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={onChange}
              placeholder="نام محصول"
              className="w-full border px-3 py-2 rounded"
              required
              title="نام محصول"
            />

            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
              title="دسته بندی محصول"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center gap-4">
            <input
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={onChange}
              placeholder="قیمت"
              className="w-full border px-3 py-2 rounded"
              required
              title="قیمت"
            />

            <input
              type="number"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={onChange}
              placeholder="تعداد موجودی"
              className="w-full border px-3 py-2 rounded"
              required
              title="موجودی"
            />
            <input
              type="date"
              name="productExpired"
              value={formData.productExpired}
              onChange={onChange}
              placeholder="تاریخ انقضای محصول "
              className="w-full border px-3 py-2 rounded"
              required
              title="تاریخ انقضا"
            />
          </div>

          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={onChange}
            placeholder="توضیحات محصول"
            className="w-full border px-3 py-2 rounded h-1/3"
            title="توضیحات محصول"
          />

          <textarea
            name="productSpecifications"
            value={formData.productSpecifications}
            onChange={onChange}
            placeholder="مشخصات محصول"
            className="w-full border px-3 py-2 rounded h-2/3"
            title="مشخصات محصول"
          />

          <div className="flex justify-between items-center">
            <div>
              <label
                htmlFor="fileInp"
                className="block w-full text-center bg-blue-100 py-1 px-2 rounded-md cursor-pointer"
              >
                تصویر مورد نظر را انتخاب کنید
              </label>
              <input
                type="file"
                id="fileInp"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              {fileName && (
                <p className="text-sm text-gray-500">
                  فایل انتخاب شده: {fileName}
                </p>
              )}
            </div>

            <div className="flex gap-2 items-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-2 py-1 rounded"
              >
                {loading
                  ? "در حال ارسال..."
                  : editId
                  ? "ویرایش محصول"
                  : "افزودن محصول"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 transition px-2 py-1 rounded"
              >
                انصراف
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
