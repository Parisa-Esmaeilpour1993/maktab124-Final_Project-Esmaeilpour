import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import { getAuthToken } from "../base/getAuthToken";

const token = getAuthToken();

export const addCategory = createAsyncThunk(
  "categories/add",
  async (title: string) => {
    const res = await axios.post(
      `${BASE_url}/api/records/category`,
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
    return res.data.records;
  }
);
