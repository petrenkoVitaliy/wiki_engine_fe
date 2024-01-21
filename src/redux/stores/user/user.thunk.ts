import { AuthHandler } from '@/auth/auth.handler';
import { apiHandler } from '@/api/api-handler/api.handler';

import { User } from '@/api/types/user.types';

import { createHandledAsyncThunk } from '../../thunk';
import { sliceName } from './user.slice';

export const resetPassword = createHandledAsyncThunk(
  `${sliceName}/resetPassword`,
  async (params: {
    credentials: { email: string };
    from: string | null;
    callback: (isSuccessful: boolean) => void;
  }) => {
    const signupResponse = await apiHandler.resetPassword(params.credentials, params.from);

    params.callback(signupResponse.status === 'ok');
  }
);

export const confirmPasswordReset = createHandledAsyncThunk(
  `${sliceName}/confirmPasswordReset`,
  async (params: {
    credentials: { password: string; otp: string; email: string };
    callback: (user: User | null) => void;
  }) => {
    const resetResponse = await AuthHandler.confirmPasswordReset(params.credentials);
    let user: User | null = null;

    if (resetResponse.status === 'ok') {
      user = resetResponse.result.user;
    }

    params.callback(user);
    return user;
  }
);

export const loginUser = createHandledAsyncThunk(
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

export const signUp = createHandledAsyncThunk(
  `${sliceName}/createUser`,
  async (params: {
    from: string | null;
    credentials: { password: string; email: string; name: string };
    callback: (isSuccessful: boolean) => void;
  }) => {
    const signupResponse = await apiHandler.signup(params.credentials, params.from);

    params.callback(signupResponse.status === 'ok');
  }
);
