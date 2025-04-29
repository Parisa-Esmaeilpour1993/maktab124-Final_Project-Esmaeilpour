import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";

export async function getBanners() {
  try {
    const res = await fetch(`${BASE_url}/api/records/banners`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
      },
      next: { revalidate: 0 },
    });

    const json = await res.json();
    return json.records || [];
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}
