export interface LoginPayload {
  password: string;
  username: string;
}

export interface AuthInfo {
  id: number;
  created: string;
  updated: string;
  name: unknown;
  description: unknown;
  username: string;
  email: string;
  roles: unknown[];
  lei: unknown;
  address: unknown;
  organization: unknown;
  website: unknown;
  banned: unknown;
  bannedReason: unknown;
  active: unknown;
  ranges: unknown[];
  qrs: unknown;
}
