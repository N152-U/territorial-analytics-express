const express = require('express');
const { UserValidator } = require('../validators/index.js');
const { UserController } = require('../controllers/index.js');
const { verifyToken, roleHasPermissions } = require('../middleware/index.js');
const router = express.Router();


router.get('/user/:username/permissions', verifyToken, roleHasPermissions('READ.PERMISSION'), UserController.getAllPermissionsByUsername);
router.post('/user/signup', verifyToken, UserValidator.signup, roleHasPermissions('CREATE.USER'), UserController.signup);
router.post('/user/login', UserValidator.login, UserController.login);
router.get('/user/getAll', verifyToken, roleHasPermissions('READ.USER'), UserController.getAll);
router.get('/user/getById/:hash', verifyToken, roleHasPermissions('READ.USER'), UserController.getById);
router.put('/user/update/:hashUser', verifyToken, UserValidator.update, roleHasPermissions('UPDATE.USER'), UserController.update);
router.put('/user/updatePassword/:hashUser', verifyToken, roleHasPermissions('READ.PERMISSION'), UserController.updatePassword);
router.delete('/user/delete/:hash', verifyToken, roleHasPermissions('DELETE.USER'), UserController.deleteOne);
router.get('/user/getDetail', verifyToken, roleHasPermissions('READ.PERMISSION'), UserController.getDetail);
router.get('/user/getById/:hash/detail', verifyToken, roleHasPermissions('READ.PERMISSION'), UserController.getByIdDetail);
router.get("/user/getTotalCount", verifyToken, UserController.getTotalCount);


module.exports = router;