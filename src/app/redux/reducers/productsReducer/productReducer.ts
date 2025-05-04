import { createSlice } from "@reduxjs/toolkit";
import { ProductsState } from "@/app/types/products";
import { fetchProducts } from "@/app/services/fetchProducts";
import { editProduct } from "@/app/services/editProducts";
import { deleteProduct } from "@/app/services/deleteProducts";
import { addProduct } from "@/app/services/addProducts";

const initialState: ProductsState = {
  products: [],
  totalRecords: 0,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.records;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const productReducer = productSlice.reducer;
export default productSlice.reducer;
