// ProductDetailModal.js

import { Category } from "@/app/types/category";
import { ProductsProps } from "@/app/types/products";
import React from "react";

interface DetailProps {
  selectedProduct: ProductsProps;
  category: Category[];
  setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ShowDetailProducts = ({
  selectedProduct,
  category,
  setIsDetailModalOpen,
}: DetailProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl space-y-3">
        <p className="border-2 border-gray-200 p-2">
          <strong>نام:</strong> {selectedProduct.productName}
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>دسته:</strong>{" "}
          {category.find((cat) => cat.id === selectedProduct.productCategory)
            ?.title || "نامشخص"}
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>قیمت:</strong> {selectedProduct.productPrice} تومان
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>موجودی:</strong> {selectedProduct.productQuantity}
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>توضیحات:</strong>
          <div className="max-h-24 overflow-y-auto">
            {selectedProduct.productDescription}
          </div>
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>ویژگی‌ها:</strong>
          <div className="max-h-28 overflow-y-auto">
            {selectedProduct.productSpecifications}
          </div>
        </p>

        <div className="flex justify-end">
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailProducts;
