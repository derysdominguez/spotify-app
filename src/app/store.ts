import { configureStore, ThunkAction, Action, compose } from '@reduxjs/toolkit';
import allReducers from './reducers';

const store = configureStore({
  reducer: allReducers,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;