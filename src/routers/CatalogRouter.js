const express = require('express');
const cors = require('cors');

const { CatalogController } = require('../controllers/index.js');
const { verifyToken, roleHasPermissions } = require('../middleware/index.js');
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

router.get('/catalog/codifications', cors(corsOptionsDelegate), CatalogController.getAllCodification);
router.get('/catalog/codifications/type/:id', cors(corsOptionsDelegate), CatalogController.getCodificationTypes);
router.get('/catalog/codifications/codificationtypes', cors(corsOptionsDelegate), CatalogController.codificationsWithCodificationTypes);
router.get('/catalog/receipts', cors(corsOptionsDelegate), CatalogController.getAllReceipts);
//router.get('/catalog/intensities', CatalogController.getAllIntensities);
//router.get('/catalog/priorities', CatalogController.getAllPriorities);
//router.get('/catalog/statuses', CatalogController.getAllStatuses);
router.get('/catalog/serviceCenters', cors(corsOptionsDelegate), CatalogController.getAllServiceCenters);


module.exports = router;