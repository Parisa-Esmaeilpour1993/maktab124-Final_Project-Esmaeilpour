// services/getBlogs.ts
import axios from "axios";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";

export const getBlogs = async () => {
  try {
    const response = await axios.get(`${BASE_url}/api/records/blogs`, {
      headers: {
        api_key: API_KEY,
        Authorization: `Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjNiZDZjNTNkNjcxZTRkMWU0YTMzNiIsImlhdCI6MTc0NDEyMzY3NCwiZXhwIjoxNzQ0Mjk2NDc0fQ.YnOQiFkheOpKw0J3G9coEw1L3asOnD3_CfrJC7XBAuY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت بلاگ‌ها:", error);
    return [];
  }
};
