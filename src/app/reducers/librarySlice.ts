import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface libraryState {
    library: {};
}

const initialState: libraryState = {
    library: {},
}

const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        set_library(state, action) {
            state.library = action.payload
        }
    }
});

export const { set_library } = librarySlice.actions;

export default librarySlice.reducer;