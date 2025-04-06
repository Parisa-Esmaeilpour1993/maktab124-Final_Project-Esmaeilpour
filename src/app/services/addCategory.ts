import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/api/BASE_URL";

export const addCategory = createAsyncThunk(
  "categories/add",
  async (title: string) => {
    const res = await axios.post(BASE_URL, {
      title,
    });
    return res.data;
  }
);
