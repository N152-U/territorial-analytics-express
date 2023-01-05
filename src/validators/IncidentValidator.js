const { celebrate, Joi, Segments } = require("celebrate");

module.exports = {
  datesCodifications: celebrate({
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
        })
        .allow("null")
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      codificationTypeId: Joi.number()
        .messages({
          "string.base": `"codificationTypeId"  debe ser numérico`,
          "string.empty": `"codificationTypeId"  debe contener un valor`,
          "string.min": `"codificationTypeId"  debe ser minimo 1`,
          "any.required": `"codificationTypeId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
    }),
  }),
  dates: celebrate({
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
        })
        .allow("null")
        .required(),
    }),
  }),
  vither: celebrate({
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
        })
        .allow("null")
        .required(),
    }),
  }),
  date: celebrate({
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
  geojson: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.date()
        .iso()
        .messages({
          "date.format": `El formato de fecha es:  YYYY-MM-DD`,
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      endDate: Joi.date()
        .iso()
        .min(Joi.ref("startDate"))
        .messages({
          "date.format": `El formato de fecha es: YYYY-MM-DD`,
          "date.min": `"finalDate" debe ser mayor o igual que "startDate"`,
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      codificationTypeId: Joi.number()
        .messages({
          "string.base": `"codificationTypeId"  debe ser numérico`,
          "string.empty": `"codificationTypeId"  debe contener un valor`,
          "string.min": `"codificationTypeId"  debe ser minimo 1`,
          "any.required": `"codificationTypeId" es un campo obligatorio`,
        })
        .allow("all")
        .required(),
    }),
  }),
  series: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.date()
        .iso()
        .messages({
          "date.format": `El formato de fecha es:  YYYY-MM-DD`,
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      endDate: Joi.date()
        .iso()
        .min(Joi.ref("startDate"))
        .messages({
          "date.format": `El formato de fecha es: YYYY-MM-DD`,
          "date.min": `"finalDate" debe ser mayor o igual que "startDate"`,
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        })
        .required(),
      codificationTypeId: Joi.number()
        .messages({
          "string.base": `"codificationTypeId"  debe ser numérico`,
          "string.empty": `"codificationTypeId"  debe contener un valor`,
          "string.min": `"codificationTypeId"  debe ser minimo 1`,
          "any.required": `"codificationTypeId" es un campo obligatorio`,
        })
        .allow("all")
        .required(),
    }),
  }),
  recurrence: celebrate({
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
        })
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      codificationTypeId: Joi.number()
        .messages({
          "string.base": `"codificationTypeId"  debe ser numérico`,
          "string.empty": `"codificationTypeId"  debe contener un valor`,
          "string.min": `"codificationTypeId"  debe ser minimo 1`,
          "any.required": `"codificationTypeId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
    }),
  }),
  informeSemanalPDF: celebrate({
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
        })
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      codificationTypeId: Joi.number()
        .messages({
          "string.base": `"codificationTypeId"  debe ser numérico`,
          "string.empty": `"codificationTypeId"  debe contener un valor`,
          "string.min": `"codificationTypeId"  debe ser minimo 1`,
          "any.required": `"codificationTypeId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      chartCodification: Joi.string().required().messages({
        "string.base": `"chartCodification" debe ser una cadena de caracteres`,
        "string.empty": `"chartCodification"  debe contener un valor`,
        "any.required": `"chartCodification" es un campo obligatorio`,
      }),
      chartMunicipalities: Joi.string().required().messages({
        "string.base": `"chartMunicipalities" debe ser una cadena de caracteres`,
        "string.empty": `"chartMunicipalities"  debe contener un valor`,
        "any.required": `"chartMunicipalities" es un campo obligatorio`,
      }),
    }),
  }),
  diarioencharcamientos: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  diarioencharcamientosvialidadprimaria: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  diarioencharcamientosvialidadsecundaria: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  relacionfugaspendientes: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  relacionfaltasaguapendientes: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  reportespendientesperiodo: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
      codificationType: Joi.number()
        .messages({
          "string.base": `"codificationType"  debe ser numérico`,
          "string.empty": `"codificationType"  debe contener un valor`,
          "string.min": `"codificationType"  debe ser minimo 1`,
          "any.required": `"codificationType" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      serviceCenter: Joi.number()
        .messages({
          "string.base": `"serviceCenter"  debe ser numérico`,
          "string.empty": `"serviceCenter"  debe contener un valor`,
          "string.min": `"serviceCenter"  debe ser minimo 1`,
          "any.required": `"serviceCenter" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      municipality: Joi.number()
        .messages({
          "string.base": `"municipality"  debe ser numérico`,
          "string.empty": `"municipality"  debe contener un valor`,
          "string.min": `"municipality"  debe ser minimo 1`,
          "any.required": `"municipality" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
    }),
  }),
  solicitudespipas: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  cortesfaltasagua: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  reportesdrenaje: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  encharcamientosxalcaldia: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  encharcamientosxalcaldiaxtipofalla: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  resumenacumuladogeneralencharcamientos: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  prediosafectados: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  sustitucionaccesorioshidraulicos: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  analisisgeneral: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  fugasaguapotablediametrosalcaldias: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  fugasaguaspotablediametrosscmxalcaldias: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  atencionfaltasaguapotablescmx: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  reparacionesfugasaguapotablesacmex: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  reparacionesfugasaguapotablescmxalcaldias: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  atencionfugasaguapotableanual: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  reconstruccionpavimentacion: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
      codificationType: Joi.number()
        .messages({
          "string.base": `"codificationType"  debe ser numérico`,
          "string.empty": `"codificationType"  debe contener un valor`,
          "string.min": `"codificationType"  debe ser minimo 1`,
          "any.required": `"codificationType" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      serviceCenter: Joi.number()
        .messages({
          "string.base": `"serviceCenter"  debe ser numérico`,
          "string.empty": `"serviceCenter"  debe contener un valor`,
          "string.min": `"serviceCenter"  debe ser minimo 1`,
          "any.required": `"serviceCenter" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      municipality: Joi.number()
        .messages({
          "string.base": `"municipality"  debe ser numérico`,
          "string.empty": `"municipality"  debe contener un valor`,
          "string.min": `"municipality"  debe ser minimo 1`,
          "any.required": `"municipality" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
    }),
  }),
  reportespendientesalcaldias: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  relacionfaltasaguapendientes: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      startDate: Joi.string()
        .messages({
          "any.required": `"startDate" es un campo obligatorio`,
        })
        .required(),
      finalDate: Joi.string()
        .messages({
          "any.required": `"finalDate" es un campo obligatorio`,
        })
        .allow("null")
        .allow(null)
        .required(),
    }),
  }),
  datosabiertos: celebrate({
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
        })
        .allow("null")
        .required(),
    }),
  }),
  datosabiertosincidentsinconcert: celebrate({
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
        })
        .allow("null")
        .required(),
    }),
  }),
  getIncidentsByCodificationTypeBetweenDates: celebrate({
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
        })
        .allow("null")
        .required(),
      codificationId: Joi.number()
        .messages({
          "string.base": `"codificationId"  debe ser numérico`,
          "string.empty": `"codificationId"  debe contener un valor`,
          "string.min": `"codificationId"  debe ser minimo 1`,
          "any.required": `"codificationId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
      codificationTypeId: Joi.number()
        .messages({
          "string.base": `"codificationTypeId"  debe ser numérico`,
          "string.empty": `"codificationTypeId"  debe contener un valor`,
          "string.min": `"codificationTypeId"  debe ser minimo 1`,
          "any.required": `"codificationTypeId" es un campo obligatorio`,
        })
        .allow("null")
        .required(),
    }),
  }),
};
