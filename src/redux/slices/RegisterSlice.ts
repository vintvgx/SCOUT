import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface RegisterSliceType {
  expoPushToken: string | undefined;
}

const initialState: RegisterSliceType = {
  expoPushToken: undefined,
};

export const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setExpoPushToken: (state, action: PayloadAction<string | undefined>) => {
      state.expoPushToken = action.payload;
    },
  },
});

export const { setExpoPushToken } = RegisterSlice.actions;

export default RegisterSlice.reducer;
