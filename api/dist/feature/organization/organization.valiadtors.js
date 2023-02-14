"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganizationValidator = exports.updateOrganizationByAuthIdValiadtor = exports.getOrganizationByAuthIdValiadtor = void 0;
const celebrate_1 = require("celebrate");
const getOrganizationByAuthIdSchema = celebrate_1.Joi.object().keys({
    organizationAuthId: celebrate_1.Joi.string().required(),
});
exports.getOrganizationByAuthIdValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getOrganizationByAuthIdSchema,
});
const updateOrganizationSchema = celebrate_1.Joi.object().keys({
    auth_provider_id: celebrate_1.Joi.string().required(),
    name: celebrate_1.Joi.string(),
});
exports.updateOrganizationByAuthIdValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getOrganizationByAuthIdSchema,
    [celebrate_1.Segments.BODY]: updateOrganizationSchema,
});
const createOrganizationSchema = celebrate_1.Joi.object().keys({
    org_auth_provider_name: celebrate_1.Joi.string().required(),
    org_display_name: celebrate_1.Joi.string().required(),
    user_name: celebrate_1.Joi.string().required(),
    user_email: celebrate_1.Joi.string().required(),
});
exports.createOrganizationValidator = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: createOrganizationSchema,
});
