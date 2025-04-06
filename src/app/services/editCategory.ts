// services/editCategory.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/api/BASE_URL";

export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ id, title }: { id: string; title: string }) => {
    const response = await axios.put(`${BASE_URL}/${id}`, {
      title,
    });
    return response.data;
  }
);
