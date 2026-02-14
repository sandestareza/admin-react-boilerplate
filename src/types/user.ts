export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status?: 'active' | 'pending' | 'inactive'; // Added status as it was used in UsersPage
  createdAt?: string;
}
