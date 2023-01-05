const express = require('express');
const { PermissionValidator } = require('../validators/index.js');
const { PermissionController } = require('../controllers/index.js');
const { verifyToken } = require('../middleware/index.js');

const router = express.Router();

router.post('/permission/getAllByStatus/:status',verifyToken, PermissionController.getAllByStatus);
router.get('/permission/getAll',verifyToken,PermissionController.getAll);
router.get('/permission/getByRoleId/:hash',verifyToken,PermissionController.getAllByRoleID);

module.exports = router;