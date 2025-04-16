import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductsProps } from "@/app/types/products";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const token = getAuthToken();

export const editProduct = createAsyncThunk<ProductsProps, ProductsProps>(
  "products/edit",
  async (updatedProduct, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_url}/api/records/drugs/${updatedProduct.id}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
