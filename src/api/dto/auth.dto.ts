export type LoginDto = {
  token: {
    token: string;
  };
  user: UserDto;
};

type UserDto = {
  email: string;
  name: string;
  role_id: number;
};

export type ArticlePermission = 'Edit' | 'Patch';

export type UserWithPermissionsDto = {
  user: UserDto;
  permissions: ArticlePermission[];
};
