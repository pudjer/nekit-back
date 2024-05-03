import * as Joi from 'joi';


export const privateAttributes = ['password', 'hashedPassword', 'blocked', 'valid_since'] as const
export const [password, ...privateAttributesWithoutPassword] = privateAttributes
export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PORT: Joi.number().default(3000),
    SECRET_KEY: Joi.string(),
    JWT_ACCESS_EXPIRATION_TIME: [Joi.number(), Joi.string().regex(/^\d+( days|d|h| hrs|m|s|y)?$/)],
    JWT_REFRESH_EXPIRATION_TIME: [Joi.number(), Joi.string().regex(/^\d+( days|d|h| hrs|m|s|y)?$/)],
    MONGO_USERNAME: Joi.string(),
    MONGO_PASSWORD: Joi.string(),
    MONDO_PORT: Joi.number(),
    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number(),
    SMTP_USER: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
})

export const messagePattern = 'IF U DONT TRY TO REGISTER EMAIL ON MYSITE SKIP THIS MESSAGE, overwise click:'