import { faLocalization } from "@/app/constants/localization/fa/localization";
import { addCategory } from "@/app/services/addCategory";
import { deleteCategory } from "@/app/services/deleteCategory";
import { editCategory } from "@/app/services/editCategory";
import { fetchCategories } from "@/app/services/fetchCategory";
import { CategoryState } from "@/app/types/category";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? faLocalization.errorInFetchingCategories;
      })

      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? faLocalization.errorInAddingCategories;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      })

      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload?.id
        );
        if (index !== -1) {
          state.categories[index].title = action.payload.title;
        }
      });
  },
});

export const categoryReducer = categorySlice.reducer;
export default categorySlice.reducer;
