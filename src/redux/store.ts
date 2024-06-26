import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import issuesReducer from "./slices/SentryDataSlice";
import registerReducer from "./slices/RegisterSlice";

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    register: registerReducer,
  },
});

// Define a type for the slice state
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch types
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
