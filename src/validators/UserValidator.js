const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
    signup: celebrate({
        [Segments.BODY]: Joi
            .object()
            .keys({
                hash: Joi.string().required(),
                firstName: Joi.string().required(),
                middleName: Joi.string().required(),
                lastName: Joi.string().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
    }),
    login: celebrate({
        [Segments.BODY]: Joi
            .object()
            .keys({
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
    }),
    update: celebrate({
        [Segments.BODY]: Joi
            .object()
            .keys({
                hashRole: Joi.string().required(),
                firstName: Joi.string().required(),
                middleName: Joi.string().required(),
                lastName: Joi.string().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
    }),
};