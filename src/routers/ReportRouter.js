const express = require('express');
const cors = require('cors');

const { ReportController } = require('../controllers/index.js');
const {ReportValidator} = require('../validators/index.js');
const router = express.Router();

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

/**INFORME */
/**REPORTES DEL DÍA */
router.get('/reports/resume/:date', ReportValidator.resume,ReportController.reportsCountDaily);
router.get('/reports/receipts/:startDate/:finalDate/:codificationId',ReportValidator.receipts, ReportController.reportsCountByReceipts);
router.get('/reports/informe/relaciondereportescapturadosderedessociales/pdf/:startDate/:finalDate', cors(corsOptionsDelegate), ReportValidator.relaciondereportescapturadosderedessociales, ReportController.relaciondereportescapturadosderedessociales);



module.exports = router;