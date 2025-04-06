import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/api/BASE_URL";

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
  }
);
