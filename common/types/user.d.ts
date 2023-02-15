export interface UserCreate {
  name: string;
  sub: string;
  email: string;
  email_verified: boolean;
  created_at: Date;
  organization_auth_provider_id: string;
  picture?: string;
}

interface UserUpdate extends Partial<UserCreate> {
  job_title?: string;
  salary?: numer;
}

export interface UserUpdateBySub extends UserUpdate {
  sub: string;
}
export interface UserUpdateById extends UserUpdate {
  id: number;
}
