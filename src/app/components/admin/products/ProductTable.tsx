import { BASE_url } from "@/app/constants/api/BASE_URL";
import { productsLocalization } from "@/app/constants/localization/fa/localization";
import { Category } from "@/app/types/category";
import { ProductsProps } from "@/app/types/products";
import React, { useState } from "react";
import { BiSolidDetail } from "react-icons/bi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface ProductTableProps {
  products: ProductsProps[];
  category: Category[];
  handleDelete: (id: string) => void;
  onEditClick: (product: ProductsProps) => void;
  onDetailClick: (product: ProductsProps) => void;
  onInlineEdit: (id: string, field: string, value: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  category,
  handleDelete,
  onEditClick,
  onDetailClick,
  onInlineEdit,
}) => {
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: keyof ProductsProps | null;
  } | null>(null);

  const [tempValue, setTempValue] = useState<string>("");

  const handleCellClick = (
    id: string,
    field: keyof ProductsProps,
    currentValue: string
  ) => {
    setEditingCell({ id, field });
    setTempValue(currentValue);
  };

  const handleBlur = () => {
    if (editingCell && editingCell.field) {
      if (
        (editingCell.field === "productPrice" ||
          editingCell.field === "productQuantity") &&
        Number(tempValue) < 0
      ) {
        toast.error(productsLocalization.canNotBeNegative);
        return;
      }
      onInlineEdit(editingCell.id, editingCell.field, tempValue);
    }
    setEditingCell(null);
  };

  const isEditing = (id: string, field: keyof ProductsProps) =>
    editingCell?.id === id && editingCell.field === field;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-right border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="p-2 border">{productsLocalization.id}</th>
              <th className="p-2 border">{productsLocalization.image}</th>
              <th className="p-2 border">{productsLocalization.name}</th>
              <th className="p-2 border">{productsLocalization.category}</th>
              <th className="p-2 border">{productsLocalization.price}</th>
              <th className="p-2 border">{productsLocalization.available}</th>
              <th className="p-2 border">{productsLocalization.expireDate}</th>
              <th className="p-2 border">{productsLocalization.operation}</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  {productsLocalization.notFound}
                </td>
              </tr>
            ) : (
              products.map((product) => (
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
                    <img
                      src={`${BASE_url}${product.image}`}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td
                    className="p-2 border cursor-pointer"
                    onClick={() =>
                      handleCellClick(
                        product.id,
                        "productName",
                        product.productName
                      )
                    }
                  >
                    {isEditing(product.id, "productName") ? (
                      <input
                        autoFocus
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleBlur();
                          if (e.key === "Escape") setEditingCell(null);
                        }}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      product.productName
                    )}
                  </td>
                  <td className="p-2 border">
                    <select
                      value={product.productCategory}
                      onChange={(e) =>
                        onInlineEdit(
                          product.id,
                          "productCategory",
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded-md"
                    >
                      {category.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    className="p-2 border cursor-pointer"
                    onClick={() =>
                      handleCellClick(
                        product.id,
                        "productPrice",
                        String(product.productPrice)
                      )
                    }
                  >
                    {isEditing(product.id, "productPrice") ? (
                      <input
                        autoFocus
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleBlur();
                          if (e.key === "Escape") setEditingCell(null);
                        }}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      product.productPrice
                    )}
                  </td>
                  <td
                    className="p-2 border cursor-pointer"
                    onClick={() =>
                      handleCellClick(
                        product.id,
                        "productQuantity",
                        String(product.productQuantity)
                      )
                    }
                  >
                    {isEditing(product.id, "productQuantity") ? (
                      <input
                        autoFocus
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleBlur();
                          if (e.key === "Escape") setEditingCell(null);
                        }}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      product.productQuantity
                    )}
                  </td>
                  <td className="p-2 border">{product.productExpired}</td>
                  <td className="p-2 border">
                    <div className="flex justify-center gap-2 items-center">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                        title={productsLocalization.delete}
                      >
                        <FaTrash size={16} />
                      </button>
                      <button
                        onClick={() => onEditClick(product)}
                        className="text-blue-500 hover:text-blue-700"
                        title={productsLocalization.edit}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => onDetailClick(product)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title={productsLocalization.detail}
                      >
                        <BiSolidDetail size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet View */}
      <div className="lg:hidden flex flex-col gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-2 border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <strong>{product.productName}</strong>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => onEditClick(product)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDetailClick(product)}
                  className="text-yellow-500"
                >
                  <BiSolidDetail />
                </button>
              </div>
            </div>
            <img
              src={`${BASE_url}${product.image}`}
              alt={product.productName}
              className="w-full h-40 object-cover rounded my-6"
            />
            <p>
              <strong>{productsLocalization.category}:</strong>{" "}
              {
                category.find((cat) => cat.id === product.productCategory)
                  ?.title
              }
            </p>
            <p>
              <strong>{productsLocalization.price}:</strong>{" "}
              {product.productPrice}
            </p>
            <p>
              <strong>{productsLocalization.available}:</strong>{" "}
              {product.productQuantity}
            </p>
            <p>
              <strong>{productsLocalization.expireDate} :</strong>{" "}
              {product.productExpired || "-"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductTable;
