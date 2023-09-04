import { configureStore } from '@reduxjs/toolkit';

import { editorReducer } from './slices/editor.slice';
import { userReducer } from './slices/user.slice';

export const store = configureStore({
  reducer: {
    editorReducer,
    userReducer,
  },
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
