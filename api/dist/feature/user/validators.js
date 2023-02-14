"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchUserValiadtor = exports.getUserValiadtor = exports.postUserValiadtor = void 0;
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
const getUserSchema = celebrate_1.Joi.object().keys({
    sub: celebrate_1.Joi.string().required(),
});
exports.getUserValiadtor = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: getUserSchema,
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
    [celebrate_1.Segments.PARAMS]: getUserSchema,
    [celebrate_1.Segments.BODY]: userUpdateSchema,
});
