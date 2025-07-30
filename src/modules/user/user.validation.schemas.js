import Joi from "joi";

export const signupValidationSchema = {
  body: Joi.object({
    userName: Joi.string().min(5).max(10),
    email: Joi.string().email({ tlds: { allow: ["com", "org", "net"] } }),
    password: Joi.string().min(6).max(12),
  })
    .options({ presence: "required" })
    .required(),
};


export const signinValidationSchema = {
  body: Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "org", "net"] } }),
    password: Joi.string().min(6).max(12),
  })
    .options({ presence: "required" })
    .required(),
};