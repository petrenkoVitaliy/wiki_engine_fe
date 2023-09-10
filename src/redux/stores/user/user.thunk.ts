import { AuthHandler } from '@/auth/auth.handler';
import { apiHandler } from '@/api/api-handler/api.handler';

import { User } from '@/api/types/user.types';

import { createHandledAsyncThunk } from '../../thunk';
import { sliceName } from './user.slice';

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
