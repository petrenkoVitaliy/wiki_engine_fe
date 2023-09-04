export type VerboseResponse<T> =
  | {
      status: 'ok';
      result: T;
    }
  | {
      status: 'error';
      message: string;
    };
