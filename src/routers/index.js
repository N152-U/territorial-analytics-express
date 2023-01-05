const express = require('express');
const AuthRouter = require('./AuthRouter.js');
const RoleRouter = require('./RoleRouter.js');
const PermissionRouter = require('./PermissionRouter.js');
const IncidentRouter = require('./IncidentRouter');
const CatalogRouter = require('./CatalogRouter');
const ReportRouter = require('./ReportRouter.js');

const router = express.Router();

router.use(AuthRouter);
router.use(RoleRouter);
router.use(PermissionRouter);
router.use(IncidentRouter);
router.use(CatalogRouter);
router.use(ReportRouter);

module.exports = router;
