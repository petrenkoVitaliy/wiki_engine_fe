import { VerboseResponse } from '../../types/request';

const ERROR_MESSAGE = 'Something went very wrong';

class InternalFetchHandler {
  protected async fetchApi<T>(urn: string, fetchOptions: RequestInit): Promise<VerboseResponse<T>> {
    const res = await fetch(urn, { ...fetchOptions });

    if (!res.ok) {
      return {
        status: 'error',
        message: ERROR_MESSAGE,
      };
    }

    const responseBody = (await res.json()) as T;

    return {
      status: 'ok',
      result: responseBody,
    };
  }
}

export { InternalFetchHandler };
