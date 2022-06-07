import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LogginState {
  value: Boolean;
}

const initialState: LogginState = {
  value: false,
};

const logginSlice = createSlice({
  name: "logged",
  initialState,
  reducers: {
    login(state) {
      state.value = true;
    },
    logout(state) {
      state.value = false;
    },
  },
});

export const { login, logout } = logginSlice.actions;
export default logginSlice.reducer;
