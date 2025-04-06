import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/api/BASE_URL";

export const deleteSubCategory = createAsyncThunk(
  "categories/deleteSubCategory",
  async ({
    categoryId,
    subCategoryId,
  }: {
    categoryId: string;
    subCategoryId: string;
  }) => {
    await axios.delete(
      `${BASE_URL}/${categoryId}/subCategories/${subCategoryId}`
    );
    return { categoryId, subCategoryId };
  }
);
