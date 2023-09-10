import { configureStore } from '@reduxjs/toolkit';

import { editorReducer } from './stores/editor';
import { userReducer } from './stores/user';

export const store = configureStore({
  reducer: {
    editorReducer,
    userReducer,
  },
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
