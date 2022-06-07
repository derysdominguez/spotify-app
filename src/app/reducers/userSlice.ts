import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface userState {
    userInfo: {
      id: string | null,
      images: {
        url: string | null
      }[]
    };

}

const initialState: userState = {
    userInfo: {
      id: "",
      images: [
        {url: ""}
      ]
    },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set_user(state, action) {
      state.userInfo = action.payload;
    },
    //   rmv_user(state) {
    //     state.value = false;
    //   },
  },
});

export const { set_user } = userSlice.actions;
export default userSlice.reducer;
