"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByOrgValiadtor = exports.patchUserValiadtor = exports.getUserByIdValiadtor = exports.getUserBySubValiadtor = exports.postUserValiadtor = void 0;
const celebrate_1 = require("celebrate");
const userCreateSchema = celebrate_1.Joi.object().keys({
    name: celebrate_1.Joi.string().required(),
    sub: celebrate_1.Joi.string().required(),
    email: celebrate_1.Joi.string().required(),
    email_verified: celebrate_1.Joi.bool(),
    created_at: celebrate_1.Joi.date(),
    organization_auth_provider_id: celebrate_1.Joi.string().required(),
    picture: celebrate_1.Joi.string(),
});
exports.postUserValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: userCreateSchema,
});
const getUserBySubSchema = celebrate_1.Joi.object().keys({
    sub: celebrate_1.Joi.string().required(),
});
exports.getUserBySubValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getUserBySubSchema,
});
const getUserByIdSchema = celebrate_1.Joi.object().keys({
    userId: celebrate_1.Joi.number().required(),
});
exports.getUserByIdValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getUserByIdSchema,
});
const userUpdateSchema = celebrate_1.Joi.object().keys({
    name: celebrate_1.Joi.string(),
    sub: celebrate_1.Joi.string(),
    email: celebrate_1.Joi.string(),
    email_verified: celebrate_1.Joi.bool(),
    created_at: celebrate_1.Joi.date(),
    organization_auth_provider_id: celebrate_1.Joi.string(),
    picture: celebrate_1.Joi.string(),
    job_title: celebrate_1.Joi.string(),
    salary: celebrate_1.Joi.number(),
});
exports.patchUserValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getUserBySubSchema,
    [celebrate_1.Segments.BODY]: userUpdateSchema,
});
const getUsersByOrgSchema = celebrate_1.Joi.object().keys({
    org: celebrate_1.Joi.string().required(),
});
exports.getUsersByOrgValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getUsersByOrgSchema,
});
