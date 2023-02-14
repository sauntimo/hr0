export interface Auth0OrganizationCreate {
  id: string;
  name: string;
  display_name: string;
  branding?: {
    logo_url?: string;
    colors?: {
      primary?: string;
      page_background?: string;
    };
  };
  metadata?: Record<string, string>;
}

interface Auth0OrganizationCreationResponse {
  id: string;
  name: string;
  display_name: string;
  enabled_connections: [
    {
      connection_id: string;
      assign_membership_on_login: boolean;
    }
  ];
}

interface Auth0Connection {
  connection: string;
  user_id: string;
  provider: string;
  isSocial: boolean;
}

export interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  username: string;
  phone_number: string;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  identities: Auth0Connection[];
  app_metadata: Record<string, string>;
  user_metadata: Record<string, string>;
  picture: string;
  name: string;
  nickname: string;
  multifactor: string[];
  last_ip: string;
  last_login: string;
  logins_count: number;
  blocked: false;
  given_name: string;
  family_name: string;
}
