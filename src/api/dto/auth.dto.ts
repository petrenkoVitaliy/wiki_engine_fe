export type LoginDto = {
  token: {
    token: string;
  };
  user: UserDto;
};

export type UserDto = {
  id: number;
  email: string;
  name: string;
  active: boolean;

  role_id: number;
  created_at: string;
  updated_at?: string;
  updated_by?: number;
};
