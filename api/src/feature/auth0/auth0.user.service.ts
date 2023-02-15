import { ApiResponse } from "@commonTypes/api-response";
import axios from "axios";
import { AUTH0_DOMAIN, AUTH0_MANAGE_API_TOKEN } from "../../config/globals";
import { AppError } from "../../errors/app-error";
import { Auth0User } from "./auth0.types";

interface CreateAuth0UserParams {
  name: string;
  email: string;
  password: string;
}

export const createAuth0User = async ({
  name,
  email,
  password,
}: CreateAuth0UserParams): Promise<ApiResponse<Auth0User>> => {
  try {
    const result = await axios.request<Auth0User>({
      method: "POST",
      url: `https://${AUTH0_DOMAIN}/api/v2/users`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH0_MANAGE_API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
      data: {
        name,
        email,
        password,
        connection: "Username-Password-Authentication",
      },
    });

    const { status, data } = result;
    console.log({ status, data });

    if (status >= 400) {
      throw new AppError("Auth0 request returned failed");
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Failed to create new Auth0 User" },
    };
  }
};

interface GetAuth0UserParams {
  sub: string;
}

export const getAuth0User = async ({
  sub,
}: GetAuth0UserParams): Promise<ApiResponse<Auth0User>> => {
  try {
    const result = await axios.request<Auth0User>({
      method: "GET",
      url: `https://${AUTH0_DOMAIN}/api/v2/users/${sub}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH0_MANAGE_API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
    });

    const { status, data } = result;
    console.log({ status, data });

    if (status >= 400) {
      throw new AppError("Auth0 request returned failed");
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Failed to retrieve Auth0 User" },
    };
  }
};
