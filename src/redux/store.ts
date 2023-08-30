import { configureStore } from '@reduxjs/toolkit';

import { editorReducer } from './slices/editor.slice';

export const store = configureStore({
  reducer: {
    editorReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
