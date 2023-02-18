import { ApiResponse } from "@commonTypes/api-response";
import { AppMetadata, User, UserMetadata } from "auth0";
import { auth0ManagementClient } from "../..";

interface CreateAuth0UserParams {
  name: string;
  email: string;
  password: string;
}

export const createAuth0User = async ({
  name,
  email,
  password,
}: CreateAuth0UserParams): Promise<
  ApiResponse<User<AppMetadata, UserMetadata>>
> => {
  try {
    const result = await auth0ManagementClient.createUser({
      name,
      email,
      password,
      connection: "Username-Password-Authentication",
    });

    console.log(result);

    return { success: true, data: result };
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
}: GetAuth0UserParams): Promise<
  ApiResponse<User<AppMetadata, UserMetadata>>
> => {
  try {
    const result = await auth0ManagementClient.getUser({
      id: sub,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Failed to retrieve Auth0 User" },
    };
  }
};
