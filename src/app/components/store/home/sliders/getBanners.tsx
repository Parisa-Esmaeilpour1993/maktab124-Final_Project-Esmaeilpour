// lib/getBanners.ts
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";

export async function getBanners() {
  try {
    const res = await fetch(`${BASE_url}/api/records/banners`, {
      headers: {
        api_key: API_KEY,
        cache: "no-store", // Optional: برای جلوگیری از کش
      },
      next: { revalidate: 0 }, // Optional: ISR را خاموش می‌کنه
    });

    const json = await res.json();
    return json.records || [];
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}
