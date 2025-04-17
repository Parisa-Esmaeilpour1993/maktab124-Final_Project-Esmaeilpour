import axios from "axios";
import { BASE_url, API_KEY } from "@/app/constants/api/BASE_URL";
import { getAuthToken } from "@/app/base/getAuthToken";

export const fetchUsers = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${BASE_url}/api/admin/users`, {
    headers: {
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.data);
  return res.data;
};
