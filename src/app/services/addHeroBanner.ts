import axios from "axios";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { uploadImage } from "@/app/services/uploadService";
import { getAuthToken } from "@/app/base/getAuthToken";
import { HeroBannerProps } from "../types/Banner";

export async function addHeroBanner(
  formData: HeroBannerProps,
  imageFile: File | null
) {
  const token = getAuthToken();

  const [imageUrl] = await Promise.all([
    imageFile ? uploadImage(imageFile) : "",
  ]);

  const payload = {
    ...formData,
    image: imageUrl,
  };

  await axios.post(`${BASE_url}/api/records/heroBanner`, payload, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
}
