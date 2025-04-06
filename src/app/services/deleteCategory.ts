// services/deleteCategory.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/api/BASE_URL";

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string) => {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  }
);
