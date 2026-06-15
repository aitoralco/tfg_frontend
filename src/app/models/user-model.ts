export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}
