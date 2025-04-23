import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const favorites = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${BASE_url}/api/records/favorites`, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.records;
};
