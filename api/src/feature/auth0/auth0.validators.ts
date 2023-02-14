import { celebrate, Joi, Segments } from "celebrate";

export interface UserInviteParams {
  inviterName: string;
  inviteeEmail: string;
}

const userInviteSchema = Joi.object<UserInviteParams>().keys({
  inviterName: Joi.string().required(),
  inviteeEmail: Joi.string().email().required(),
});

export const userInviteValidator = celebrate<
  unknown,
  unknown,
  UserInviteParams
>({
  [Segments.BODY]: userInviteSchema,
});
