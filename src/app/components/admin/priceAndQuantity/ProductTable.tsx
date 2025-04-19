import {
  ordersLocalization,
  productsLocalization,
} from "@/app/constants/localization/fa/localization";
import { ProductsProps, ProductTableProps } from "@/app/types/products";
import React, { useState } from "react";

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  category,
  onInlineEdit,
}) => {
  const [editedProducts, setEditedProducts] = useState<{
    [id: string]: Partial<ProductsProps>;
  }>({});

  const handleEditField = (
    id: string,
    field: keyof ProductsProps,
    value: string
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleApplyChanges = () => {
    Object.entries(editedProducts).forEach(([id, updates]) => {
      Object.entries(updates).forEach(([field, value]) => {
        onInlineEdit(id, field, String(value));
      });
    });
    setEditedProducts({});
  };

  return (
    <>
      {Object.keys(editedProducts).length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleApplyChanges}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {ordersLocalization.saveChanges}
          </button>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-secondary">
        <table className="w-full text-sm text-right border-collapse">
          <thead className="bg-light text-gray-700 text-center">
            <tr>
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
            </tr>
          </thead>
          <tbody className="text-center">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
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
                  <td className="p-2 border border-accent">
                    {product.productName}
                  </td>
                  <td className="p-2 border border-accent">
                    <p className="mt-1">
                      {category.find(
                        (cat) => cat.id === product.productCategory
                      )?.title || "undefined"}
                    </p>
                  </td>
                  <td
                    className="p-2 border border-accent cursor-pointer"
                    onClick={() =>
                      !editedProducts[product.id]?.productPrice &&
                      handleEditField(
                        product.id,
                        "productPrice",
                        String(product.productPrice)
                      )
                    }
                  >
                    {editedProducts[product.id]?.productPrice !== undefined ? (
                      <input
                        type="number"
                        autoFocus
                        value={editedProducts[product.id]?.productPrice}
                        onChange={(e) =>
                          handleEditField(
                            product.id,
                            "productPrice",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded text-red-600"
                      />
                    ) : (
                      product.productPrice.toLocaleString()
                    )}
                  </td>
                  <td
                    className="p-2 border border-accent cursor-pointer"
                    onClick={() =>
                      !editedProducts[product.id]?.productQuantity &&
                      handleEditField(
                        product.id,
                        "productQuantity",
                        String(product.productQuantity)
                      )
                    }
                  >
                    {editedProducts[product.id]?.productQuantity !==
                    undefined ? (
                      <input
                        type="number"
                        autoFocus
                        value={editedProducts[product.id]?.productQuantity}
                        onChange={(e) =>
                          handleEditField(
                            product.id,
                            "productQuantity",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded text-red-600"
                      />
                    ) : (
                      product.productQuantity
                    )}
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
              className="flex flex-col gap-2 border border-primary rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex items-center gap-2">
                <strong>{productsLocalization.name}:</strong>
                <p className="mt-1">{product.productName}</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>{productsLocalization.category}:</strong>
                <p className="mt-1">
                  {category.find((cat) => cat.id === product.productCategory)
                    ?.title || "undefined"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <strong>{productsLocalization.price}:</strong>
                {editedProducts[product.id]?.productPrice !== undefined ? (
                  <input
                    type="number"
                    autoFocus
                    value={editedProducts[product.id]?.productPrice}
                    onChange={(e) =>
                      handleEditField(
                        product.id,
                        "productPrice",
                        e.target.value
                      )
                    }
                    className="w-full p-1 border rounded mt-1 text-red-600"
                  />
                ) : (
                  <p
                    className="cursor-pointer mt-1"
                    onClick={() =>
                      handleEditField(
                        product.id,
                        "productPrice",
                        String(product.productPrice)
                      )
                    }
                  >
                    {product.productPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <strong>{productsLocalization.available}:</strong>
                {editedProducts[product.id]?.productQuantity !== undefined ? (
                  <input
                    type="number"
                    autoFocus
                    value={editedProducts[product.id]?.productQuantity}
                    onChange={(e) =>
                      handleEditField(
                        product.id,
                        "productQuantity",
                        e.target.value
                      )
                    }
                    className="w-full p-1 border rounded mt-1 text-red-600"
                  />
                ) : (
                  <p
                    className="cursor-pointer mt-1"
                    onClick={() =>
                      handleEditField(
                        product.id,
                        "productQuantity",
                        String(product.productQuantity)
                      )
                    }
                  >
                    {product.productQuantity}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProductTable;
