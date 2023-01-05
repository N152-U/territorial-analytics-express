/**
 * Incident Routers
 * @module src/routers/IncidentRouter
 * @name IncidentRouter
 * @author Andrea Naraly Solis Martinez
 * @requires express
 * @requires module:IncidentRouter
 */

const express = require('express');
const cors = require('cors');

const whitelist = process.env.WHITELIST;
const whitelistIp = process.env.WHITELISTIP;

const corsOptionsDelegate = function (req, callback) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //console.log("IP request", ip)
    let corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1 || whitelistIp.indexOf(ip) !== -1) {
        corsOptions = true // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = false  // disable CORS for this request
    }
   
  
    if (corsOptions == true) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }

}

const { IncidentValidator } = require('../validators/index.js');
const { IncidentController } = require('../controllers/index.js');
const { verifyToken, roleHasPermissions } = require('../middleware/index.js');
const router = express.Router();

/**INFORME */
/**INCEDENTES DEL DIA */
router.get('/incidents/resume/:startDate/:finalDate/codification/:codificationId/codificationType/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.datesCodifications, IncidentController.incidentsCountResume);
router.get('/incidents/codifications/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.dates, IncidentController.incidentsCountByCodification);
router.get('/incidents/codifications/:startDate/:finalDate/codification/:codificationId/codificationtype/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.datesCodifications, IncidentController.incidentsCountByCodificationAndCodificationType);
router.get('/incidents/codifications/municipalities/:startDate/:finalDate/codification/:codificationId/codificationType/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.datesCodifications, IncidentController.incidentsCountByCodificationMunicipalities);
router.get('/incidents/potableWater/municipalities/:date', cors(corsOptionsDelegate), IncidentValidator.date, IncidentController.incidentsCountByMunicipalitiesPotableWater);
router.get('/incidents/drainage/municipalities/:date', cors(corsOptionsDelegate), IncidentValidator.date, IncidentController.incidentsCountByMunicipalitiesDrainage);
router.get('/incidents/treatedWater/municipalities/:date', cors(corsOptionsDelegate), IncidentValidator.date, IncidentController.incidentsCountByMunicipalitiesTreatedWater);
router.get('/incidents/codification/top/settlements', cors(corsOptionsDelegate), IncidentController.incidentsCodificationTopSettlement);
router.get('/incidents/codification/top/municipalities', cors(corsOptionsDelegate), IncidentController.incidentsCodificationTopMunicipality);
router.get('/incidents/codification/:codificationId/codificationtype/:codificationTypeId/geojson/:startDate/:endDate', cors(corsOptionsDelegate), IncidentValidator.geojson, IncidentController.getGeojsonByCodificationTypeBetweenDates);
router.get('/incidents/codification/:codificationId/codificationtype/:codificationTypeId/series/:startDate/:endDate', cors(corsOptionsDelegate), IncidentValidator.series, IncidentController.getCodificationTypeSeries);
router.get('/incidents/codification/top/settlements/:startDate/:finalDate/:codificationId/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.datesCodifications, IncidentController.incidentsCodificationTopSettlement);
router.get('/incidents/codification/top/municipalities/:startDate/:finalDate/:codificationId/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.datesCodifications, IncidentController.incidentsCodificationTopMunicipality);
router.get('/incidents/recurrence/:startDate/:finalDate/codification/:codificationId/codificationType/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.recurrence, IncidentController.incidentsRecurrence);
router.post('/incidents/informe/semanal/pdf/:startDate/:finalDate/codification/:codificationId/codificationType/:codificationTypeId', cors(corsOptionsDelegate), IncidentValidator.informeSemanalPDF, IncidentController.informeSemanalPDF);
router.get('/vither/incidents/getAllByDate/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.vither, IncidentController.incidentsVitherGetAllByDate);
router.get('/incidents/codificationtype/:codificationTypeId/status/:statusId/featurecollection/:startDate/:endDate',  cors(corsOptionsDelegate), IncidentController.getHidroanalisisFeatureCollectionByCodificationTypeBetweenDates );

/*INFORMES DRENAJE */
router.get('/incidents/informe/diarioencharcamientos/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.diarioencharcamientos, IncidentController.diarioencharcamientos);
router.get('/incidents/informe/diarioencharcamientosvialidadprimaria/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.diarioencharcamientosvialidadprimaria, IncidentController.diarioencharcamientosvialidadprimaria);
router.get('/incidents/informe/diarioencharcamientosvialidadsecundaria/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.diarioencharcamientosvialidadsecundaria, IncidentController.diarioencharcamientosvialidadsecundaria);

router.get('/incidents/informe/reportesdrenaje/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.reportesdrenaje,IncidentController.reportesdrenaje);
router.get('/incidents/informe/encharcamientosxalcaldia/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.encharcamientosxalcaldia,IncidentController.encharcamientosxalcaldia);
router.get('/incidents/informe/encharcamientosxalcaldiaxtipofalla/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.encharcamientosxalcaldiaxtipofalla,IncidentController.encharcamientosxalcaldiaxtipofalla);
router.get('/incidents/informe/resumenacumuladogeneralencharcamientos/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.resumenacumuladogeneralencharcamientos,IncidentController.resumenacumuladogeneralencharcamientos);
router.get('/incidents/informe/prediosafectados/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.prediosafectados,IncidentController.prediosafectados);
router.get('/incidents/informe/sustitucionaccesorioshidraulicos/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.sustitucionaccesorioshidraulicos,IncidentController.sustitucionaccesorioshidraulicos);

/*INFORMES AGUA POTABLE */
router.get('/incidents/informe/relacionfaltasaguapendientes/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.relacionfaltasaguapendientes, IncidentController.relacionfaltasaguapendientes);
router.get('/incidents/informe/relacionfugaspendientes/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.relacionfugaspendientes, IncidentController.relacionfugaspendientes);
router.get('/incidents/informe/solicitudespipas/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.solicitudespipas, IncidentController.solicitudespipas);
router.get('/incidents/informe/cortesfaltasagua/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.cortesfaltasagua, IncidentController.cortesfaltasagua);

router.get('/incidents/informe/analisisgeneral/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.analisisgeneral, IncidentController.analisisgeneral);
router.get('/incidents/informe/fugasaguapotablediametrosalcaldias/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.fugasaguapotablediametrosalcaldias, IncidentController.fugasaguapotablediametrosalcaldias);
router.get('/incidents/informe/fugasaguaspotablediametrosscmxalcaldias/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.fugasaguaspotablediametrosscmxalcaldias, IncidentController.fugasaguaspotablediametrosscmxalcaldias);
router.get('/incidents/informe/atencionfaltasaguapotablescmx/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.atencionfaltasaguapotablescmx, IncidentController.atencionfaltasaguapotablescmx);
router.get('/incidents/informe/reparacionesfugasaguapotablesacmex/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.reparacionesfugasaguapotablesacmex, IncidentController.reparacionesfugasaguapotablesacmex);
router.get('/incidents/informe/reparacionesfugasaguapotablescmxalcaldias/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.reparacionesfugasaguapotablescmxalcaldias, IncidentController.reparacionesfugasaguapotablescmxalcaldias);
router.get('/incidents/informe/atencionfugasaguapotableanual/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.atencionfugasaguapotableanual, IncidentController.atencionfugasaguapotableanual);
router.get('/incidents/informe/resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia, IncidentController.resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia);
router.get('/incidents/informe/reconstruccionpavimentacion/pdf/:startDate/:finalDate/codificationType/:codificationType/serviceCenter/:serviceCenter/municipality/:municipality', cors(corsOptionsDelegate), IncidentValidator.reconstruccionpavimentacion, IncidentController.reconstruccionpavimentacion);

/*INFORMES OTROS */

router.get('/incidents/informe/reportespendientesperiodo/pdf/:startDate/:finalDate/codificationType/:codificationType/serviceCenter/:serviceCenter/municipality/:municipality', cors(corsOptionsDelegate), IncidentValidator.reportespendientesperiodo, IncidentController.reportespendientesperiodo);
router.get('/incidents/informe/reportespendientesalcaldias/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.reportespendientesalcaldias, IncidentController.reportespendientesalcaldias);
router.get('/incidents/informe/cortesfaltasagua/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.cortesfaltasagua, IncidentController.cortesfaltasagua);

/*Ruta para datos abiertos */
router.get('/datosabiertos/incidents/getAllByDate/startDate/:startDate/finalDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.datosabiertos, IncidentController.datosabiertos);
router.get('/datosabiertos/incidentsInconcert/getAllByDate/startDate/:startDate/finalDate/:finalDate', cors(corsOptionsDelegate), IncidentValidator.datosabiertosincidentsinconcert, IncidentController.datosabiertosincidentsinconcert);

router.get('/incidents/codification/:codificationId/codificationtype/:codificationTypeId/startDate/:startDate/finalDate/:finalDate',cors(corsOptionsDelegate), IncidentValidator.getIncidentsByCodificationTypeBetweenDates, IncidentController.getIncidentsByCodificationTypeBetweenDates);
module.exports = router;
