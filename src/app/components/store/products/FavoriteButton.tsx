"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import {
  productsLocalization,
  sweetAlert,
} from "@/app/constants/localization/fa/localization";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-toastify";

export default function FavoriteButton({ productId }: { productId: string }) {
  const [isFav, setIsFav] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getAuthToken();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userIdi = user?.userIdi;

  useEffect(() => {
    if (!token) return;
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${BASE_url}/api/records/favorites`, {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        const favorites = res.data.records || [];
        const match = favorites.find(
          (item: any) =>
            item.productId === productId && item.userIdi === userIdi
        );
        if (match) {
          setIsFav(true);
          setFavoriteId(match.id);
        }
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    };
    fetchFavorites();
  }, [productId, token]);

  const handleToggle = async () => {
    if (!token) {
      toast.info(productsLocalization.loginError);
      setTimeout(() => router.push("/login"), 500);
      return;
    }

    setLoading(true);
    try {
      if (isFav && favoriteId) {
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
          { productId, userIdi },
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
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={loading}
      className="absolute top-2 right-2 z-10 text-red-500 text-xl hover:scale-110 transition-transform"
    >
      {isFav ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
    </button>
  );
}
