import axios from "axios";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const getProducts = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${BASE_url}/api/records/drugs`, {
      headers: {
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت بلاگ‌ها:", error);
    return [];
  }
};
