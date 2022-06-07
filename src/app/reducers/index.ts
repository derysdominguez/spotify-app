import { combineReducers } from "@reduxjs/toolkit";
import logginSlice from './logginSlice';
import userSlice from './userSlice';
import librarySlice from './librarySlice';

const allReducers = combineReducers({
    isLogged: logginSlice,
    userInfo: userSlice,
    myLibrary: librarySlice
})
export default allReducers;