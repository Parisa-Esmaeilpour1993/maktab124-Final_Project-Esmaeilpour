import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthToken } from "../base/getAuthToken";

export const token = getAuthToken();
export const deleteProduct = createAsyncThunk<string, string>(
  "products/delete",
  async (productId, thunkAPI) => {
    try {
      await axios.delete(`${BASE_url}/api/records/drugs/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return productId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
