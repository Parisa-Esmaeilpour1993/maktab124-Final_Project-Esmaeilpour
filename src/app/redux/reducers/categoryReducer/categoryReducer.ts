import { faLocalization } from "@/app/constants/localization/fa/localization";
import { addCategory } from "@/app/services/addCategory";
import { addSubCategory } from "@/app/services/addSubCategory";
import { deleteCategory } from "@/app/services/deleteCategory";
import { deleteSubCategory } from "@/app/services/deleteSubCategory";
import { editSubCategory } from "@/app/services/editSubCategory";
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
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index].title = action.payload.title;
        }
      })

      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        const { categoryId, subCategoryId } = action.payload;
        const categoryIndex = state.categories.findIndex(
          (cat) => cat.id === categoryId
        );
        if (categoryIndex !== -1) {
          state.categories[categoryIndex].children =
            state.categories[categoryIndex].children?.filter(
              (sub) => sub.id !== subCategoryId
            ) ?? [];
        }
      })

      .addCase(editSubCategory.fulfilled, (state, action) => {
        const { categoryId, subCategoryId, title } = action.payload;
        const categoryIndex = state.categories.findIndex(
          (cat) => cat.id === categoryId
        );
        if (categoryIndex !== -1) {
          const subCategoryIndex = state.categories[
            categoryIndex
          ].children?.findIndex((sub) => sub.id === subCategoryId);
          if (subCategoryIndex !== undefined && subCategoryIndex !== -1) {
            state.categories[categoryIndex].children![subCategoryIndex].title =
              title;
          }
        }
      });
  },
});

export const categoryReducer = categorySlice.reducer;
export default categorySlice.reducer;
