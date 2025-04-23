import axios from "axios";
import { getAuthToken } from "../base/getAuthToken";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";

export const fetchDiscountedProducts = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${BASE_url}/api/records/offProducts`, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.records;
};
