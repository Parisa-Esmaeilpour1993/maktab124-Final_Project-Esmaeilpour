"use client";

import React from "react";
import { Category } from "@/app/types/category";
import {
  faLocalization,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { Input } from "@/app/shared/Input";
import { Textarea } from "@/app/shared/TextArea";

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
      <div className="bg-white py-4 px-6 w-full h-full flex flex-col gap-3">
        <h2 className="text-xl font-bold text-center text-primary">
          {editId ? productsLocalization.edit : productsLocalization.addProduct}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
            <Input
              name="productName"
              value={formData.productName}
              onChange={onChange}
              placeholder={productsLocalization.productName}
              required
              title={productsLocalization.productName}
              className="w-60"
            />
            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={onChange}
              className=" border border-secondary text-secondary px-3 py-2 rounded outline-none focus:ring-1 focus:ring-secondary"
              required
              title={productsLocalization.productCategory}
            >
              <option value="" disabled>
                {productsLocalization.chooseCategories}{" "}
              </option>
              {category?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>

            <Input
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={onChange}
              placeholder={productsLocalization.price}
              required
              title={productsLocalization.price}
            />

            <Input
              type="number"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={onChange}
              placeholder={productsLocalization.available}
              required
              title={productsLocalization.available}
            />
            <Input
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

          <Textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={onChange}
            placeholder={productsLocalization.description}
            className="!h-1/5 lg:!h-1/2"
            title={productsLocalization.description}
          />

          <Textarea
            name="productSpecifications"
            value={formData.productSpecifications}
            onChange={onChange}
            placeholder={productsLocalization.specification}
            className="!h-1/3 lg:!h-2/3"
            title={productsLocalization.specification}
          />

          <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
            <div>
              <label
                htmlFor="fileInp"
                className="block w-full text-center text-light bg-secondary py-1 px-2 rounded-md cursor-pointer text-sm md:text-[16px]"
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
                <p className="text-sm text-secondary">
                  {productsLocalization.choosenFile}: {fileName}
                </p>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary hover:bg-primary transition text-white px-2 py-1 rounded text-sm md:text-[16px]"
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
