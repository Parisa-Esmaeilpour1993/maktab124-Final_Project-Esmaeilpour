"use client";

import React from "react";
import { Category } from "@/app/types/category";
import {
  faLocalization,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";

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
          {editId ? productsLocalization.edit : productsLocalization.addProduct}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex justify-center gap-4">
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={onChange}
              placeholder={productsLocalization.productName}
              className="w-full border px-3 py-2 rounded"
              required
              title={productsLocalization.productName}
            />

            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
              title={productsLocalization.productCategory}
            >
              <option value="">{productsLocalization.chooseCategories} </option>
              {category?.map((cat) => (
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
              placeholder={productsLocalization.price}
              className="w-full border px-3 py-2 rounded"
              required
              title={productsLocalization.price}
            />

            <input
              type="number"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={onChange}
              placeholder={productsLocalization.available}
              className="w-full border px-3 py-2 rounded"
              required
              title={productsLocalization.available}
            />
            <input
              type="date"
              name="productExpired"
              value={formData.productExpired}
              onChange={onChange}
              placeholder={productsLocalization.productExpired}
              className="w-full border px-3 py-2 rounded"
              required
              title={productsLocalization.expireDate}
            />
          </div>

          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={onChange}
            placeholder={productsLocalization.description}
            className="w-full border px-3 py-2 rounded h-1/3"
            title={productsLocalization.description}
          />

          <textarea
            name="productSpecifications"
            value={formData.productSpecifications}
            onChange={onChange}
            placeholder={productsLocalization.specification}
            className="w-full border px-3 py-2 rounded h-1/3 md:h-1/2 lg:h-2/3"
            title={productsLocalization.specification}
          />

          <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
            <div>
              <label
                htmlFor="fileInp"
                className="block w-full text-center bg-blue-100 py-1 px-2 rounded-md cursor-pointer text-sm md:text-[16px]"
              >
                {productsLocalization.addImagePlease}
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
                  {productsLocalization.choosenFile}: {fileName}
                </p>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-2 py-1 rounded text-sm md:text-[16px]"
              >
                {loading
                  ? faLocalization.sending
                  : editId
                  ? productsLocalization.edit
                  : productsLocalization.addProduct}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 transition px-2 py-1 rounded text-sm md:text-[16px]"
              >
                {sweetAlert.cancel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
