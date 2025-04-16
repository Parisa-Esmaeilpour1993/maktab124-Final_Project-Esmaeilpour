import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import categoryReducer from "./reducers/categoryReducer/categoryReducer";
import { productReducer } from "./reducers/productsReducer/productReducer";

const combinedReducers = combineReducers({
  categories: categoryReducer,
  products: productReducer,
});

const persistedReducers = persistReducer(
  {
    key: "listOfCategories",
    storage,
    whitelist: ["categories"],
  },
  combinedReducers
);

const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
