import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/api/types/user.types';

import { loginUser, confirmPasswordReset } from './user.thunk';

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null,
};

export const sliceName = 'user';

const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(confirmPasswordReset.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
