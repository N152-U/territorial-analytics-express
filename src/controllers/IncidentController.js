const { IncidentService, CatalogService } = require("../services/index.js");
const auth = require("../utils/auth.js");
const jwt = require("jsonwebtoken");
const APIError = require("../utils/error.js");
const { epochDateTimeParser } = require("../utils/helpers.js");
const { parse } = require("uuid");
const Moment = require("moment");
const GeoJSON = require("geojson");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const fs = require("fs");
const http = require("http");
const pdf = require("html-pdf");
const { logoCDMXB64 } = require("../public/img/logos/logoCDMX");
const {
  logoCiudadInnovadoraB64,
} = require("../public/img/logos/logoCiudadInnovadora");
const { templatediarioencharcamiento } = require("../public/informesdrenaje/js/diarioencharcamiento");
const { relacionpendientes } = require("../public/informesaguapotable/js/relacionpendientes");
const { solicitudpipas } = require("../public/informesaguapotable/js/solicitudespipas");
const { reconstruccionpavimentacionfuncion } = require("../public/informesaguapotable/js/reconstruccionpavimentacionfuncion");
const { cortesfaltaagua } = require("../public/informesaguapotable/js/cortesfaltasagua");
const { resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldiafuncion } = require("../public/informesaguapotable/js/resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldiafuncion");
const { atencionfugasaguapotableanualfuncion } = require("../public/informesaguapotable/js/atencionfugasaguapotableanualfuncion");
const { analisisgeneralfuncion } = require("../public/informesaguapotable/js/analisisgeneralfuncion");
const { reparacionesfugasaguapotablesacmexfuncion } = require("../public/informesaguapotable/js/reparacionesfugasaguapotablesacmexfuncion");
const { atencionfaltasaguapotablescmxfuncion } = require("../public/informesaguapotable/js/atencionfaltasaguapotablescmxfuncion");
const { encharcamientosxalcaldiafuncion } = require("../public/informesdrenaje/js/encharcamientosxalcaldiafuncion");
const { reportesdrenajefuncion } = require("../public/informesdrenaje/js/reportesdrenajefuncion");
const { sustitucionaccesorioshidraulicosfuncion } = require("../public/informesdrenaje/js/sustitucionaccesorioshidraulicosfuncion");
const { prediosafectadosfuncion } = require("../public/informesdrenaje/js/prediosafectadosfuncion");
const { reportespendientesalcaldiasfuncion } = require("../public/informesotros/js/reportespendientesalcaldiasfuncion");
const { reportespendientesperiodofuncion } = require("../public/informesotros/js/reportespendientesperiodofuncion");
const { encharcamientosxalcaldiaxtipofallafuncion } = require("../public/informesdrenaje/js/encharcamientosxalcaldiaxtipofallafuncion");
const { resumenacumuladogeneralencharcamientosfuncion } = require("../public/informesdrenaje/js/resumenacumuladogeneralencharcamientosfuncion");
const { reparacionesfugasaguapotablescmxalcaldiasfuncion } = require("../public/informesaguapotable/js/reparacionesfugasaguapotablescmxalcaldiasfuncion");
const { fugasaguapotablediametrosalcaldiasfuncion } = require("../public/informesaguapotable/js/fugasaguapotablediametrosalcaldiasfuncion");
const { fugasaguaspotablediametrosscmxalcaldiasfuncion } = require("../public/informesaguapotable/js/fugasaguaspotablediametrosscmxalcaldiasfuncion");
const { informesemanalfuncion } = require ("../public/informeSemanal/js/informesemanalfuncion");
const CatalogController = require("./CatalogController.js");
const { logDate } = require("../middleware/index.js");
const { dateFormatter } = require("../middleware/index.js");
const { v4: uuidv4 } = require('uuid');

(MomentRange = require("moment-range")),
  (moment = MomentRange.extendMoment(Moment));
moment.suppressDeprecationWarnings = true;
const mkdirp = require("mkdirp");
const { start } = require("repl");
const _dirname = process.env._dirname + '/'
//desarrollo
const filepath = __dirname + '../..' + process.env.TMP_PATH_PDF;
//produccion
//const filepath = _dirname + process.env.TMP_PATH_PDF + '/';

/* const width = 820,
  height = 1122; */
let height = 794, width = 1122;
let heightInformeSemanal = 1122, widthInformeSemanal = 794;
const PDF_OPTS_INFORME_SEMANAL = {
  width: `${widthInformeSemanal}px`,
  height: `${heightInformeSemanal}px`,
  border: "10px",
  format: "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  orientation: "portrait", // portrait or landscape
  viewportSize: {
    widthInformeSemanal,
    heightInformeSemanal
  },
};

const PDF_OPTS_INFORMES_SEMANAL = {
  //width: `${width}px`,
  //height: `${height}px`,
  format: "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  orientation: "portrait", // portrait or landscape
  border: "10px",
  /*viewportSize: {
    width,
    height
  },*/
};


const PDF_OPTS_INFORMES = {
  width: `${width}px`,
  height: `${height}px`,
  format: "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  orientation: "landscape", // portrait or landscape
  border: "10px",
  viewportSize: {
    width,
    height
  },
};


module.exports = {
  informeSemanalPDF: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const { chartMunicipalities, chartCodification } = req.body;

      //Número de incidentes
      const incidentsCountByDate = await IncidentService.incidentsCountByDate(
        startDate,
        finalDate,
        codificationId,
        codificationTypeId
      );
      //Top settlement
      let incidentsCodificationTop;

      if (codificationId != "null" || codificationTypeId != "null") {
        incidentsCodificationTop =
          await IncidentService.incidentsCodificationTopSettlementByCodification(
            startDate,
            finalDate,
            codificationId,
            codificationTypeId
          );
      } else {
        incidentsCodificationTop =
          await IncidentService.incidentsCodificationTopSettlement(
            startDate,
            finalDate,
            codificationId,
            codificationTypeId
          );
      }
      //Tabla incidentes recurrentes
      const incidentsRecurrence = await IncidentService.incidentsRecurrence(
        startDate,
        finalDate,
        codificationId,
        codificationTypeId
      );

      const htmlTemplate = require('../public/informeSemanal/template/informesemanal');

      const prehtml = informesemanalfuncion(startDate, finalDate, chartMunicipalities, chartCodification, incidentsCountByDate, incidentsCodificationTop, incidentsRecurrence, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      html = htmlTemplate.html
        .replace("{{logoCDMX}}", prehtml.logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", prehtml.logoCiudadInnovadoraB64)
        .replace("{{date}}", `Semana del ${prehtml.dateStart} al ${prehtml.dateEnd}`)
        .replace("{{incidentsCountWeek}}", prehtml.countByDate)
        .replace("{{startDate}}", prehtml.startDate)
        .replace("{{finalDate}}", prehtml.finalDate)
        .replace("{{chartMunicipalities}}", prehtml.chartMunicipalities)
        .replace("{{chartCodification}}", prehtml.chartCodification)
        .replace("{{ranking_settlements}}", prehtml.resultIncidentsCodificationTop)
        .replace("{{container_settlements}}", prehtml.headerTableIncidentsCodificationTop)
        .replace("{{container_recurrencia_incidentes}}", await prehtml.function);

      //path producción
      const path = _dirname + "/public/informeSemanal/renders/reportesemanal.html"
      //path desarrollo
      //const path = __dirname + "../../public/informeSemanal/renders/reportesemanal.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informeSemanal/renders/reportesemanal.html"),
          "utf8"
        );

        const file = `informeSemanalPDF${uuidv4()}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES_SEMANAL).toFile(filepath + '/' + file, function (err, responsePDF) {
          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });

    } catch (error) {
      next(error);
    }
  },
  /*INFORMES DRENAJE */
  diarioencharcamientos: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);

      const diarioencharcamientos = await IncidentService.diarioencharcamientos(formattedStartDate, formattedFinalDate);
      const getAllFloodingReasons = await CatalogService.getAllFloodingReasons();

      const htmlTemplate = require('../public/informesdrenaje/templates/diarioencharcamiento');

      const html = templatediarioencharcamiento(formattedStartDate, formattedFinalDate, today, diarioencharcamientos, htmlTemplate.html, getAllFloodingReasons, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/diarioencharcamiento.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/diarioencharcamiento.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;

        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/diarioencharcamiento.html"),
          "utf8"
        );
        /*  pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
           const informediarioencharcamientoB64 = `data:application/pdf;base64,${buffer.toString(
             "base64"
           )}`;
 
           res.status(200).json({
             payload: { data: informediarioencharcamientoB64 },
           });
         }); */
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `diarioencharcamiento${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

      /*  writeFile(path, html); */
      /*       fs.writeFileSync(, html, {flag:'a+'}); */



    } catch (error) {
      next(error);
    }

  },
  diarioencharcamientosvialidadprimaria: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);

      const diarioencharcamientosvialidadprimaria = await IncidentService.diarioencharcamientos(formattedStartDate, formattedFinalDate, 1);
      const getAllFloodingReasons = await CatalogService.getAllFloodingReasons();

      const htmlTemplate = require('../public/informesdrenaje/templates/diarioencharcamientosvialidadprimaria');

      /*       const tmpl = fs.readFileSync(
              require.resolve("../public/informesdrenaje/html/diarioencharcamientosvialidadprimaria.html"),
              "utf8"
            );
       */
      const html = templatediarioencharcamiento(formattedStartDate, formattedFinalDate, today, diarioencharcamientosvialidadprimaria, htmlTemplate.html, getAllFloodingReasons, logoCDMXB64, logoCiudadInnovadoraB64);

      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/diarioencharcamientosvialidadprimaria.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/diarioencharcamientosvialidadprimaria.html"


      /*  pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
         const informediarioencharcamientosvialidadprimariaB64 = `data:application/pdf;base64,${buffer.toString(
           "base64"
         )}`;
 
         res.status(200).json({
           payload: { data: informediarioencharcamientosvialidadprimariaB64 },
         });
       }); */

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;

        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/diarioencharcamientosvialidadprimaria.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `diarioencharcamientosvialidadprimaria${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });


    } catch (error) {
      next(error);
    }
  },
  diarioencharcamientosvialidadsecundaria: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);

      const diarioencharcamientosvialidadsecundaria = await IncidentService.diarioencharcamientos(formattedStartDate, formattedFinalDate, 2);
      const getAllFloodingReasons = await CatalogService.getAllFloodingReasons();

      const htmlTemplate = require('../public/informesdrenaje/templates/diarioencharcamientosvialidadsecundaria');

      /* const tmpl = fs.readFileSync(
        require.resolve("../public/informesdrenaje/html/diarioencharcamientosvialidadsecundaria.html"),
        "utf8"
      ); */

      const html = templatediarioencharcamiento(formattedStartDate, formattedFinalDate, today, diarioencharcamientosvialidadsecundaria, htmlTemplate.html, getAllFloodingReasons, logoCDMXB64, logoCiudadInnovadoraB64);

      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/diarioencharcamientosvialidadsecundaria.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/diarioencharcamientosvialidadsecundaria.html"



      /* pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
        const informediarioencharcamientosvialidadsecundariaB64 = `data:application/pdf;base64,${buffer.toString(
          "base64"
        )}`;
        res.status(200).json({
          payload: { data: informediarioencharcamientosvialidadsecundariaB64 },
        });
      }); */
      fs.writeFile(path, html, function (err) {
        if (err) throw err;

        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/diarioencharcamientosvialidadsecundaria.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `diarioencharcamientosvialidadsecundaria${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },
  reportesdrenaje: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const reportesdrenaje = await IncidentService.reportesdrenaje(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesdrenaje/templates/reportesdrenaje');

      const html = reportesdrenajefuncion(formattedStartDate, formattedFinalDate, today, reportesdrenaje, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/reportesdrenaje.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/reportesdrenaje.html"
      // writeFile function with filename, content and callback function
      /* pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
        const informereportesdrenajeB64 = `data:application/pdf;base64,${buffer.toString(
          "base64"
        )}`;
        res.status(200).json({
          payload: { data: informereportesdrenajeB64 },
        });
      }); */
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/reportesdrenaje.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `reportesdrenaje${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  encharcamientosxalcaldia: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const encharcamientosxalcaldia = await IncidentService.encharcamientosxalcaldia(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesdrenaje/templates/encharcamientosxalcaldia');

      const html = encharcamientosxalcaldiafuncion(formattedStartDate, formattedFinalDate, today, encharcamientosxalcaldia, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/encharcamientosxalcaldia.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/encharcamientosxalcaldia.html"
      // writeFile function with filename, content and callback function
      /* pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
        const informeencharcamientosxalcaldiaB64 = `data:application/pdf;base64,${buffer.toString(
          "base64"
        )}`;
        res.status(200).json({
          payload: { data: informeencharcamientosxalcaldiaB64 },
        });
      }); */
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/encharcamientosxalcaldia.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `encharcamientosxalcaldia${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  prediosafectados: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const prediosafectados = await IncidentService.prediosafectados(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesdrenaje/templates/prediosafectados');

      const html = prediosafectadosfuncion(formattedStartDate, formattedFinalDate, today, prediosafectados, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/prediosafectados.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/prediosafectados.html"
      // writeFile function with filename, content and callback function
      /* pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
        const informeprediosafectadosB64 = `data:application/pdf;base64,${buffer.toString(
          "base64"
        )}`;
        res.status(200).json({
          payload: { data: informeprediosafectadosB64 },
        });
      }); */
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/prediosafectados.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `prediosafectados${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  sustitucionaccesorioshidraulicos: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const sustitucionaccesorioshidraulicos = await IncidentService.sustitucionaccesorioshidraulicos(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesdrenaje/templates/sustitucionaccesorioshidraulicos');

      const html = sustitucionaccesorioshidraulicosfuncion(formattedStartDate, formattedFinalDate, today, sustitucionaccesorioshidraulicos, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path para producción
      const path = _dirname + "/public/informesdrenaje/renders/sustitucionaccesorioshidraulicos.html"
      //path para desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/sustitucionaccesorioshidraulicos.html"


      /*   pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informesustitucionaccesorioshidraulicosB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;
          res.status(200).json({
            payload: { data: informesustitucionaccesorioshidraulicosB64 },
          });
        }); */

      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/sustitucionaccesorioshidraulicos.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `sustitucionaccesorioshidraulicos${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });

    } catch (error) {
      next(error);
    }
  },
  encharcamientosxalcaldiaxtipofalla: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const encharcamientosxalcaldiaxtipofalla = await IncidentService.encharcamientosxalcaldiaxtipofalla(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesdrenaje/templates/encharcamientosxalcaldiaxtipofalla');

      const html = encharcamientosxalcaldiaxtipofallafuncion(formattedStartDate, formattedFinalDate, today, encharcamientosxalcaldiaxtipofalla, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/encharcamientosxalcaldiaxtipofalla.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/encharcamientosxalcaldiaxtipofalla.html"

      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/encharcamientosxalcaldiaxtipofalla.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `encharcamientosxalcaldiaxtipofalla${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  resumenacumuladogeneralencharcamientos: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const resumenacumuladogeneralencharcamientos = await IncidentService.diarioencharcamientos(formattedStartDate, formattedFinalDate, 0);
      const encharcamientosxalcaldiaxtipofalla = await IncidentService.encharcamientosxalcaldiaxtipofalla(formattedStartDate, formattedFinalDate);
      const getAllFloodingReasons = await CatalogService.getAllFloodingReasons();

      const htmlTemplate = require('../public/informesdrenaje/templates/resumenacumuladogeneralencharcamientos');

      const html = resumenacumuladogeneralencharcamientosfuncion(formattedStartDate, formattedFinalDate, today, resumenacumuladogeneralencharcamientos, htmlTemplate.html, getAllFloodingReasons, encharcamientosxalcaldiaxtipofalla, logoCDMXB64, logoCiudadInnovadoraB64);

      //path producción
      const path = _dirname + "/public/informesdrenaje/renders/resumenacumuladogeneralencharcamientos.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesdrenaje/renders/resumenacumuladogeneralencharcamientos.html"
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesdrenaje/renders/resumenacumuladogeneralencharcamientos.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `resumenacumuladogeneralencharcamientos${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },

  /*INFORMES AGUA POTABLE */
  relacionfugaspendientes: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const relacionfugaspendientes = await IncidentService.relacionpendientes(formattedStartDate, formattedFinalDate, 1);

      const htmlTemplate = require('../public/informesaguapotable/templates/relacionfugaspendientes');

      const html = relacionpendientes(formattedStartDate, formattedFinalDate, today, relacionfugaspendientes, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesaguapotable/renders/relacionfugaspendientes.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/relacionfugaspendientes.html"
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/relacionfugaspendientes.html"),
          "utf8"
        );
        /* pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informerelacionfugaspendientesB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;

          res.status(200).json({
            payload: { data: informerelacionfugaspendientesB64 },
          });
        }); */

        const file = `relacionfugaspendientes${Date.now()}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  relacionfaltasaguapendientes: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);

      const relacionfaltasaguapendientes = await IncidentService.relacionpendientes(formattedStartDate, formattedFinalDate, 2);

      const htmlTemplate = require('../public/informesaguapotable/templates/relacionfaltasaguapendientes');

      const html = relacionpendientes(formattedStartDate, formattedFinalDate, today, relacionfaltasaguapendientes, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path para producción
      const path = _dirname + "/public/informesaguapotable/renders/relacionfaltasaguapendientes.html"
      //path para desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/relacionfaltasaguapendientes.html"
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/relacionfaltasaguapendientes.html"),
          "utf8"
        );
        /* pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informerelacionfaltasaguapendientesB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;

          res.status(200).json({
            payload: { data: informerelacionfaltasaguapendientesB64 },
          });
        }); */
        const file = `relacionfaltasaguapendientes${bcrypt.hashSync(today, SALT_WORK_FACTOR)}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });
    } catch (error) {
      next(error);
    }
  },
  reportespendientesperiodo: async (req, res, next) => {
    try {

      let { startDate, finalDate, codificationType, serviceCenter, municipality } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const reportespendientesperiodo = await IncidentService.reportespendientesperiodo(formattedStartDate, formattedFinalDate, codificationType, serviceCenter, municipality);
      const htmlTemplate = require('../public/informesotros/templates/reportespendientesperiodo');

      const html = reportespendientesperiodofuncion(formattedStartDate, formattedFinalDate, today, reportespendientesperiodo, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesotros/renders/reportespendientesperiodo.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesotros/renders/reportespendientesperiodo.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesotros/renders/reportespendientesperiodo.html"),
          "utf8"
        );
        const file = `reportespendientesperiodo${Date.now()}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });


    } catch (error) {
      next(error);
    }
  },
  solicitudespipas: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const solicitudespipas = await IncidentService.solicitudespipas(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/solicitudespipas');

      const html = solicitudpipas(formattedStartDate, formattedFinalDate, today, solicitudespipas, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path produccion
      const path = _dirname + "/public/informesaguapotable/renders/solicitudespipas.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/solicitudespipas.html"
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/solicitudespipas.html"),
          "utf8"
        );
        /* pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informesolicitudespipasB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;

          res.status(200).json({
            payload: { data: informesolicitudespipasB64 },
          });
        }); */
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `solicitudespipas${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },

  analisisgeneral: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);

      const analisisgeneralaguapotable = await IncidentService.analisisgeneralaguapotable(formattedStartDate, formattedFinalDate);
      const analisisgeneraldrenaje = await IncidentService.analisisgeneral(formattedStartDate, formattedFinalDate, 2);
      const analisisgeneralaguatratada = await IncidentService.analisisgeneral(formattedStartDate, formattedFinalDate, 3);

      let dataCodifications = new Object({
        data: [{
          codification: "Agua Potable",
          data: analisisgeneralaguapotable,
        },
        {
          codification: "Drenaje",
          data: analisisgeneraldrenaje,
        },
        {
          codification: "Agua Tratada",
          data: analisisgeneralaguatratada,
        },],
      });
      const htmlTemplate = require('../public/informesaguapotable/templates/analisisgeneral');

      const html = analisisgeneralfuncion(formattedStartDate, formattedFinalDate, today, analisisgeneralaguapotable, analisisgeneraldrenaje, analisisgeneralaguatratada, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path produccion
      const path = _dirname + "/public/informesaguapotable/renders/analisisgeneral.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/analisisgeneral.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;


        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/analisisgeneral.html"),
          "utf8"
        );


        /* pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
           const informeanalisisgeneralB64 = `data:application/pdf;base64,${buffer.toString(
             "base64"
           )}`;
 
           res.status(200).json({
             payload: { data: informeanalisisgeneralB64 },
           });
         }); */
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `analisisgeneral${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });


    } catch (error) {
      next(error);
    }
  },
  fugasaguapotablediametrosalcaldias: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const fugasaguapotablediametrosalcaldias = await IncidentService.fugasaguapotablediametrosalcaldias(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/fugasaguapotablediametrosalcaldias');

      const html = fugasaguapotablediametrosalcaldiasfuncion(formattedStartDate, formattedFinalDate, today, fugasaguapotablediametrosalcaldias, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path produccion
      const path = _dirname + "/public/informesaguapotable/renders/fugasaguapotablediametrosalcaldias.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/fugasaguapotablediametrosalcaldias.html"

      fs.writeFile(path, html, function (err) {
        if (err) throw err;


        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/fugasaguapotablediametrosalcaldias.html"),
          "utf8"
        );

        /*pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informefugasaguapotablediametrosalcaldiasB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;
          res.status(200).json({
            payload: { data: informefugasaguapotablediametrosalcaldiasB64 },
          });
        });*/
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `fugasaguapotablediametrosalcaldias${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  fugasaguaspotablediametrosscmxalcaldias: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const fugasaguaspotablediametrosscmxalcaldias = await IncidentService.fugasaguaspotablediametrosscmxalcaldias(formattedStartDate, formattedFinalDate);
      const fugasaguaspotablediametrosscmxcamp = await IncidentService.fugasaguaspotablediametrosscmxcamp(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/fugasaguaspotablediametrosscmxalcaldias');

      const html = fugasaguaspotablediametrosscmxalcaldiasfuncion(formattedStartDate, formattedFinalDate, today, fugasaguaspotablediametrosscmxalcaldias, fugasaguaspotablediametrosscmxcamp, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path producción
      const path = _dirname + "/public/informesaguapotable/renders/fugasaguaspotablediametrosscmxalcaldias.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/fugasaguaspotablediametrosscmxalcaldias.html"
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/fugasaguaspotablediametrosscmxalcaldias.html"),
          "utf8"
        );

        /*pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informefugasaguaspotablediametrosscmxalcaldiasB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;
          res.status(200).json({
            payload: { data: informefugasaguaspotablediametrosscmxalcaldiasB64 },
          });
        });*/
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `fugasaguaspotablediametrosscmxalcaldias${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });

    } catch (error) {
      next(error);
    }
  },
  atencionfaltasaguapotablescmx: async (req, res, next) => {
    try {

      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const atencionfaltasaguapotablescmx = await IncidentService.atencionfaltasaguapotablescmx(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/atencionfaltasaguapotablescmx');

      const html = atencionfaltasaguapotablescmxfuncion(formattedStartDate, formattedFinalDate, today, atencionfaltasaguapotablescmx, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesaguapotable/renders/atencionfaltasaguapotablescmx.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/atencionfaltasaguapotablescmx.html"
      // writeFile function with filename, content and callback function
      /* pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
        const informeatencionfaltasaguapotablescmxB64 = `data:application/pdf;base64,${buffer.toString(
          "base64"
        )}`;
        res.status(200).json({
          payload: { data: informeatencionfaltasaguapotablescmxB64 },
        });
      }); */
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/atencionfaltasaguapotablescmx.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `atencionfaltasaguapotablescmx${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },
  reparacionesfugasaguapotablesacmex: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const reparacionesfugasaguapotablesacmex = await IncidentService.reparacionesfugasaguapotablesacmex(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/reparacionesfugasaguapotablesacmex');

      const html = reparacionesfugasaguapotablesacmexfuncion(formattedStartDate, formattedFinalDate, today, reparacionesfugasaguapotablesacmex, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path producción
      const path = _dirname + "/public/informesaguapotable/renders/reparacionesfugasaguapotablesacmex.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/reparacionesfugasaguapotablesacmex.html"

      /*  pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
         const informereparacionesfugasaguapotablesacmexB64 = `data:application/pdf;base64,${buffer.toString(
           "base64"
         )}`;
         res.status(200).json({
           payload: { data: informereparacionesfugasaguapotablesacmexB64 },
         });
       }); */
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;

        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/reparacionesfugasaguapotablesacmex.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `reparacionesfugasaguapotablesacmex${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  reparacionesfugasaguapotablescmxalcaldias: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const reparacionesfugasaguapotablescmxalcaldias = await IncidentService.reparacionesfugasaguapotablemunicipality(formattedStartDate, formattedFinalDate);
      const reparacionesfugasaguapotablecamp = await IncidentService.reparacionesfugasaguapotablecamp(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/reparacionesfugasaguapotablescmxalcaldias');

      const html = reparacionesfugasaguapotablescmxalcaldiasfuncion(formattedStartDate, formattedFinalDate, today, reparacionesfugasaguapotablescmxalcaldias, reparacionesfugasaguapotablecamp, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path producción
      const path = _dirname + "/public/informesaguapotable/renders/reparacionesfugasaguapotablescmxalcaldias.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/reparacionesfugasaguapotablescmxalcaldias.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/reparacionesfugasaguapotablescmxalcaldias.html"),
          "utf8"
        );


        /*pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informereparacionesfugasaguapotablescmxalcaldiasB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;
          res.status(200).json({
            payload: { data: informereparacionesfugasaguapotablescmxalcaldiasB64 },
          });
        });*/
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `reparacionesfugasaguapotablescmxalcaldias${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });

    } catch (error) {
      next(error);
    }
  },

  atencionfugasaguapotableanual: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      let year = new Date(Number(startDate));
      year = year.getFullYear();
      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);

      //const atencionfugasaguapotableanual = await IncidentService.atencionfugasaguapotableanual(year);
      const atencionfugasaguapotableanual = await IncidentService.atencionfugasaguapotableanual(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/atencionfugasaguapotableanual');

      const html = atencionfugasaguapotableanualfuncion(formattedStartDate, formattedFinalDate, today, atencionfugasaguapotableanual, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path producción
      const path = _dirname + "/public/informesaguapotable/renders/atencionfugasaguapotableanual.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/atencionfugasaguapotableanual.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;

        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/atencionfugasaguapotableanual.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `atencionfugasaguapotableanual${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia = await IncidentService.resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia');

      const html = resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldiafuncion(formattedStartDate, formattedFinalDate, today, resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path para producción
      const path = _dirname + "/public/informesaguapotable/renders/resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia.html"
      //path para desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia.html"


      /*   pdf.create(html, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informeresumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldiaB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;
          res.status(200).json({
            payload: { data: informeresumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldiaB64 },
          });
        }); */

      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {
          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });

    } catch (error) {
      next(error);
    }
  },
  reconstruccionpavimentacion: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationType, serviceCenter, municipality } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const reconstruccionpavimentacion = await IncidentService.reconstruccionpavimentacion(formattedStartDate, formattedFinalDate, codificationType, serviceCenter, municipality);

      const htmlTemplate = require('../public/informesaguapotable/templates/reconstruccionpavimentacion');

      const html = reconstruccionpavimentacionfuncion(formattedStartDate, formattedFinalDate, today, reconstruccionpavimentacion, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path produccion
      const path = _dirname + "/public/informesaguapotable/renders/reconstruccionpavimentacion.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/reconstruccionpavimentacion.html";
      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/reconstruccionpavimentacion.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `reconstruccionpavimentacion${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },

  /*INFORMES OTROS */
  cortesfaltasagua: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const cortesfaltasagua = await IncidentService.cortesfaltasagua(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesaguapotable/templates/cortesfaltasagua');

      const html = cortesfaltaagua(formattedStartDate, formattedFinalDate, today, cortesfaltasagua, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path produccion
      const path = _dirname + "/public/informesaguapotable/renders/cortesfaltasagua.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesaguapotable/renders/cortesfaltasagua.html"

      fs.writeFile(path, html, function (err) {
        if (err) throw err;

        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesaguapotable/renders/cortesfaltasagua.html"),
          "utf8"
        );

        /* pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const informecortesfaltasaguaB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;

          res.status(200).json({
            payload: { data: informecortesfaltasaguaB64 },
          });
        }); */
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);
        const file = `cortesfaltaagua${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          res.status(200).json({
            payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
          });
        });
      });

    } catch (error) {
      next(error);
    }
  },
  reportespendientesalcaldias: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      const todayFormatted = moment().format('YYYY-MM-DD');

      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      const reportespendientesalcaldias = await IncidentService.reportespendientesalcaldias(formattedStartDate, formattedFinalDate, todayFormatted);
      const reportespendientesacmex = await IncidentService.reportespendientesacmex(formattedStartDate, formattedFinalDate, todayFormatted);


      const htmlTemplate = require('../public/informesotros/templates/reportespendientesalcaldias');


      const html = reportespendientesalcaldiasfuncion(formattedStartDate, formattedFinalDate, today, reportespendientesalcaldias, reportespendientesacmex, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);

      //path produccion
      const path = _dirname + "/public/informesotros/renders/reportespendientesalcaldias.html"
      //path desarrollo
      //const path = __dirname + "../../public/informesotros/renders/reportespendientesalcaldias.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesotros/renders/reportespendientesalcaldias.html"),
          "utf8"
        );
        let hash = bcrypt.hashSync(today, SALT_WORK_FACTOR);

        const file = `reportespendientesalcaldias${hash}.pdf`
        pdf.create(htmlRendered, PDF_OPTS_INFORMES).toFile(filepath + '/' + file, function (err, responsePDF) {

          if (responsePDF) {
            res.status(200).json({
              payload: { data: `${process.env.TMP_PATH_PDF + '/' + file}` },
            });
          }
        });
      });

    } catch (error) {
      next(error);
    }
  },

  /********************/
  incidentsYearly: async (req, res, next) => {
    try {
      const incidentsReceivedYearly = await IncidentService.receivedYearly();

      const incidentsProcessYearly = await IncidentService.processedYearly();
      const incidentsRepairedYearly = await IncidentService.repairedYearly();

      var months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      var range_object = [];
      var range = await moment().range(
        moment(new Date()).startOf("year").format("DD-MM-YYYY"),
        moment(new Date()).format("DD-MM-YYYY")
      );

      var array = await Array.from(range.by("month", { step: 1 }));
      var day = await Array.from(range.by("day", { step: 1 }));
      array = await array.map((m) => m.format("M").valueOf());
      const p = new Promise((resolve, reject) => {
        array.forEach((value, index) => {
          range_object[value] = {
            count_date: value,
            received: 0,
            processed: 0,
            repaired: 0,
          };
        });
        resolve(range_object);
      });
      const p1 = await new Promise((resolve, reject) => {
        incidentsReceivedYearly.forEach((value, key) => {
          range_object[value.count_date]["received"] = parseInt(value.received);
        });
        resolve(range_object);
      });

      const p2 = await new Promise((resolve, reject) => {
        incidentsProcessYearly.forEach((value, key) => {
          range_object[value.count_date]["processed"] = parseInt(
            value.processed
          );
        });
        resolve(range_object);
      });
      const p3 = await new Promise((resolve, reject) => {
        incidentsRepairedYearly.forEach((value, key) => {
          range_object[value.count_date]["repaired"] = parseInt(value.repaired);
        });
        resolve(range_object);
      });
      let [dates] = await Promise.all([p3]);
      res.status(200).json({
        payload: { data: Object.values(dates), xAxis: Object.keys(dates) },
      });
    } catch (error) {
      next(error);
    }
  },

  incidents: async (req, res, next) => {
    try {
      const { initialDate, finalDate, codification } = req.query;
      const incidentsReceivedByFilters =
        await IncidentService.incidentsReceivedByFilters(
          initialDate,
          finalDate,
          codification
        );
      const incidentsProcessedByFilters =
        await IncidentService.incidentsProcessedByFilters(
          initialDate,
          finalDate,
          codification
        );
      const incidentsRepairedByFilters =
        await IncidentService.incidentsRepairedByFilters(
          initialDate,
          finalDate,
          codification
        );

      incidentsReceivedByFilters.forEach((value, index) => {
        incidentsProcessedByFilters.forEach((value1, index1) => {
          if (value1.count_date == value.count_date) {
            value.processed = value1.processed;
          }
        });
        incidentsRepairedByFilters.forEach((value2, index2) => {
          if (value2.count_date == value.count_date) {
            value.repaired = value2.repaired;
          }
        });
      });

      res.status(200).json({ payload: incidentsReceivedByFilters });
    } catch (error) {
      next(error);
    }
  },
  /**INFORME */
  incidentsCountResume: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }

      const incidentsCountDaily = await IncidentService.incidentsCountByDate(
        startDate,
        finalDate,
        codificationId,
        codificationTypeId
      );

      const dateBefore = moment(startDate)
        .subtract(1, "d")
        .format("YYYY-MM-DD");
      const incidentsCountBeforeOneDay =
        await IncidentService.incidentsCountByDate(dateBefore);

      const incidentsCountResume = {
        incidentsCountDaily: incidentsCountDaily[0].incidents,
        incidentsCountBeforeOneDay: incidentsCountBeforeOneDay[0].incidents,
        incidents_difference_between:
          incidentsCountDaily[0].incidents -
          incidentsCountBeforeOneDay[0].incidents,
      };

      res.status(200).json({ payload: incidentsCountResume });
    } catch (error) {
      next(error);
    }
  },
  incidentsCountByCodification: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const incidentsCountByCodification =
        await IncidentService.incidentsCountByCodification(
          startDate,
          finalDate
        );
      const incidentsCountByTypeCodificationPotableWater =
        await IncidentService.incidentsCountByCodificationType(
          1,
          startDate,
          finalDate
        );
      const incidentsCountByTypeCodificationDrainage =
        await IncidentService.incidentsCountByCodificationType(
          2,
          startDate,
          finalDate
        );
      const incidentsCountByTypeCodificationtreatedWater =
        await IncidentService.incidentsCountByCodificationType(
          3,
          startDate,
          finalDate
        );
      const incidentsCountByServiceCenters =
        await IncidentService.incidentsCountByTypeCodification(
          startDate,
          finalDate
        );

      let newIncidentsCountByCodification = new Object({
        data: [],
        series: [{}, {}, {}],
      });
      newIncidentsCountByCodification["data"] =
        incidentsCountByCodification.map(function (value) {
          let name = value.codification;
          let drilldown = value.codification;
          let y = parseInt(value.numberIncidents);
          let color;
          if (value.codification == "Agua Potable") {
            color = "#7AD6E0";
          }
          if (value.codification == "Drenaje") {
            color = "#FFEC98";
          }
          if (value.codification == "Agua Tratada") {
            color = "#AAD785";
          }

          return { name, y, drilldown, color };
        });

      var dataPotableWater = incidentsCountByTypeCodificationPotableWater.map(
        function (value) {
          let y = parseInt(value.Total);
          let name = value.codification_type;
          let drilldown = "Agua Potable " + value.codification_type;

          let color;
          if (value.codification_type == "Falta de agua") {
            color = "#4D979E";
          }
          if (value.codification_type == "Falta de tapa en válvula") {
            color = "#EB7EBC";
          }
          if (value.codification_type == "Fuga") {
            color = "#EBDB73";
          }
          if (value.codification_type == "Lavado y Desinfección") {
            color = "#8AE2EB";
          }
          if (value.codification_type == "Mala calidad") {
            color = "#9E9C8B";
          }
          if (value.codification_type == "Mal uso") {
            color = "#FFCCFF";
          }
          if (value.codification_type == "Otros") {
            color = "#C74A3D";
          }
          return { name, y, color, drilldown };
        }
      );

      var dataDrainage = incidentsCountByTypeCodificationDrainage.map(function (
        value
      ) {
        let y = parseInt(value.Total);
        let name = value.codification_type;
        let drilldown = "Drenaje " + value.codification_type;

        let color;
        if (value.codification_type == "Boca de tormenta") {
          color = "#88A386";
        }
        if (value.codification_type == "Brote en aguas negras") {
          color = "#EBC8B0";
        }
        if (value.codification_type == "Coladera sin tapa") {
          color = "#C0C0C0";
        }
        if (value.codification_type == "Drenaje Obstruido") {
          color = "#8275E1";
        }
        if (value.codification_type == "Encharcamiento") {
          color = "#B3EAAF";
        }
        if (value.codification_type == "Hidrocarburos") {
          color = "#BD9C71";
        }
        if (value.codification_type == "Hundimiento") {
          color = "#8783A3";
        }
        if (value.codification_type == "Otros") {
          color = "#833C0B";
        }
        if (value.codification_type == "Pozo de visita") {
          color = "#E8BBDA";
        }
        if (value.codification_type == "Reconstrucción") {
          color = "#52493C";
        }
        if (value.codification_type == "Rehabilitación") {
          color = "#EBE298";
        }
        if (value.codification_type == "Rejilla de piso") {
          color = "#78B351";
        }
        if (value.codification_type == "Socavon") {
          color = "#99CCFF";
        }
        return { name, y, color, drilldown };
      });

      var dataTreatedWater = incidentsCountByTypeCodificationtreatedWater.map(
        function (value) {
          let y = parseInt(value.Total);
          let name = value.codification_type;
          let drilldown = "Agua Tratada " + value.codification_type;

          let color;
          if (value.codification_type == "Falta de agua") {
            color = "#339966";
          }
          if (value.codification_type == "Fuga") {
            color = "#FFCCFF";
          }
          if (value.codification_type == "Solicitud") {
            color = "#CC66FF";
          }
          return { name, y, color, drilldown };
        }
      );

      newIncidentsCountByCodification["series"] = [
        {
          name: "Agua Potable",
          id: "Agua Potable",
          customName: "Tipos de codificaci&oacute;n",
          data: dataPotableWater,
        },
        {
          name: "Drenaje",
          id: "Drenaje",
          customName: "Tipos de codificaci&oacute;n",
          data: dataDrainage,
        },
        {
          name: "Agua Tratada",
          id: "Agua Tratada",
          customName: "Tipos de codificaci&oacute;n",
          data: dataTreatedWater,
        },
      ];
      newIncidentsCountByCodification["drilldowns"] = [];

      incidentsCountByServiceCenters.map(function (value, index) {
        let id = value.drilldown;
        let customName = "Campamentos";

        newIncidentsCountByCodification["drilldowns"].push({
          id,
          customName,
          data: [{ name: value.campamento, y: parseInt(value.Recibidos) }],
        });

        incidentsCountByServiceCenters.map(function (value) {
          if (id == value.drilldown && value.drilldown != null) {
            newIncidentsCountByCodification["drilldowns"][index].data.push({
              name: value.campamento,
              y: parseInt(value.Recibidos),
            });

            delete { value };
          }
        });
        delete { value };
        return { id };
      });

      var dataConcluidos = [];
      var dataPendientes = [];
      var dataInDupMalUbi = [];

      incidentsCountByServiceCenters.map(function (value) {
        if (value.campamento != null) {
          dataConcluidos.push(parseInt(value.Concluidos));
          dataPendientes.push(parseInt(value["En proceso"]));
          dataInDupMalUbi.push(parseInt(value["Rechazados, duplicados"]));
        }
      });
      newIncidentsCountByCodification["seriesFirstOption"] = [
        {
          name: "Concluidos",
          data: dataConcluidos,
        },
        {
          name: "Pendientes",
          data: dataPendientes,
        },
        {
          name: "Inexistentes, duplicados y malas ubicaciones",
          data: dataInDupMalUbi,
        },
      ];

      newIncidentsCountByCodification["categories"] = [];

      incidentsCountByServiceCenters.map(function (value, index) {
        if (value.campamento) {
          newIncidentsCountByCodification["categories"].push(value.campamento);
        }
      });
      res.status(200).json({ payload: newIncidentsCountByCodification });
    } catch (error) {
      next(error);
    }
  },
  incidentsCountByCodificationAndCodificationType: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      let groupId;
      if (codificationId == 1) {
        groupId = 1;
      } else if (codificationId == 2) {
        groupId = 7;
      } else if (codificationId == 3) {
        groupId = 2;
      }

      const incidentsCountByServiceCenters =
        await IncidentService.incidentsCountByCodificationAndCodificationType(
          startDate,
          finalDate,
          codificationId,
          groupId,
          codificationTypeId
        );

      const codification = await IncidentService.codificationName(
        codificationId,
        codificationTypeId
      );

      let newIncidentsCountByCodification = new Object({
        seriesFirstOption: [],
      });

      var dataConcluidos = [];
      var dataPendientes = [];
      var dataInDupMalUbi = [];
      newIncidentsCountByCodification["categories"] = [];
      newIncidentsCountByCodification["nameCodification"] = [codification[0]];

      incidentsCountByServiceCenters.map(function (value) {
        if (value.campamento != null) {
          newIncidentsCountByCodification["categories"].push(value.campamento);
          dataConcluidos.push(parseInt(value.Concluidos));
          dataPendientes.push(parseInt(value["En proceso"]));
          dataInDupMalUbi.push(parseInt(value["Rechazados, duplicados"]));
        }
      });
      newIncidentsCountByCodification["seriesFirstOption"] = [
        {
          name: "Concluidos",
          data: dataConcluidos,
        },
        {
          name: "Pendientes",
          data: dataPendientes,
        },
        {
          name: "Inexistentes, duplicados y malas ubicaciones",
          data: dataInDupMalUbi,
        },
      ];

      res.status(200).json({ payload: newIncidentsCountByCodification });
    } catch (error) {
      next(error);
    }
  },

  incidentsCountByCodificationMunicipalities: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }

      const incidentsCountByCodificationMunicipalities =
        await IncidentService.incidentsCountByCodificationMunicipalities(
          startDate,
          finalDate,
          codificationId,
          codificationTypeId
        );
      const incidentsCountByCodification =
        await IncidentService.incidentsCountByCodification(
          startDate,
          finalDate,
          codificationId,
          codificationTypeId
        );

      let newIncidentsCountByCodification = new Object({
        categories: [],
        series: [
          {
            name: "Agua Potable",
            data: (dataPotableWater = []),
            color: "#7AD6E0",
          },
          { name: "Drenaje", data: (dataDrainage = []), color: "#FFEC98" },
          {
            name: "Agua Tratada",
            data: (dataTreatedWater = []),
            color: "#AAD785",
          },
        ],
        total: [
          {
            name: incidentsCountByCodification[0].codification,
            data: [parseInt(incidentsCountByCodification[0].numberIncidents)],
            color: "#7AD6E0",
          },
          {
            name: incidentsCountByCodification[1].codification,
            data: [parseInt(incidentsCountByCodification[1].numberIncidents)],
            color: "#FFEC98",
          },
          {
            name: incidentsCountByCodification[2].codification,
            data: [parseInt(incidentsCountByCodification[2].numberIncidents)],
            color: "#AAD785",
          },
        ],
        municipalities: [],
      });

      incidentsCountByCodificationMunicipalities.map(function (value) {
        newIncidentsCountByCodification["categories"].push(value.acronym);
        dataPotableWater.push(parseInt(value["Agua Potable"]));
        dataDrainage.push(parseInt(value.Drenaje));
        dataTreatedWater.push(parseInt(value["Agua tratada"]));
      });
      newIncidentsCountByCodification["municipalities"] = {
        ALO: "ALVARO OBREGON",
        AZC: "AZCAPOTZALCO",
        BJZ: "BENITO JUAREZ",
        CDM: "CUAJIMALPA DE MORELOS",
        CHT: "CUAUHTEMOC",
        CYC: "COYOACAN",
        GAM: "GUSTAVO A. MADERO",
        IZC: "IZTACALCO",
        IZT: "IZTAPALAPA",
        LMC: "LA MAGDALENA CONTRERAS",
        MAT: "MILPA ALTA",
        MGO: "MIGUEL HIDALGO",
        TLH: "TLAHUAC",
        TLP: "TLALPAN",
        VCZ: "VENUSTIANO CARRANZA",
        XOC: "XOCHIMILCO",
      };

      res.status(200).json({ payload: newIncidentsCountByCodification });
    } catch (error) {
      next(error);
    }
  },
  incidentsCountByMunicipalitiesPotableWater: async (req, res, next) => {
    try {
      let { date } = req.params;
      date = date.toISOString().split("T")[0];

      const incidentsCountByMunicipalitiesPotableWater =
        await IncidentService.incidentsCountByMunicipalitiesCodificationType(
          1,
          date
        );

      var keyCategories = [
        "AZC",
        "CYC",
        "CDM",
        "GAM",
        "IZC",
        "IZT",
        "LMC",
        "MAT",
        "ALO",
        "TLH",
        "TLP",
        "XOC",
        "BJZ",
        "CHT",
        "MGO",
        "VCZ",
      ];
      var series = [];
      let newIncidentsCountByMunicipalitiesPotableWater = new Object({
        series: [],
        categories: [],
        codificationType: "Agua Potable",
      });

      newIncidentsCountByMunicipalitiesPotableWater["series"] =
        incidentsCountByMunicipalitiesPotableWater.map(function (value) {
          let name = value.codification_type;
          let color;
          if (value.codification_type == "Falta de agua") {
            color = "#4D979E";
          }
          if (value.codification_type == "Falta de tapa en válvula") {
            color = "#EB7EBC";
          }
          if (value.codification_type == "Fuga") {
            color = "#EBDB73";
          }
          if (value.codification_type == "Lavado y Desinfección") {
            color = "#8AE2EB";
          }
          if (value.codification_type == "Mala calidad") {
            color = "#9E9C8B";
          }
          if (value.codification_type == "Mal uso") {
            color = "#FFCCFF";
          }
          if (value.codification_type == "Otros") {
            color = "#C74A3D";
          }
          delete value["codification_type"];
          data = Object.values(value).map(function (x) {
            return parseInt(x);
          });

          return { name, data, color };
        });
      newIncidentsCountByMunicipalitiesPotableWater["categories"] =
        keyCategories;
      res
        .status(200)
        .json({ payload: newIncidentsCountByMunicipalitiesPotableWater });
    } catch (error) {
      next(error);
    }
  },
  incidentsCountByMunicipalitiesDrainage: async (req, res, next) => {
    try {
      let { date } = req.params;
      date = date.toISOString().split("T")[0];

      const incidentsCountByMunicipalitiesDrainage =
        await IncidentService.incidentsCountByMunicipalitiesCodificationType(
          2,
          date
        );

      var keyCategories = [
        "AZC",
        "CYC",
        "CDM",
        "GAM",
        "IZC",
        "IZT",
        "LMC",
        "MAT",
        "ALO",
        "TLH",
        "TLP",
        "XOC",
        "BJZ",
        "CHT",
        "MGO",
        "VCZ",
      ];
      var series = [];
      let newIncidentsCountByMunicipalitiesDrainage = new Object({
        series: [],
        categories: [],
        codificationType: "Drenaje",
      });

      newIncidentsCountByMunicipalitiesDrainage["series"] =
        incidentsCountByMunicipalitiesDrainage.map(function (value) {
          let name = value.codification_type;
          let color;
          if (value.codification_type == "Boca de tormenta") {
            color = "#88A386";
          }
          if (value.codification_type == "Brote en aguas negras") {
            color = "#EBC8B0";
          }
          if (value.codification_type == "Coladera sin tapa") {
            color = "#C0C0C0";
          }
          if (value.codification_type == "Drenaje Obstruido") {
            color = "#8275E1";
          }
          if (value.codification_type == "Encharcamiento") {
            color = "#B3EAAF";
          }
          if (value.codification_type == "Hidrocarburos") {
            color = "#BD9C71";
          }
          if (value.codification_type == "Hundimiento") {
            color = "#8783A3";
          }
          if (value.codification_type == "Otros") {
            color = "#833C0B";
          }
          if (value.codification_type == "Pozo de visita") {
            color = "#E8BBDA";
          }
          if (value.codification_type == "Reconstrucción") {
            color = "#52493C";
          }
          if (value.codification_type == "Rehabilitación") {
            color = "#EBE298";
          }
          if (value.codification_type == "Rejilla de piso") {
            color = "#78B351";
          }
          if (value.codification_type == "Socavon") {
            color = "#99CCFF";
          }

          delete value["codification_type"];
          data = Object.values(value).map(function (x) {
            return parseInt(x);
          });
          return { name, data, color };
        });
      newIncidentsCountByMunicipalitiesDrainage["categories"] = keyCategories;
      res
        .status(200)
        .json({ payload: newIncidentsCountByMunicipalitiesDrainage });
    } catch (error) {
      next(error);
    }
  },
  incidentsCountByMunicipalitiesTreatedWater: async (req, res, next) => {
    try {
      let { date } = req.params;
      date = date.toISOString().split("T")[0];

      const incidentsCountByMunicipalitiesTreatedWater =
        await IncidentService.incidentsCountByMunicipalitiesCodificationType(
          3,
          date
        );

      var keyCategories = [
        "AZC",
        "CYC",
        "CDM",
        "GAM",
        "IZC",
        "IZT",
        "LMC",
        "MAT",
        "ALO",
        "TLH",
        "TLP",
        "XOC",
        "BJZ",
        "CHT",
        "MGO",
        "VCZ",
      ];
      var series = [];
      let newIncidentsCountByMunicipalitiesTreatedWater = new Object({
        series: [],
        categories: [],
        codificationType: "Agua Tratada",
      });

      newIncidentsCountByMunicipalitiesTreatedWater["series"] =
        incidentsCountByMunicipalitiesTreatedWater.map(function (value) {
          let name = value.codification_type;
          let color;
          if (value.codification_type == "Falta de agua") {
            color = "#339966";
          }
          if (value.codification_type == "Fuga") {
            color = "#FFCCFF";
          }
          if (value.codification_type == "Solicitud") {
            color = "#CC66FF";
          }
          delete value["codification_type"];
          data = Object.values(value).map(function (x) {
            return parseInt(x);
          });

          return { name, data, color };
        });
      newIncidentsCountByMunicipalitiesTreatedWater["categories"] =
        keyCategories;

      res
        .status(200)
        .json({ payload: newIncidentsCountByMunicipalitiesTreatedWater });
    } catch (error) {
      next(error);
    }
  },
  incidentsCodificationTopSettlement: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      if (codificationId != "null" || codificationTypeId != "null") {
        const incidentsCodificationTop =
          await IncidentService.incidentsCodificationTopSettlementByCodification(
            startDate,
            finalDate,
            codificationId,
            codificationTypeId
          );

        res.status(200).json({ payload: incidentsCodificationTop });
      } else {
        const incidentsCodificationTop =
          await IncidentService.incidentsCodificationTopSettlement(
            startDate,
            finalDate,
            codificationId,
            codificationTypeId
          );

        res.status(200).json({ payload: incidentsCodificationTop });
      }
    } catch (error) {
      next(error);
    }
  },
  incidentsCodificationTopMunicipality: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      if (codificationId != "null" && codificationTypeId != "null") {
        const incidentsCodificationTop =
          await IncidentService.incidentsCodificationTopMunicipalityByCodification(
            startDate,
            finalDate,
            codificationId,
            codificationTypeId
          );

        res.status(200).json({ payload: incidentsCodificationTop });
      } else {
        const incidentsCodificationTop =
          await IncidentService.incidentsCodificationTopMunicipality(
            startDate,
            finalDate,
            codificationId,
            codificationTypeId
          );

        res.status(200).json({ payload: incidentsCodificationTop });
      }
    } catch (error) {
      next(error);
    }
  },
  incidentsRecurrence: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId, codificationTypeId } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const codifications = await CatalogService.getAllCodification();
      var codificationsFormatted = new Object();
      const codificationTypes = await CatalogService.getCodificationTypes();

      const incidentsRecurrence = await IncidentService.incidentsRecurrence(
        startDate,
        finalDate,
        codificationId,
        codificationTypeId
      );

      var settlements_object = {};
      const settlements = [];

      incidentsRecurrence.map((value, index) => {
        settlements.push({
          settlement: value.settlement,
          municipality: value.municipalityname,
          codification: value.codification,
          codification_type: value.codification_type,
        });
      });

      const range = await moment().range(moment(startDate), moment(finalDate));

      var array = await Array.from(range.by("day", { step: 1 }));
      array = await array.map((m) => m.format("DD-MM-YYYY").valueOf());

      const p = new Promise((resolve, reject) => {
        settlements.map((value, index) => {
          if (!settlements_object[value.codification]) {
            settlements_object[value.codification] = new Object();
          }
          if (
            !settlements_object[value.codification][value.codification_type]
          ) {
            settlements_object[value.codification][value.codification_type] =
              new Object();
          }
          if (
            !settlements_object[value.codification][value.codification_type][
            value.settlement
            ]
          ) {
            settlements_object[value.codification][value.codification_type][
              value.settlement
            ] = new Object();
          }
          array.map((value1, index) => {
            settlements_object[value.codification][value.codification_type][
              value.settlement
            ][value1] = new Object({
              date: value1,
              settlement: value.settlement,
              municipality: value.municipality,
              countIncidents: 0,
            });
          });
        });
        resolve(settlements_object);
      });

      const p1 = await new Promise(async (resolve, reject) => {
        let settlementActive = null,
          codification,
          codification_type,
          settlement,
          dayCount,
          dayCountBefore,
          daysCountTotal,
          incidentsTotal,
          incidentsComplaintsTotal,
          priorityLevel;
        await incidentsRecurrence.forEach((value, key) => {
          settlementActive = `${value.codification} ${value.codification_type} ${value.settlement}`;
          codification = value.codification;
          codification_type = value.codification_type;
          settlement = value.settlement;
          dayCount = 0;
          dayCountBefore = 0;
          daysCountTotal = 0;
          incidentsTotal = 0;
          incidentsComplaintsTotal = 1;

          incidentsRecurrence.forEach((value1, key) => {
            if (
              settlementActive ==
              `${value1.codification} ${value1.codification_type} ${value1.settlement}`
            ) {
              settlements_object[codification][codification_type][settlement][
                "countDaysTotal"
              ] = daysCountTotal;
              settlements_object[codification][codification_type][settlement][
                "incidentsTotal"
              ] = incidentsTotal;
              settlements_object[codification][codification_type][settlement][
                "incidentsComplaintsTotal"
              ] = incidentsComplaintsTotal;
              settlementActive = `${value1.codification} ${value1.codification_type} ${value1.settlement}`;
              codification = value1.codification;
              codification_type = value1.codification_type;
              settlement = value1.settlement;
              dayCount = 0;
              dayCountBefore = 0;
              daysCountTotal = 0;
              incidentsTotal += parseInt(value1.count);
              incidentsComplaintsTotal++;
            }
          });
          settlements_object[value.codification][value.codification_type][
            value.settlement
          ][value.date]["countIncidents"] = parseInt(value.count);
          /* settlements_object[codification][codification_type][settlement][
            "countDaysTotal"
          ] = daysCountTotal; */
          settlements_object[codification][codification_type][settlement][
            "countDaysTotal"
          ] = Math.floor(Math.random() * (7 - 1)) + 1;
          settlements_object[codification][codification_type][settlement][
            "incidentsTotal"
          ] = incidentsTotal;
          //Elimina los registros que solo ocurrieron una vez en la semana
          if (
            settlements_object[codification][codification_type][settlement][
            "incidentsComplaintsTotal"
            ] == 1
          ) {
            delete settlements_object[codification][codification_type][
              settlement
            ];
          }
        });
        resolve(settlements_object);
      });

      const p2 = await new Promise(async (resolve, reject) => {
        let daysCountTotal,
          dayCount = 0,
          dayCountBefore = 0;
        await Object.entries(settlements_object)
          .flat()
          .forEach((codification, index) => {
            if (index % 2 === 0) {
            } else {
              Object.entries(codification).forEach((codification_type) => {
                Object.entries(codification_type[1]).forEach(
                  (settlement_incidents) => {
                    const incidents = Object.values(settlement_incidents[1]);

                    /*    settlementsFiltered = settlements.filter((settlement) => {
                         return settlement.countIncidents != 0;
                       }); */

                    /* for (let i = 0; i < 7; i++) {
                      
                      if (
                        incidents[i].countIncidents != 0 &&
                        incidents[i + 1].countIncidents != 0
                      ) {
                        dayCountBefore++;
                      }
                      if (incidents[i].countIncidents === 0) {
                      }
                    } */
                  }
                );
              });
            }
          });

        resolve(settlements_object);
      });

      let [incidents] = await Promise.all([p1]);

      res.status(200).json({
        payload: Object.entries(incidents),
        date: Object.values(array),
      });
    } catch (error) {
      next(error);
    }
  },
  getGeojsonByCodificationTypeBetweenDates: async (req, res, next) => {
    try {
      let { codificationId, codificationTypeId, startDate, endDate } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (endDate != 'null') {
        endDate = endDate.toISOString().split("T")[0];
      }
      const incidentsCoordinatesData =
        await IncidentService.incidentsCoordinatesData(
          codificationId,
          codificationTypeId,
          startDate,
          endDate
        );
      let geojson = GeoJSON.parse(incidentsCoordinatesData, {
        Point: ["latitude", "longitude"],
      });

      res.status(200).json(geojson);
    } catch (error) {
      next(error);
    }
  },

  getCodificationTypeSeries: async (req, res, next) => {
    try {
      let { codificationId, codificationTypeId, startDate, endDate } =
        req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (endDate != 'null') {
        endDate = endDate.toISOString().split("T")[0];
      }
      const incidentsByCodificationsWithCodificationTypes =
        await IncidentService.incidentsByCodificationWithCodificationTypes(
          codificationId,
          codificationTypeId,
          startDate,
          endDate
        );

      var codificationTypes = await CatalogService.getCodificationTypes(
        codificationId
      );

      if (codificationTypeId != "all" && parseInt(codificationTypeId)) {
        codificationTypes = codificationTypes.filter((value) => {
          return value.id == codificationTypeId;
        });
      }

      series = codificationTypes.map(
        (codificationType, keyCodificationType) => {
          const { codification_type } = codificationType;
          let incidentSeries = incidentsByCodificationsWithCodificationTypes
            .filter((incidentsCodification, key) => {
              return (
                incidentsCodification.codification_type_id ==
                codificationType.id
              );
            })
            .map((incidentFiltered, keyIncident) => {
              return {
                date: new Date(incidentFiltered.date).getTime(),
                value: incidentFiltered.incidents_count,
              };
            });

          return { [codification_type]: incidentSeries };
        }
      );

      res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  },
  incidentsVitherGetAllByDate: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const incidentsInformation =
        await IncidentService.incidentsVitherGetAllByDate(startDate, finalDate);

      res.status(200).json({ payload: incidentsInformation });
    } catch (error) {
      next(error);
    }
  },
  getHidroanalisisFeatureCollectionByCodificationTypeBetweenDates: async (req, res, next) => {
    try {
      const { codificationId, codificationTypeId, statusId, startDate, endDate } =
        req.params;

      const incidentsTerritorialCoordinatesData =
        await IncidentService.incidentsTerritorialHidroanalisisFeaturesData(codificationTypeId, statusId, startDate, endDate);

      var incidentsInconcertCoordinatesData = []
      if (codificationTypeId != undefined && codificationTypeId != '' && (codificationTypeId == 2 || codificationTypeId == 1 || codificationTypeId == 9)) {
        incidentsInconcertCoordinatesData = await IncidentService.incidentsInconcertHidroanalisisFeaturesData(codificationTypeId, statusId, startDate, endDate);
      }


      const mergedObject = [
        ...incidentsTerritorialCoordinatesData,
        ...incidentsInconcertCoordinatesData
      ];

      let geojson = await GeoJSON.parse(mergedObject, { Point: ['latitude', 'longitude'] });


      geojson.features.forEach(obj => {
        obj["attributes"] = obj["properties"];
        obj["geometry"]["longitude"] = obj["geometry"]["coordinates"][0];
        obj["geometry"]["latitude"] = obj["geometry"]["coordinates"][1];
        obj["geometry"]["type"] = "point";
        obj["id"] = obj["attributes"]["name_layer"] + '_' + (Math.random() + 1).toString(36).substring(2);
        delete obj["properties"];
        delete obj["geometry"]["coordinates"];
      });

      res.status(200).json(geojson);
    } catch (error) {
      next(error);
    }
  },
  datosabiertos: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const incidentsInformation =
        await IncidentService.incidentsDatosAbiertosGetAllByDate(startDate, finalDate);

      res.status(200).json({ payload: incidentsInformation });
    } catch (error) {
      next(error);
    }
  },
  datosabiertosincidentsinconcert: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const incidentsInformation =
        await IncidentService.incidentsInconcertDatosAbiertosGetAllByDate(startDate, finalDate);

      res.status(200).json({ payload: incidentsInformation });
    } catch (error) {
      next(error);
    }
  },
  getIncidentsByCodificationTypeBetweenDates: async (req, res, next) => {
    try {
      let { startDate, finalDate ,codificationId,codificationTypeId} = req.params;
      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }
      const getIncidentsByCodificationTypeBetweenDates =
        await IncidentService.getIncidentsByCodificationTypeBetweenDates(startDate, finalDate,codificationId,codificationTypeId);

      res.status(200).json({ payload: getIncidentsByCodificationTypeBetweenDates });
    } catch (error) {
      next(error);
    }
  },
};
