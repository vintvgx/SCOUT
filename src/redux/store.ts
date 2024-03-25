import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import issuesReducer from "./slices/ProjectsSlice";

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
  },
});

// Define a type for the slice state
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch types
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
