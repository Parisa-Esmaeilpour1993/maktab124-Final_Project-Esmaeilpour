import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const uploadImage = async (file: File) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(`${BASE_url}/api/files/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data?.downloadLink || null;
};
