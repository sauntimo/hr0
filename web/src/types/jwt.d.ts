import type { IdToken } from "@auth0/auth0-react";

interface IdTokenWithSub extends IdToken {
  sub: string;
}
