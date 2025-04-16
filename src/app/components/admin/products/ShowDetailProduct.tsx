// ProductDetailModal.js

import {
  dashboardLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
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
      <div className="max-h-full overflow-y-auto bg-white p-6 lg:rounded-lg w-full max-w-4xl space-y-3">
        <p className="border-2 border-gray-200 p-2">
          <strong>{productsLocalization.name}:</strong>{" "}
          {selectedProduct.productName}
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>{productsLocalization.category}:</strong>{" "}
          {category?.find((cat) => cat.id === selectedProduct.productCategory)
            ?.title || productsLocalization.undefiend}
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>{[productsLocalization.price]}:</strong>{" "}
          {selectedProduct.productPrice} {dashboardLocalization.rial}
        </p>
        <p className="border-2 border-gray-200 p-2">
          <strong>{productsLocalization.available}:</strong>{" "}
          {selectedProduct.productQuantity}
        </p>
        <div className="border-2 border-gray-200 p-2">
          <strong>{productsLocalization.description}:</strong>
          <div className="max-h-24 overflow-y-auto">
            {selectedProduct.productDescription}
          </div>
        </div>
        <div className="border-2 border-gray-200 p-2">
          <strong>{productsLocalization.specification}:</strong>
          <div className="max-h-28 overflow-y-auto">
            {selectedProduct.productSpecifications}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
          >
            {productsLocalization.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailProducts;
