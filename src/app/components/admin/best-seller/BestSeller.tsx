"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  bestSeller,
  faLocalization,
  newestProduct,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { ProductsProps } from "@/app/types/products";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const BestSellerAdmin = () => {
  const [bestProductsToSell, setBestProductsToSell] = useState<ProductsProps[]>(
    []
  );
  const [allProducts, setAllProducts] = useState<ProductsProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bestProductsToSellID, setBestProductsToSellID] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();

  useEffect(() => {
    fetchBestSeller();
    fetchAllProducts();
  }, []);

  const fetchBestSeller = async () => {
    setLoading(true);
    const res = await axios.get(`${BASE_url}/api/records/bestProductsToSell`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    setBestProductsToSell(res.data.records);
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
    const product = allProducts.find(
      (p) => p.id === bestProductsToSellID.trim()
    );

    if (!product) {
      toast.error(productsLocalization.notFound);
      return;
    }

    console.log("Selected product to add:", product);
    console.log("Newest products list:", bestProductsToSell);

    const alreadyExists = bestProductsToSell.some(
      (p) => p.productName === product.productName
    );

    if (alreadyExists) {
      toast.error(newestProduct.duplicate);
      return;
    }

    setIsAdding(true);

    try {
      await axios.post(
        `${BASE_url}/api/records/bestProductsToSell`,
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
      setBestProductsToSellID("");
      setIsModalOpen(false);
      fetchBestSeller();
    } catch (error) {
      toast.error(sweetAlert.errorInSubmit);
      console.error("Error in adding product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`${BASE_url}/api/records/bestProductsToSell/${id}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBestSeller();
    } catch (error) {
      toast.error(sweetAlert.errorInDeleteData);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{bestSeller.bestSellerProduct}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {newestProduct.addNewProduct}
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white rounded p-4 w-4/5 md:w-2/3 space-y-4">
              <h3 className="text-lg font-semibold">{newestProduct.addID}</h3>
              <input
                type="text"
                placeholder={newestProduct.addProductID}
                value={bestProductsToSellID}
                onChange={(e) => setBestProductsToSellID(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAdd}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                >
                  {isAdding ? faLocalization.adding : faLocalization.add}
                </button>
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
            <div className="w-6 h-6 border-t-4 border-blue-500 border-solid rounded-full animate-spin "></div>
            {productsLocalization.loading}...
          </div>
        ) : bestProductsToSell.length === 0 ? (
          <div className="my-8">{faLocalization.noProductFound}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestProductsToSell.map((product) => (
              <div
                key={product.id}
                className="border rounded p-2 flex flex-col gap-2 items-center shadow"
              >
                <img
                  src={`${BASE_url}${product.image}`}
                  alt={product.productName}
                  className="object-contain p-8 md:p-6 rounded"
                />
                <h4 className="font-semibold">{product.productName}</h4>
                <p className="text-sm text-gray-600">
                  {product.productPrice} {faLocalization.rial}
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

export default BestSellerAdmin;
