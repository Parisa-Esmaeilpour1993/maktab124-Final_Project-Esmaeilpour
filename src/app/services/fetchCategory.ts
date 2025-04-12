import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

const token = getAuthToken();

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const res = await axios.get(`${BASE_url}/api/records/category`, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.records;
  }
);
