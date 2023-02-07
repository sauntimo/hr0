import type { RedirectLoginOptions } from "@auth0/auth0-react";
import auth0 from "auth0-js";
import CryptoJS from "crypto-js";
import randomBytes from "randombytes";
import { env } from "../env/client.mjs";

const base64URLEncode = (string: string) =>
  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(string))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

export const verifier = base64URLEncode(randomBytes(32).toString());

export const challenge = base64URLEncode(
  CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(verifier)).toString()
);

export const webAuth = new auth0.WebAuth({
  domain: env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientID: env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
});

// export const login = () => {
//   webAuth.authorize({
//     responseType: "code",
//     audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
//     scope: env.NEXT_PUBLIC_SCOPES,
//     clientID: env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
//     redirectUri: env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
//   });
// };

export const redirecLoginOptions: RedirectLoginOptions = {
  appState: {
    returnTo: "/profile",
  },
  authorizationParams: {
    prompt: "consent",
    // screen_hint: "signin",
  },
};

export const redirecLoginOptionsSignup: RedirectLoginOptions = {
  appState: {
    returnTo: "/profile",
  },
  authorizationParams: {
    prompt: "consent",
    screen_hint: "signup",
  },
};
