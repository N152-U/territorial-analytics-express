const { PermissionService } = require('../services/index.js');
const auth = require('../utils/auth.js');
const APIError = require('../utils/error.js');

module.exports = {
 
  // READ ALL
  getAllByStatus: async (req, res, next) => {
    try {

    const {status}=req.params;
      const permission = await PermissionService.getAllByStatus(status);
      res.json({ payload: permission });
    } catch (error) {
      (process.env.DEBUG)?next(console.trace(error)):next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
  
      const permissions = await PermissionService.getAll();
      res.status(200).json({ payload: permissions });
    } catch (error) {
      (process.env.DEBUG)?next(console.trace(error)):next(error);
    }
  },
    //READ BY ID
    getAllByRoleID: async(req, res, next) => {
      try {
          const { hash } = req.params;
          const permissionId = await PermissionService.getAllByRoleID(hash);
          res.status(200).json({ payload: permissionId });
      } catch (error) {
          (process.env.DEBUG) ? next(console.trace(error)): next(error);
      }
  },
};