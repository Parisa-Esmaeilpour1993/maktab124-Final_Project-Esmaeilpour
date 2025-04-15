// services/fetchBanners.ts
import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";
import { BannerProps } from "../types/Banner";

export const fetchBanners = async (): Promise<BannerProps[]> => {
  const token = getAuthToken();
  try {
    const res = await axios.get(`${BASE_url}/api/records/banners`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.records;
  } catch (err) {
    console.error("خطا در گرفتن بنرها:", err);
    return [];
  }
};
