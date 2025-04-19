"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  newestProduct,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import Button from "@/app/shared/Button";
import { Input } from "@/app/shared/Input";
import { ProductsProps } from "@/app/types/products";
import { confirmDelete, successDelete } from "@/app/utils/sweetAlert";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const NewestProductsAdmin = () => {
  const [newestProducts, setNewestProducts] = useState<ProductsProps[]>([]);
  const [allProducts, setAllProducts] = useState<ProductsProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    fetchNewest();
    fetchAllProducts();
  }, []);

  const fetchNewest = async () => {
    setLoading(true);
    const res = await axios.get(`${BASE_url}/api/records/newestProducts`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    setNewestProducts(res.data.records);
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
    const product = allProducts.find((p) => p.id === newProductId.trim());

    if (!product) {
      toast.error(productsLocalization.notFound);
      return;
    }

    const alreadyExists = newestProducts.some(
      (p) => p.productName === product.productName
    );

    if (alreadyExists) {
      toast.error(newestProduct.duplicate);
      return;
    }

    setIsAdding(true);

    try {
      await axios.post(
        `${BASE_url}/api/records/newestProducts`,
        { ...product },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(sweetAlert.successful);
      setNewProductId("");
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
        await axios.delete(`${BASE_url}/api/records/newestProducts/${id}`, {
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

  return (
    <div>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{newestProduct.newProduct}</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            children={newestProduct.addNewProduct}
          />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white rounded p-4 w-4/5 md:w-2/3 space-y-4">
              <h3 className="text-lg font-semibold">{newestProduct.addID}</h3>
              <Input
                ref={inputRef}
                type="text"
                placeholder={newestProduct.addProductID}
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button onClick={handleAdd}>
                  {isAdding ? faLocalization.adding : faLocalization.add}
                </Button>
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
            <div className="w-6 h-6 border-t-4 border-secondary border-solid rounded-full animate-spin "></div>
            {productsLocalization.loading}...
          </div>
        ) : newestProducts.length === 0 ? (
          <div className="mt-8">{faLocalization.noProductFound}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newestProducts.map((product) => (
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
                <p className="text-sm text-gray-600">
                  {product.productPrice.toLocaleString()} {faLocalization.rial}
                </p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className=" bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50 mt-2"
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

export default NewestProductsAdmin;
