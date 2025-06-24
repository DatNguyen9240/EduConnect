export interface Profile {
  // Account table fields
  accountId: number;
  username: string;
  email: string;
  roleId: number;

  // Parent table fields
  parentId: number;
  fullName: string;
  phone: string;
  parentEmail: string;
}
