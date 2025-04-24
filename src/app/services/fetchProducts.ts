import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductsProps } from "@/app/types/products";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

export const token = getAuthToken();

interface FetchProductsArgs {
  filterKey?: string;
  filterValue?: string;
}

export const fetchProducts = createAsyncThunk<
  ProductsProps[],
  FetchProductsArgs | undefined
>("products/fetch", async (params, thunkAPI) => {
  try {
    const { filterKey, filterValue } = params || {};

    const url =
      filterKey && filterValue
        ? `${BASE_url}/api/records/drugs?filterKey=${filterKey}&filterValue=${filterValue}`
        : `${BASE_url}/api/records/drugs`;

    const response = await axios.get(url, {
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
});
