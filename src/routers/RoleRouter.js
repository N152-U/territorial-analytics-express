/**
 * Role Routers
 * @module src/routers/RoleRouter
 * @name RoleRouter
 * @author Andrea Naraly Solis Martinez
 * @requires express
 * @requires module:RoleController
 */

const express = require('express');
const { RoleValidator } = require('../validators/index.js');
const { RoleController } = require('../controllers/index.js');
const { verifyToken, roleHasPermissions } = require('../middleware/index.js');

const router = express.Router();

/**
 * ROUTER
 * Create Role with permissions
 * @name CreateRole
 * @path {POST} /role/create
 * @code {201} Role has been created.
 * @body {module:Role.Role} Role RoleObject.
 * @response {module:Role.Role} Role RoleObject.
 * @chain {@link module:MiddlewareIndex.VerifyToken}
 */
router.post('/role/create', verifyToken, roleHasPermissions("CREATE.ROLE"), RoleController.create);

/**
 * ROUTER
 * Get All Roles.
 * @name GetAllRoles
 * @path {GET} /role/getAll
 * @code {200} All roles have been brought.
 * @response {module:Role.Role[]} Role Array of RoleObject.
 * @chain {@link module:MiddlewareIndex.VerifyToken}
 */
router.get('/role/getAll', verifyToken, roleHasPermissions("READ.ROLE"), RoleController.getAll);
router.get('/role/getAllTable', verifyToken, roleHasPermissions("READ.ROLE"), RoleController.getAllTable);
router.get("/role/getTotalCount", verifyToken, RoleController.getTotalCount);

/**
 * ROUTER
 * Get Role by Id.
 * @name GetRoleByID
 * @path {GET} /role/getByStatus/:status
 * @code {200} Role have been brought.
 * @params {Number} :status identifier for Role.
 * @response {module:Role.Role} Role RoleObject.
 * @chain {@link module:MiddlewareIndex.VerifyToken}
 */
router.get('/role/getByStatus/:status', verifyToken, roleHasPermissions('READ.ROLE'), RoleController.getAllByStatus);

/**
 * ROUTER
 * Get Role by Id.
 * @name GetRoleByID
 * @path {GET} /role/getById/:id
 * @code {200} Role have been brought.
 * @params {Number} :id identifier for Role.
 * @response {module:Role.Role} Role RoleObject.
 * @chain {@link module:MiddlewareIndex.VerifyToken}
 */
router.get('/role/getById/:hash', verifyToken, roleHasPermissions('READ.ROLE'), RoleController.getById);

/**
 * ROUTER
 * Update Role by Id.
 * @name UpdateRoleByID
 * @path {PUT} /role/update/:id
 * @code {200} Role have been updated.
 * @params {Number} :id identifier for Role.
 * @chain {@link module:MiddlewareIndex.VerifyToken}
 */
router.put('/role/update/:hash', verifyToken, roleHasPermissions("UPDATE.ROLE"), RoleController.update);
router.delete('/role/delete/:hash', verifyToken, roleHasPermissions("DELETE.ROLE"), RoleController.deleteOne);

 router.get('/role/getById/:hash/detail', verifyToken, roleHasPermissions('READ.ROLE'), RoleController.getByIdDetail);
module.exports = router;