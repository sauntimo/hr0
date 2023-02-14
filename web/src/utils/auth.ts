import type { RedirectLoginOptions } from "@auth0/auth0-react";
import auth0 from "auth0-js";
import CryptoJS from "crypto-js";
import randomBytes from "randombytes";
import { Buffer } from "buffer";
import {
  AUDIENCE,
  CALLBACK_URL,
  CLIENT_ID,
  DOMAIN,
  SCOPES,
} from "../config/globals";

const base64URLEncode = (string: string) =>
  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(string))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

const URLEncode = (str: string): string => {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

// const sha256 = async (buffer: Buffer): Promise<string> => {
//   return await CryptoJS.SHA256();

//   return await Crypto.digestStringAsync(
//     Crypto.CryptoDigestAlgorithm.SHA256,
//     buffer,
//     { encoding: Crypto.CryptoEncoding.BASE64 }
//   );
// };

const generateChallenge = (): {
  codeVerifier: string;
  codeChallenge: string;
} => {
  const someRandomBytes = randomBytes(32);
  const base64String = Buffer.from(someRandomBytes).toString("base64");
  const codeVerifier = URLEncode(base64String);
  const codeChallenge = URLEncode(
    CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64)
  );

  return { codeVerifier, codeChallenge };
};

export const { codeVerifier, codeChallenge } = generateChallenge();

export const verifier = base64URLEncode(randomBytes(32).toString());

export const challenge = base64URLEncode(
  CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(verifier)).toString()
);

// export const webAuth = new auth0.WebAuth({
//   domain: DOMAIN,
//   clientID: CLIENT_ID,
// });

// export const login = () => {
//   webAuth.authorize({
//     responseType: "code",
//     audience: AUDIENCE,
//     scope: SCOPES,
//     clientID: CLIENT_ID,
//     redirectUri: "https://localhost:3000/redirect",
//     // redirectUri: "https://localhost:3000/account",
//   });
// };

export const redirecLoginOptions: RedirectLoginOptions = {
  appState: {
    returnTo: "/account",
  },
  authorizationParams: {
    prompt: "consent",
    scopes: SCOPES,
    // screen_hint: "signin",
  },
};

export const redirecLoginOptionsSignup: RedirectLoginOptions = {
  appState: {
    returnTo: "/profile",
  },
  authorizationParams: {
    prompt: "login",
    screen_hint: "signup",
  },
};
