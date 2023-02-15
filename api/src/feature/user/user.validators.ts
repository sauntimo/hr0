import { UserCreate, UserUpdateBySub } from "@commonTypes/user";
import { celebrate, Joi, Segments } from "celebrate";
import { GetUserBySubParams, GetUsersByOrgParams } from "./user.types";

const userCreateSchema = Joi.object<UserCreate>().keys({
  name: Joi.string().required(),
  sub: Joi.string().required(),
  email: Joi.string().required(),
  email_verified: Joi.bool(),
  created_at: Joi.date(),
  organization_auth_provider_id: Joi.string().required(),
  picture: Joi.string(),
});

export const postUserValiadtor = celebrate<unknown, unknown, UserCreate>({
  [Segments.BODY]: userCreateSchema,
});

const getUserBySubSchema = Joi.object<GetUserBySubParams>().keys({
  sub: Joi.string().required(),
});

export const getUserBySubValiadtor = celebrate<unknown, unknown, UserCreate>({
  [Segments.PARAMS]: getUserBySubSchema,
});

const userUpdateSchema = Joi.object<UserUpdateBySub>().keys({
  name: Joi.string(),
  sub: Joi.string(),
  email: Joi.string(),
  email_verified: Joi.bool(),
  created_at: Joi.date(),
  organization_auth_provider_id: Joi.string(),
  picture: Joi.string(),
  job_title: Joi.string(),
  salary: Joi.number(),
});

export const patchUserValiadtor = celebrate<unknown, unknown, UserUpdateBySub>({
  [Segments.PARAMS]: getUserBySubSchema,
  [Segments.BODY]: userUpdateSchema,
});

const getUsersByOrgSchema = Joi.object<GetUsersByOrgParams>().keys({
  org: Joi.string().required(),
});

export const getUsersByOrgValiadtor = celebrate<unknown, unknown, UserCreate>({
  [Segments.PARAMS]: getUsersByOrgSchema,
});
