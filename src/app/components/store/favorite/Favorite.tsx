"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  faLocalization,
  favoriteLocalization,
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { Drug, FavoriteProduct, FavoriteRecord } from "@/app/types/favorites";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

function Favorite() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userIdi = user?.userIdi;

  console.log("User from localStorage:", user);

  const fetchFavorites = async () => {
    try {
      const { data: favoritesData } = await axios.get(
        `${BASE_url}/api/records/favorites`,
        { headers: { api_key: API_KEY } }
      );

      const { data: drugsData } = await axios.get(
        `${BASE_url}/api/records/drugs`,
        { headers: { api_key: API_KEY } }
      );

      const { data: offProductsData } = await axios.get(
        `${BASE_url}/api/records/offProducts`,
        { headers: { api_key: API_KEY } }
      );

      const favoriteProducts = favoritesData.records
        .filter((fav: FavoriteRecord) => fav.userIdi === userIdi)
        .map((fav: FavoriteRecord) => {
          const product = drugsData.records.find(
            (drug: Drug) => drug.id === fav.productId
          );
          if (product) {
            const discount = offProductsData.records.find(
              (offProduct: { productName: string; discountPercent: number }) =>
                offProduct.productName === product.productName
            );
            return {
              favoriteId: fav.id,
              product,
              discountPercent: discount ? discount.discountPercent : 0,
            };
          }
          return undefined;
        })
        .filter(
          (item: Drug | undefined) => item !== undefined
        ) as FavoriteProduct[];

      setFavorites(favoriteProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-lg font-semibold border-t border-primary mx-4  px-6">
        {faLocalization.loading}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex justify-center py-20 text-xl font-bold border-t border-primary mx-4 px-6">
        {favoriteLocalization.noProduct}
      </div>
    );
  }

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${BASE_url}/api/records/favorites/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(sweetAlert.successfullyDeleted);
      fetchFavorites();
    } catch {
      toast.error(sweetAlert.errorInDeleteData);
    }
  };

  return (
    <div className="border-t border-primary mx-4 pt-6 px-6">
      <h1 className="font-semibold">{favoriteLocalization.favPage}</h1>
      <div className=" p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map(({ favoriteId, product, discountPercent }) => {
          const discountedPrice = Math.round(
            product.productPrice * (1 - discountPercent / 100)
          );

          return (
            <div
              key={favoriteId}
              className="bg-white rounded-xl border border-accent shadow p-4 flex flex-col items-center"
            >
              <img
                src={`${BASE_url}${product.image}`}
                alt={product.productName}
                className="w-24 h-24 object-cover rounded-md"
              />

              <h2 className="text-center font-semibold my-2 flex items-center md:h-12">
                {product.productName}
              </h2>
              <p className="text-gray-500 text-sm mb-1">
                {productsLocalization.expireDate}:{" "}
                <span dir="ltr"> {product.productExpired}</span>
              </p>

              {discountedPrice !== product.productPrice ? (
                <div className="flex flex-col items-center mb-2 h-12">
                  <span className="text-gray-400 line-through text-sm">
                    {product.productPrice.toLocaleString()}{" "}
                    {faLocalization.rial}
                  </span>
                  <span className="text-green-600 font-bold">
                    {discountedPrice.toLocaleString()} {faLocalization.rial}
                  </span>
                </div>
              ) : (
                <p className="text-green-600 font-semibold mb-2 flex items-center h-12">
                  {product.productPrice.toLocaleString()} {faLocalization.rial}
                </p>
              )}

              <div className="flex gap-2 items-center justify-center">
                <Link href={`/singleProduct/${product.id}`}>
                  <button className="mt-auto py-1 px-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm active:scale-95">
                    {favoriteLocalization.seeProduct}
                  </button>
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(favoriteId)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full"
                >
                  <AiFillHeart size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Favorite;
