"use client";

import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import axios from "axios";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-toastify";

export default function FavoriteButton({
  productId,
  isFavorite,
  favoriteRecords,
}: {
  productId: string;
  isFavorite: boolean;
  favoriteRecords: { id: string; productId: string }[];
}) {
  const [isFav, setIsFav] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState(
    favoriteRecords.find((fav) => fav.productId === productId)?.id
  );

  const token = getAuthToken();

  const handleToggle = async () => {
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
        toast.success("از علاقه‌مندی‌ها حذف شد");
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
        toast.success("به علاقه‌مندی‌ها اضافه شد");
        setIsFav(true);
        setFavoriteId(res.data.id);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      toast.error("خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="absolute top-0 right-0 text-red-500 text-xl hover:scale-110 transition-transform"
      >
        {isFav ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
      </button>
    </div>
  );
}
