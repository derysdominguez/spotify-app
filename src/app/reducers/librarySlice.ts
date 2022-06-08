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
        },
        // add_track(state, action) {
        //     state.library
        // }
    }
});

export const { set_library } = librarySlice.actions;

export default librarySlice.reducer;