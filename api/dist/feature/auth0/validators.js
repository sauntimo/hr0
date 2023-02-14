"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInviteValidator = void 0;
const celebrate_1 = require("celebrate");
const userInviteSchema = celebrate_1.Joi.object().keys({
    inviterName: celebrate_1.Joi.string().required(),
    inviteeEmail: celebrate_1.Joi.string().email().required(),
});
exports.userInviteValidator = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: userInviteSchema,
});
