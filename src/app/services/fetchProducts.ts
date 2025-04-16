import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductsProps } from "@/app/types/products";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const token = getAuthToken();

export const fetchProducts = createAsyncThunk<ProductsProps[]>(
  "products/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_url}/api/records/drugs`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.records;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
