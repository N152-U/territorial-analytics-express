const { celebrate, Joi, Segments } = require("celebrate");

module.exports = {
  receipts: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.date()
        .iso()
        .messages({
          "date.format": `El formato de fecha es:  YYYY-MM-DD`,
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.date()
        .iso()
        .min(Joi.ref("startDate"))
        .messages({
          "date.format": `El formato de fecha es: YYYY-MM-DD`,
          "date.min": `"finalDate" debe ser mayor o igual que "startDate"`,
          "any.required": `"finalDate" es un campo obligatorio`,
        }).allow('null')
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        }).allow('null')
        .required(),
    }),
  }),
  resume: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      date: Joi.date()
        .iso()
        .messages({
          "date.format": `El formato de fecha es:  YYYY-MM-DD`,
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
    }),
  }),
  relaciondereportescapturadosderedessociales:celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        }).allow('null').allow(null)
        .required(),
    }),
  }),
  resume: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      date: Joi.date()
        .iso()
        .messages({
          "date.format": `El formato de fecha es:  YYYY-MM-DD`,
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
    }),
  }),
};
