import { useEffect } from "react";
import { login } from "../utils/auth";
import type { NextApplicationPage } from "./_app";

const SignIn: NextApplicationPage = () => {
  useEffect(() => {
    login();
  }, []);

  return null;
};

export default SignIn;
