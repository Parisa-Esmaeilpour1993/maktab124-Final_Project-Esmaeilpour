"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import { favoriteProductsProps } from "@/app/types/products";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-toastify";

export default function FavoriteButton({
  productId,
  isFavorite,
  favoriteRecords,
}: favoriteProductsProps) {
  const [isFav, setIsFav] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState(
    favoriteRecords.find((fav) => fav.productId === productId)?.id
  );

  const token = getAuthToken();
  const router = useRouter();

  const handleToggle = async () => {
    if (!token) {
      toast.info(productsLocalization.loginError);
      setTimeout(() => {
        router.push("/login");
      }, 500);
      return;
    }

    setLoading(true);
    try {
      if (isFav) {
        await axios.delete(`${BASE_url}/api/records/favorites/${favoriteId}`, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(productsLocalization.removeFav);
        setIsFav(false);
        setFavoriteId(undefined);
      } else {
        const res = await axios.post(
          `${BASE_url}/api/records/favorites`,
          { productId },
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(productsLocalization.addFav);
        setIsFav(true);
        setFavoriteId(res.data.id);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      toast.error(sweetAlert.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggle();
        }}
        disabled={loading}
        className="absolute top-0 right-0 text-red-500 text-xl hover:scale-110 transition-transform"
      >
        {isFav ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
      </button>
    </div>
  );
}
