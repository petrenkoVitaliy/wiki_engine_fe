import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/api/types/user.types';

import { loginUser } from './user.thunk';

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null,
};

export const sliceName = 'user';

export const userSlice = createSlice({
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
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;