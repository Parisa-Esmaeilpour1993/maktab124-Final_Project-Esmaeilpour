import { NewProductProps, ProductsProps } from "@/app/types/products";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const token = getAuthToken();
export const addProduct = createAsyncThunk<ProductsProps, NewProductProps>(
  "products/add",
  async (newProduct, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_url}/api/records/drugs`,
        newProduct,
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
