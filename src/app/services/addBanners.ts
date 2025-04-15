import axios from "axios";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { uploadImage } from "@/app/services/uploadService";
import { getAuthToken } from "@/app/base/getAuthToken";
import { BannerFormDataProps } from "../types/Banner";

export async function addBanner(
  formData: BannerFormDataProps,
  imageFile: File | null,
  bgFile: File | null
) {
  const token = getAuthToken();

  const [imageUrl, bgUrl] = await Promise.all([
    imageFile ? uploadImage(imageFile) : "",
    bgFile ? uploadImage(bgFile) : "",
  ]);

  const payload = {
    ...formData,
    image: imageUrl,
    background: bgUrl,
  };

  await axios.post(`${BASE_url}/api/records/banners`, payload, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
}
