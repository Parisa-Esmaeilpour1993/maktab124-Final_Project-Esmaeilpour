import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../constants/api/BASE_URL";

export const addSubCategory = createAsyncThunk(
  "categories/addSubCategory",
  async ({ parentId, title }: { parentId: string; title: string }) => {
    const res = await axios.get(`${BASE_URL}/${parentId}`);
    const parent = res.data;

    const updatedChildren = Array.isArray(parent.children)
      ? [...parent.children, { id: uuidv4(), title }]
      : [{ id: uuidv4(), title }];

    const updated = await axios.put(`${BASE_URL}/${parentId}`, {
      ...parent,
      children: updatedChildren,
    });

    return updated.data;
  }
);
