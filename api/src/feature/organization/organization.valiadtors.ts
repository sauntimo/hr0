import { celebrate, Joi, Segments } from "celebrate";
import {
  GetOrganizationByAuthIDParams,
  OrganizationCreate,
} from "../../../../common/types/organization";
import { OrganizationUpdate } from "@commonTypes/organization";

const getOrganizationByAuthIdSchema =
  Joi.object<GetOrganizationByAuthIDParams>().keys({
    organizationAuthId: Joi.string().required(),
  });

export const getOrganizationByAuthIdValiadtor = celebrate<
  unknown,
  unknown,
  GetOrganizationByAuthIDParams
>({
  [Segments.PARAMS]: getOrganizationByAuthIdSchema,
});

const updateOrganizationSchema = Joi.object<OrganizationUpdate>().keys({
  auth_provider_id: Joi.string().required(),
  name: Joi.string(),
});

export const updateOrganizationByAuthIdValiadtor = celebrate<
  unknown,
  unknown,
  GetOrganizationByAuthIDParams
>({
  [Segments.PARAMS]: getOrganizationByAuthIdSchema,
  [Segments.BODY]: updateOrganizationSchema,
});

const createOrganizationSchema = Joi.object<OrganizationCreate>().keys({
  org_auth_provider_name: Joi.string().required(),
  org_display_name: Joi.string().required(),
  user_name: Joi.string().required(),
  user_email: Joi.string().required(),
});

export const createOrganizationValidator = celebrate<
  unknown,
  unknown,
  OrganizationCreate
>({
  [Segments.BODY]: createOrganizationSchema,
});
