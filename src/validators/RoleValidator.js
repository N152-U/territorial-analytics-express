const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi
            .object()
            .keys({
                role: Joi.string().required(),
                permissions: Joi.array().required()
            }),

    }),
    update: celebrate({
        [Segments.BODY]: Joi
            .object()
            .keys({
                role: Joi.string().required(),
                permissions: Joi.array().required()
            }),
    }),
};