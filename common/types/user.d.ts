export interface UserCreate {
  name: string;
  sub: string;
  email: string;
  email_verified: boolean;
  created_at: Date;
  organization_auth_provider_id: string;
  picture?: string;
}

// only require sub
export type UserUpdate = Partial<UserCreate> & {
  job_title?: string;
  salary?: numer;
};
