import { BASE_url } from "@/app/constants/api/BASE_URL";
import { productsLocalization } from "@/app/constants/localization/fa/localization";
import { ProductsProps, ProductTableProps } from "@/app/types/products";
import { faIR } from "date-fns/locale";
import moment from "jalali-moment";
import React, { useState } from "react";
import { BiSolidDetail } from "react-icons/bi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

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

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(productsLocalization.copyId);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error(productsLocalization.notCopyId);
      });
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-secondary">
        <table className="w-full text-sm text-right border-collapse">
          <thead className="bg-light text-gray-700 text-center">
            <tr>
              <th className="p-2 border border-accent">
                {productsLocalization.id}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.image}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.name}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.category}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.price}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.available}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.expireDate}
              </th>
              <th className="p-2 border border-accent">
                {productsLocalization.operation}
              </th>
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
                      ? "bg-light hover:bg-accent opacity-60 hover:opacity-80"
                      : ""
                  }`}
                >
                  <td
                    className="p-2 border border-accent"
                    onClick={() => copyToClipboard(product.id)}
                  >
                    {product.id}
                  </td>
                  <td className="p-2 border border-accent">
                    <img
                      src={`${BASE_url}${product.image}`}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td
                    className="p-2 border cursor-pointer border-accent"
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
                  <td className="p-2 border border-accent">
                    <div className="border border-accent p-1 rounded-md">
                      <select
                        value={product.productCategory}
                        onChange={(e) =>
                          onInlineEdit(
                            product.id,
                            "productCategory",
                            e.target.value
                          )
                        }
                        className="outline-none"
                      >
                        {category?.map((cat) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                            className="text-xs"
                          >
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td
                    className="p-2 border cursor-pointer border-accent"
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
                      product.productPrice.toLocaleString()
                    )}
                  </td>
                  <td
                    className="p-2 border cursor-pointer border-accent"
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
                  <td className="p-2 border border-accent">
                    {product.productExpired}
                  </td>
                  <td className="p-2 border border-accent">
                    <div className="flex justify-center gap-2 items-center">
                      <button
                        onClick={() => handleDelete?.(product.id)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title={productsLocalization.delete}
                      >
                        <FaTrash size={16} />
                      </button>
                      <button
                        onClick={() => onEditClick?.(product)}
                        className="text-blue-500 hover:text-blue-700"
                        title={productsLocalization.edit}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => onDetailClick?.(product)}
                        className="text-red-500 hover:text-red-700"
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
        {products.length === 0 ? (
          <div className="text-center">
            <span className="text-gray-500">
              {productsLocalization.notFound}
            </span>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-2 border rounded-lg p-4 shadow-sm bg-white border-secondary"
            >
              <div className="flex justify-between items-center mb-2">
                <strong
                  onClick={() =>
                    handleCellClick(
                      product.id,
                      "productName",
                      product.productName
                    )
                  }
                  className="cursor-pointer w-4/5"
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
                </strong>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete?.(product.id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => onEditClick?.(product)}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDetailClick?.(product)}
                    className="text-yellow-500"
                  >
                    <BiSolidDetail />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={`${BASE_url}${product.image}`}
                  alt={product.productName}
                  className="w-1/2 h-1/2 object-cover rounded"
                />
              </div>
              <p>
                <strong>{productsLocalization.category}:</strong>{" "}
                <select
                  value={product.productCategory}
                  onChange={(e) =>
                    onInlineEdit(product.id, "productCategory", e.target.value)
                  }
                  className="border px-2 py-1 rounded-md"
                >
                  {category?.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-xs">
                      {cat.title}
                    </option>
                  ))}
                </select>
              </p>
              <p
                onClick={() =>
                  handleCellClick(
                    product.id,
                    "productPrice",
                    String(product.productPrice)
                  )
                }
                className="cursor-pointer"
              >
                <strong>{productsLocalization.price}:</strong>{" "}
                {isEditing(product.id, "productPrice") ? (
                  <input
                    type="number"
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
                  product.productPrice.toLocaleString()
                )}
              </p>
              <p
                onClick={() =>
                  handleCellClick(
                    product.id,
                    "productQuantity",
                    String(product.productQuantity)
                  )
                }
                className="cursor-pointer"
              >
                <strong>{productsLocalization.available}:</strong>{" "}
                {isEditing(product.id, "productQuantity") ? (
                  <input
                    type="number"
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
                  product.productQuantity
                )}
              </p>
              <p>
                <strong>{productsLocalization.expireDate}:</strong>{" "}
                <span dir="ltr">{product.productExpired}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProductTable;
