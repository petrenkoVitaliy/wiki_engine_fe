import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';

export function createHandledAsyncThunk<T, P>(
  ...[prefix, creator]: Parameters<typeof createAsyncThunk<T, P>>
): ReturnType<typeof createAsyncThunk<T, P>> {
  const f = (async (arg, api) => {
    try {
      return await creator(arg, api);
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  }) as AsyncThunkPayloadCreator<T, P>;

  return createAsyncThunk<T, P>(prefix, f);
}
