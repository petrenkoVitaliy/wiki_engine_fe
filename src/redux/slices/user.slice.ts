import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/api/types/user.types';
import { AuthHandler } from '@/auth/auth.handler';
import { createHandledAsyncThunk } from '../thunk';

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null,
};

const sliceName = 'user';

const loginUser = createHandledAsyncThunk(
  `${sliceName}/loginUser`,
  async (params: {
    credentials: { password: string; email: string };
    callback: (user: User | null) => void;
  }) => {
    const loginResponse = await AuthHandler.login(params.credentials);
    let user: User | null = null;

    if (loginResponse.status === 'ok') {
      user = loginResponse.result.user;
    }

    params.callback(user);
    return user;
  }
);

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

export { loginUser };
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
