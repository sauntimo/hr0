// import { decode } from "jsonwebtoken";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "..";
import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";
import { API_URL, CALLBACK_URL, CLIENT_ID, DOMAIN } from "../config/globals";
import type { IdTokenWithSub } from "../types/jwt";
import { codeVerifier } from "../utils/auth";
// import { codeVerifier } from "../utils/auth";
import { callExternalApi } from "../utils/external-api.service";

// function useEffectively(fnToRun: () => Promise<void>, deps = []) {
//   const refRanOnce = useRef(false);
//   const refDeps = useRef(deps);

//   useEffect(() => {
//     const depsChanged = !isEqual(refDeps.current, deps); // isEqual can be a custom code or import it from lodash
//     if (!refRanOnce.current || depsChanged) {
//       refRanOnce.current = true;
//       refDeps.current = deps;
//       void fnToRun();
//     }
//   }, deps);
// }

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
}

const RedirectPage: React.FC = () => {
  const { handleRedirectCallback, isLoading, isAuthenticated } = useAuth0();

  // void handleRedirectCallback(window.location.href);

  const [accessToken, setAccessToken] = useStore((state) => [
    state.accessToken,
    state.setAccessToken,
  ]);
  const [idToken, setIdToken] = useStore((state) => [
    state.idToken,
    state.setIdToken,
  ]);

  const [searchParams] = useSearchParams();

  const codeParam = searchParams.get("code");

  // console.log(`[${codeVerifier}]`);

  useEffect(() => {
    const getAccessToken = async () => {
      // console.log({
      //   method: "POST",
      //   url: `https://${DOMAIN}/oauth/token`,
      //   data: {
      //     grant_type: "authorization_code",
      //     client_id: CLIENT_ID,
      //     code_verifier: codeVerifier,
      //     code: codeParam,
      //     redirect_uri: "https://localhost:3000/redirect",
      //   },
      //   withCredentials: false,
      // });

      const result = await callExternalApi<AccessTokenResponse>({
        config: {
          method: "POST",
          url: `https://${DOMAIN}/oauth/token`,
          data: {
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            // code_verifier: codeVerifier,
            code: codeParam,
            redirect_uri: "https://localhost:3000/account",
          },
          withCredentials: false,
        },
      });

      if (result.success) {
        setAccessToken(result.data.access_token);
        // const idToken = decode(result.data.id_token) as IdTokenWithSub;
        // setIdToken(idToken);
      }

      // console.log(result);
    };

    void getAccessToken();
  }, []);

  // const navigate = useNavigate();
  // const shouldRedirect = useRef(true);

  // useEffect(() => {
  //   if (shouldRedirect.current) {
  //     shouldRedirect.current = false;

  //     const test = async () => {
  //       try {
  //         await handleRedirectCallback();
  //         navigate("/account");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //     void test();
  //   }
  // }, [navigate]);

  return (
    <Layout title="Redirect">
      <Container title="Redirect">
        <p>Signing in..</p>
        {/* <p>isLoading: {isLoading}</p>
        <p>isAuthenticated: {isAuthenticated}</p> */}
      </Container>
    </Layout>
  );
};

export default RedirectPage;
