import { ProductsProps } from "@/app/types/products";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthToken } from "../base/getAuthToken";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";

export const token = getAuthToken();

interface FetchProductsArgs {
  filterKey?: string;
  filterValue?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

export const fetchProducts = createAsyncThunk<
  { records: ProductsProps[]; totalRecords: number },
  FetchProductsArgs | undefined
>("products/fetch", async (params, thunkAPI) => {
  try {
    const { filterKey, filterValue, currentPage, itemsPerPage } = params || {};

    const urlParams = new URLSearchParams();

    if (filterKey && filterValue) {
      urlParams.append("filterKey", filterKey);
      urlParams.append("filterValue", filterValue);
    }

    if (currentPage !== undefined) {
      urlParams.append("page", currentPage.toString());
    }

    if (itemsPerPage !== undefined) {
      urlParams.append("limit", itemsPerPage.toString());
    }

    const url = `${BASE_url}/api/records/drugs?${urlParams.toString()}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      records: response.data.records,
      totalRecords: response.data.total,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
