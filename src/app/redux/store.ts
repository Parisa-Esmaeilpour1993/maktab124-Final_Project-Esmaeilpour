import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import categoryReducer from "./reducers/categoryReducer/categoryReducer";

const combinedReducers = combineReducers({
  categories: categoryReducer,
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
