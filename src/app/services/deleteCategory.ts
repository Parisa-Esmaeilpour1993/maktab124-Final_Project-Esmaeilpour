// services/deleteCategory.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

const token = getAuthToken();

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string) => {
    await axios.delete(`${BASE_url}/api/records/category/${id}`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  }
);
