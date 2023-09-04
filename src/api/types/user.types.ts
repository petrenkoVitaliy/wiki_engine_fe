export type User = {
  id: number;
  email: string;
  name: string;
  active: boolean;

  role_id: number;
  created_at: string;
  updated_at?: string;
  updated_by?: number;
};
