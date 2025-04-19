"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  newestProduct,
  offerProducts,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { ProductsProps } from "@/app/types/products";
import { confirmDelete, successDelete } from "@/app/utils/sweetAlert";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
const OffProducts = () => {
  const [offProducts, setOffProducts] = useState<ProductsProps[]>([]);
  const [allProducts, setAllProducts] = useState<ProductsProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offProductId, setOffProductId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [editableProductId, setEditableProductId] = useState<string | null>(
    null
  );
  const [editableDiscount, setEditableDiscount] = useState<number>(0);

  const token = getAuthToken();

  useEffect(() => {
    fetchNewest();
    fetchAllProducts();
  }, []);

  const fetchNewest = async () => {
    setLoading(true);
    const res = await axios.get(`${BASE_url}/api/records/offProducts`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    setOffProducts(res.data.records);
    setLoading(false);
  };

  const fetchAllProducts = async () => {
    const res = await axios.get(`${BASE_url}/api/records/drugs`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    setAllProducts(res.data.records);
  };

  const handleAdd = async () => {
    const product = allProducts.find((p) => p.id === offProductId.trim());

    if (!product) {
      toast.error(productsLocalization.notFound);
      return;
    }

    const alreadyExists = offProducts.some(
      (p) => p.productName === product.productName
    );
    if (alreadyExists) {
      toast.error(newestProduct.duplicate);
      return;
    }
    setIsAdding(true);
    try {
      await axios.post(
        `${BASE_url}/api/records/offProducts`,
        { ...product, discountPercent: discount },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(sweetAlert.successful);
      setOffProductId("");
      setIsModalOpen(false);
      fetchNewest();
    } catch (error) {
      toast.error(sweetAlert.errorInSubmit);
      console.error("Error in adding product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_url}/api/records/offProducts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        await successDelete();
        fetchNewest();
      } catch (error) {
        toast.error(sweetAlert.errorInDeleteData);
      } finally {
        setDeletingId(null);
      }
    } else {
      setDeletingId(null);
    }
  };

  const handleDiscountSave = async (id: string) => {
    const product = offProducts.find((p) => p.id === id);
    if (!product) return;
    try {
      await axios.put(
        `${BASE_url}/api/records/offProducts/${id}`,
        {
          ...product,
          discountPercent: editableDiscount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(sweetAlert.successfulEdit);
      fetchNewest();
    } catch (error) {
      toast.error(sweetAlert.errorInSubmit);
    } finally {
      setEditableProductId(null);
    }
  };

  return (
    <div>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">
            {offerProducts.offProducts}
          </h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            children={newestProduct.addNewProduct}
          />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white rounded p-4 w-4/5 md:w-2/3 space-y-4">
              <h3 className="text-lg font-semibold text-secondary">
                {newestProduct.addID}
              </h3>
              <Input
                placeholder={newestProduct.addProductID}
                value={offProductId}
                onChange={(e) => setOffProductId(e.target.value)}
              />
              <Input
                type="number"
                placeholder={offerProducts.discountPercent}
                min={1}
                max={100}
                onChange={(e) => setDiscount(Number(e.target.value))}
                value={discount}
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleAdd}
                  children={
                    isAdding ? faLocalization.adding : faLocalization.add
                  }
                />
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 cursor-pointer"
                >
                  {sweetAlert.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="w-full text-center py-10 text-lg font-semibold flex items-center justify-center gap-2">
            <div className="w-6 h-6 border-t-4 border-primary border-solid rounded-full animate-spin "></div>
            {productsLocalization.loading}...
          </div>
        ) : offProducts.length === 0 ? (
          <div className="mt-8">{faLocalization.noProductFound}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {offProducts.map((product) => (
              <div
                key={product.id}
                className="border border-primary rounded p-2 flex flex-col gap-2 items-center shadow"
              >
                <img
                  src={`${BASE_url}${product.image}`}
                  alt={product.productName}
                  className="object-contain p-8 md:p-6 rounded"
                />
                <h4 className="font-semibold">{product.productName}</h4>
                <p className="text-sm text-gray-600 line-through">
                  {product.productPrice.toLocaleString()} {faLocalization.rial}
                </p>
                <p
                  className="text-sm text-gray-700 cursor-pointer flex gap-2 items-center"
                  onClick={() => {
                    setEditableProductId(product.id);
                    setEditableDiscount(product.discountPercent || 0);
                  }}
                >
                  {offerProducts.discountPercent}:{" "}
                  {editableProductId === product.id ? (
                    <Input
                      type="number"
                      value={editableDiscount}
                      autoFocus
                      min={1}
                      max={100}
                      onChange={(e) =>
                        setEditableDiscount(Number(e.target.value))
                      }
                      onBlur={() => handleDiscountSave(product.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                  ) : (
                    <span>{product.discountPercent || 0}</span>
                  )}
                </p>

                <p className="text-sm text-green-600 font-semibold">
                  {Math.round(
                    +product.productPrice *
                      (1 - (product.discountPercent || 0) / 100)
                  ).toLocaleString()}{" "}
                  {faLocalization.rial}
                </p>

                <button
                  onClick={() => handleDelete(product.id)}
                  className=" bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id
                    ? faLocalization.deleting
                    : faLocalization.delete}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default OffProducts;
