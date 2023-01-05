/**
 * Delivery Detail Controller
 * @module src/controllers/RoleController
 * @name RoleController
 * @author Andrea Naraly Solis Martinez
 * @requires module:RoleService
 */

const Role = require('../models/Role.js');
const { RoleService } = require('../services/index.js');
const auth = require('../utils/auth.js');
const APIError = require('../utils/error.js');

module.exports = {
    

     /**
   * CONTROLLER
   * Create Role with permissions.
   * @async
   * @function
   * @name create
   * @description Create Role with permissions.
   * @param {Object} req  The request.
   * @param {Object} res  The response.
   * @param {module:Role.Role} req.body The JSON payload.
   * @param {Function} next Next middleware function.
   * @return {Promise<void>}
  */

    create: async(req, res, next) => {
        try {
        
            const { body } = req;
            const role = await RoleService.create(body);
            res.status(201).json({ message: 'Role created', payload: role });
        } catch (error) {
            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },
   
     /**
   * CONTROLLER
   * Get All Roles.
   * @async
   * @function
   * @name getAll
   * @description Get All Roles.
   * @param req {Object} The request.
   * @param res {Object} The response.
   * @param {Function} next Next middleware function-
   * @return {Promise<void>}
  */
      getAll: async(req, res, next) => {
        try {
            const roles = await RoleService.getAll();
            res.json({ payload: roles });
        } catch (error) {

            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },
      getAllTable: async(req, res, next) => {
        try {
            const {offset, limit,role}=req.query;  
            const roles = await RoleService.getAllTable(offset, limit,role);
            res.json({ payload: roles });
        } catch (error) {

            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },
    getTotalCount: async (req, res, next) => {
        try {
         
          const {offset, limit,role}=req.query;  
          const rolesCount = await RoleService.getTotalCount(offset, limit,role);
          res.json({ payload: rolesCount });
        } catch (error) {
          process.env.DEBUG ? next(console.trace(error)) : next(error);
        }
      },
    
    /**
   * CONTROLLER
   * Get Roles By Id.
   * @async
   * @function
   * @name getAllByStatus
   * @description Get Roles By Id.
   * @param req {Object} The request.
   * @param req.params.status {Number} The Role Status param.
   * @param res {Object} The response.
   * @param {Function} next Next middleware function.
   * @return {Promise<void>}
  */
    getAllByStatus: async(req, res, next) => {
        try {
         
            const { status } = req.params
            const roles = await RoleService.getAllByStatus(status);
            res.json({ payload: roles });
        } catch (error) {
            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },
    
    /**
   * CONTROLLER
   * Get Role By Id.
   * @async
   * @function
   * @name getById
   * @description Get Role By Id.
   * @param req {Object} The request.
   * @param req.params.id {Number} The Role Id param.
   * @param res {Object} The response.
   * @param {Function} next Next middleware function.
   * @return {Promise<void>}
  */
    getById: async(req, res, next) => {
        try {

            const { hash } = req.params;
            const roleName = await RoleService.getById(hash);
            res.json({ payload: roleName });
        } catch (error) {
            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },
    getByIdDetail: async(req, res, next) => {
        try {

            const { hash } = req.params;
            const role = await RoleService.getByIdDetail(hash);
            const formattedRole = {
                roleName: role.dataValues.roleName,
                permissions: role.dataValues.permissions.map((value)=>{
                    return {
                        description: value.description
                    }
                    
                })
            }

            res.json({ payload: formattedRole });
        } catch (error) {
            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },

   /**
   * CONTROLLER
   * Delete Role By Id.
   * @async
   * @function
   * @name deleteOne
   * @description Delete Role By Id.
   * @param {Object} req  The request.
   * @param {Number} req.params.id The Role Id param.
   * @param {Object} res  The response.
   * @param {Function} next Next middleware function.
   * @return {Promise<void>}
  */
    deleteOne: async(req, res, next) => {
        try {
            const { hash } = req.params;
            await RoleService.deleteOne(hash);
            res.status(200).json({ message: 'Role has been deleted' });
        } catch (error) {
            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    },

    /**
   * CONTROLLER
   * Update Role By Id.
   * @async
   * @function
   * @name update
   * @description Update Role with permissions By Id.
   * @param {Object} req  The request.
   * @param {module:Role.Role} req.body The JSON payload.
   * @param {Number} req.params.id The Role Id param.
   * @param {Object} res  The response.
   * @param {Function} next Next middleware function.
   * @return {Promise<void>}
  */
    update: async(req, res, next) => {
        try {
            
            const { body } = req;
            const { hash } = req.params;
            await RoleService.update(hash, body);
            res.status(200).json({
                message: 'Role has been updated'
            });
        } catch (error) {
            (process.env.DEBUG) ? next(console.trace(error)): next(error);
        }
    }
};