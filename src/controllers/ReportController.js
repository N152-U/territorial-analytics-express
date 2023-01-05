const { ReportService } = require("../services/index.js");
const { IncidentService } = require("../services/index.js");
const auth = require("../utils/auth.js");
const jwt = require("jsonwebtoken");
const APIError = require("../utils/error.js");
const pdf = require("html-pdf");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { logoCDMXB64 } = require("../public/img/logos/logoCDMX");
const {
  logoCiudadInnovadoraB64,
} = require("../public/img/logos/logoCiudadInnovadora");
const { epochDateTimeParser } = require("../utils/helpers.js");

const _dirname = process.env._dirname + '/'
//desarrollo
const filepath=__dirname+'../..'+process.env.TMP_PATH_PDF;
//produccion
//const filepath = _dirname + process.env.TMP_PATH_PDF + '/';

const { relaciondereportescapturadosderedessocialesfuncion } = require("../public/informesotros/js/relaciondereportescapturadosderedessocialesfuncion");

let height = 794, width = 1122;
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

const Moment = require("moment"),

  MomentRange = require("moment-range"),
  moment = MomentRange.extendMoment(Moment);
moment.suppressDeprecationWarnings = true;
module.exports = {
  /**INFORME */
  reportsCountDaily: async (req, res, next) => {
    try {
      let { date } = req.params;
      date = date.toISOString().split("T")[0];
      const reportsCountDaily = await ReportService.reportsCountDaily(date);
      const reportsCountBeforeOneDay = await ReportService.reportsCountBeforeOneDay(date);
      const reportsCountResume = {
        reportsCountDaily: reportsCountDaily[0].daily_reports,
        reportsCountBeforeOneDay: reportsCountBeforeOneDay[0].before_one_day_reports,
        reports_difference_between: reportsCountDaily[0].daily_reports - reportsCountBeforeOneDay[0].before_one_day_reports
      }

      res.status(200).json({ payload: reportsCountResume });
    } catch (error) {
      next(error);
    }
  },
  reportsCountByReceipts: async (req, res, next) => {
    try {
      let { startDate, finalDate, codificationId } = req.params;
      if (startDate != 'null') {
        startDate = startDate.toISOString().split("T")[0];
      }
      if (finalDate != 'null') {
        finalDate = finalDate.toISOString().split("T")[0];
      }

      if (codificationId != 'null') {
        const reportsCountByReceipts = await IncidentService.incidentsCountByCodificationReceipt(startDate, finalDate, codificationId);

        let newReportsCountByReceipts = new Object({ "data": [] });


        newreportsCountByReceiptsData = [];
        reportsCountByReceipts.map(function (value) {
          if (value.campamento != null) {
            newreportsCountByReceiptsData.push(value);
          }
        });

        newReportsCountByReceipts["data"] = newreportsCountByReceiptsData.map(function (value) {

          let name = value.campamento;

          y = parseInt(value.y);

          return { name, y }

        });
        res.status(200).json({ payload: newReportsCountByReceipts });
      } else {
        const reportsCountByReceipts = await ReportService.reportsCountByReceipts(startDate, finalDate);
        const reportsTotalCountByReceipts = await ReportService.reportsTotalCountByReceipts(startDate, finalDate);
        let newReportsCountByReceipts = new Object({ "data": [] });
        newReportsCountByReceipts["total"] = parseInt(reportsTotalCountByReceipts[0].count_incidents);
        newReportsCountByReceipts["data"] = reportsCountByReceipts.map(function (value) {
          let name = value.receipt;
          delete value['receipt'];
          y = parseInt(value.count_reports);

          return { name, y }
        });
        res.status(200).json({ payload: newReportsCountByReceipts });
      }


    } catch (error) {
      next(error);
    }
  },
  relaciondereportescapturadosderedessociales: async (req, res, next) => {
    try {
      let { startDate, finalDate } = req.params;

      const today = moment().format('YYYY-MM-DD HH:mm:ss');
      let { formattedStartDate, formattedFinalDate } = epochDateTimeParser(startDate, finalDate);
      formattedFinalDate
      const relaciondereportescapturadosderedessociales = await ReportService.relaciondereportescapturadosderedessociales(formattedStartDate, formattedFinalDate);

      const htmlTemplate = require('../public/informesotros/templates/relaciondereportescapturadosderedessociales');

      const html = relaciondereportescapturadosderedessocialesfuncion(formattedStartDate, formattedFinalDate, today, relaciondereportescapturadosderedessociales, htmlTemplate.html, logoCDMXB64, logoCiudadInnovadoraB64);
      //path para producción
      const path = _dirname + "/public/informesotros/renders/relaciondereportescapturadosderedessociales.html"
      //path para desarrollo
      //const path = __dirname + "../../public/informesotros/renders/relaciondereportescapturadosderedessociales.html"

      // writeFile function with filename, content and callback function
      fs.writeFile(path, html, function (err) {
        if (err) throw err;
        const htmlRendered = fs.readFileSync(
          require.resolve("../public/informesotros/renders/relaciondereportescapturadosderedessociales.html"),
          "utf8"
        );
        /* pdf.create(htmlRendered, PDF_OPTS_INFORMES).toBuffer(function (err, buffer) {
          const relaciondereportescapturadosderedessocialesB64 = `data:application/pdf;base64,${buffer.toString(
            "base64"
          )}`;

          res.status(200).json({
            payload: { data: relaciondereportescapturadosderedessocialesB64 },
          });
        }); */
        const file = `relaciondereportescapturadosderedessociales${uuidv4()}.pdf`
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
};
