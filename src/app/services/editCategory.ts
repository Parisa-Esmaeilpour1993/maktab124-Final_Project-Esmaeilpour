// services/editCategory.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

const token = getAuthToken();
export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ id, title }: { id: string; title: string }) => {
    const response = await axios.put(
      `${BASE_url}/api/records/category/${id}`,
      {
        title,
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.records;
  }
);
