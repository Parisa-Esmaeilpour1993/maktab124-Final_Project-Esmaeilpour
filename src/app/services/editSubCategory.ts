import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/api/BASE_URL";

export const editSubCategory = createAsyncThunk(
  "categories/editSubCategory",
  async ({
    categoryId,
    subCategoryId,
    title,
  }: {
    categoryId: string;
    subCategoryId: string;
    title: string;
  }) => {
    const response = await axios.put(
      `${BASE_URL}/${categoryId}/subCategories/${subCategoryId}`,
      { title }
    );
    return { categoryId, subCategoryId, title: response.data.title };
  }
);
