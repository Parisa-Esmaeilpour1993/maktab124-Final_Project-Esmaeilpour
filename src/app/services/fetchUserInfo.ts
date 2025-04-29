import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";

export const fetchUserInfo = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_url}/api/users/me`, {
      headers: {
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("خطا در گرفتن اطلاعات یوزر", err);
    return null;
  }
};
