// src/components/products/ProductTable.tsx

import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { BiSolidDetail } from "react-icons/bi";
import { ProductsProps } from "@/app/types/products";
import { Category } from "@/app/types/category";
import { BASE_url } from "@/app/constants/api/BASE_URL";

interface ProductTableProps {
  products: ProductsProps[];
  category: Category[];
  handleDelete: (id: string) => void;
  onEditClick: (product: ProductsProps) => void;
  onDetailClick: (product: ProductsProps) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  category,
  handleDelete,
  onEditClick,
  onDetailClick,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-right border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-center">
          <tr>
            <th className="p-2 border">کد محصول</th>
            <th className="p-2 border">تصویر</th>
            <th className="p-2 border">نام</th>
            <th className="p-2 border">دسته</th>
            <th className="p-2 border">قیمت</th>
            <th className="p-2 border">موجودی</th>
            <th className="p-2 border">تاریخ انقضا</th>
            <th className="p-2 border">عملیات</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {products.map((product) => (
            <tr
              key={product.id}
              className={`hover:bg-gray-50 ${
                +product.productQuantity === 0
                  ? "bg-red-100 hover:bg-red-200"
                  : ""
              }`}
            >
              <td className="p-2 border">{product.id}</td>
              <td className="p-2 border">
                <div className="flex items-center justify-center">
                  <img
                    src={`${BASE_url}${product.image}`}
                    alt={product.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
              </td>

              <td className="p-2 border">{product.productName}</td>
              <td className="p-2 border">
                {category.find((cat) => cat.id === product.productCategory)
                  ?.title || "نامشخص"}
              </td>
              <td className="p-2 border">{product.productPrice}</td>
              <td className="p-2 border">{product.productQuantity}</td>
              <td className="p-2 border">{product.productExpired}</td>
              <td className="p-2 border">
                <div className="flex justify-center gap-2 items-center ">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                    title="حذف محصول"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    onClick={() => onEditClick(product)}
                    className="text-blue-500 hover:text-blue-700"
                    title="ویرایش محصول"
                  >
                    <FaEdit size={18} />
                  </button>

                  <button
                    onClick={() => onDetailClick(product)}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="جزئیات محصول"
                  >
                    <BiSolidDetail size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
