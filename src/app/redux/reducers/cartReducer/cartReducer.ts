import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { cartLocalization } from "@/app/constants/localization/fa/localization";
import { CartItem } from "@/app/types/cart";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "failed";
}

const initialState: CartState = {
  items: [],
  status: "idle",
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, thunkAPI) => {
    const token = getAuthToken();
    try {
      const res = await axios.get(`${BASE_url}/api/records/cart`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      const records = res.data.records as CartItem[];

      if (records.length > 0) {
        const cartId = records[0].id;
        localStorage.setItem("cartId", cartId);
      }

      return res.data.records as CartItem[];
    } catch (error) {
      return thunkAPI.rejectWithValue(cartLocalization.errorInRecieve);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    thunkAPI
  ) => {
    const token = getAuthToken();
    try {
      const productRes = await axios.get(
        `${BASE_url}/api/records/drugs/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const product = productRes.data;

      let discountPercent = 0;
      try {
        const discountRes = await axios.get(
          `${BASE_url}/api/records/offProducts`,
          {
            headers: {
              "Content-Type": "application/json",
              api_key: API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const discounts = discountRes.data.records || [];
        const matchingDiscount = discounts.find(
          (item: any) => item.productName === product.productName
        );
        if (matchingDiscount) {
          discountPercent = matchingDiscount.discountPercent || 0;
        }
      } catch (error) {
        console.warn(error);
      }

      const addCartRes = await axios.post(
        `${BASE_url}/api/records/cart`,
        {
          productId: productId,
          quantity: quantity,
          productName: product.productName,
          productPrice: product.productPrice,
          productExpired: product.productExpired,
          image: product.image,
          productQuantity: product.productQuantity,
          discountPercent: discountPercent,
          productCategory: product.productCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartItem = addCartRes.data;

      return {
        id: cartItem.id,
        productId: productId,
        quantity: quantity,
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
        productExpired: product.productExpired,
        image: product.image,
        discountPercent,
      } as CartItem;
    } catch (error) {
      return thunkAPI.rejectWithValue(cartLocalization.errorInAdd);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: string, thunkAPI) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${BASE_url}/api/records/cart/${cartItemId}`, {
        headers: {
          "Content-Type": "application/json",
          api_key: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return cartItemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(cartLocalization.errorInDelete);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    thunkAPI
  ) => {
    try {
      const token = getAuthToken();
      await axios.put(
        `${BASE_url}/api/records/cart/${cartItemId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { cartItemId, quantity };
    } catch (error) {
      return thunkAPI.rejectWithValue(cartLocalization.errorInEdit);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "idle";
        const newItem = action.payload;
        const existingItem = state.items.find(
          (item) => item.productId === newItem.productId
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      })
      .addCase(addToCart.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        const cartItemId = action.payload;
        state.items = state.items.filter((item) => item.id !== cartItemId);
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.payload;
        const existingItem = state.items.find((item) => item.id === cartItemId);
        if (existingItem) {
          existingItem.quantity = quantity;
        }
      });
  },
});

export const cartReducer = cartSlice.reducer;
export default cartSlice.reducer;
