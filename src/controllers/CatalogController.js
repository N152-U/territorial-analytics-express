const { CatalogService } = require('../services/index.js');
const auth = require('../utils/auth.js');
const jwt = require("jsonwebtoken");
const APIError = require('../utils/error.js');

module.exports = {
    getAllCodification: async(req, res, next) => {
        try {
            const codifications = await CatalogService.getAllCodification();
            res.status(200).json({ payload: codifications });
        } catch (error) {
           next(error);
        }
    },
    getAllReceipts:  async(req, res, next) => {
        try {
            const receipts = await CatalogService.getAllReceipts();
            res.status(200).json({ payload: receipts });
        } catch (error) {
           next(error);
        }
    },
    getAllIntensities:  async(req, res, next) => {
        try {
            const intensities = await CatalogService.getAllIntensities();
            res.status(200).json({ payload: intensities });
        } catch (error) {
           next(error);
        }
    },
    getAllPriorities:  async(req, res, next) => {
        try {
            const intensities = await CatalogService.getAllPriorities();
            res.status(200).json({ payload: intensities });
        } catch (error) {
           next(error);
        }
    },
    getAllStatuses:  async(req, res, next) => {
        try {
            const statuses = await CatalogService.getAllStatuses();
            res.status(200).json({ payload: statuses });
        } catch (error) {
           next(error);
        }
    },
    getCodificationTypes: async(req, res, next) => {
        try {
            const {id} = req.params;
            const codificationsType = await CatalogService.getCodificationTypes(id);
            res.status(200).json({ payload: codificationsType });
        } catch (error) {
           next(error);
        }
    },
    getAllServiceCenters: async(req,res,next) =>{
        try {
            const serviceCenters = await CatalogService.getAllServiceCenters();
            res.status(200).json({ payload: serviceCenters });
        } catch (error) {
            next(error);
        }
    },
    codificationsWithCodificationTypes: async(req,res,next) => {
        try {
            const codifications = await CatalogService.getAllCodification();
            const codificationTypes = await CatalogService.getCodificationTypes();

            const codificationsWithCodificationTypes=await codifications.map((key, codification)=>{
                return codificationTypes.filter((key,codificationType)=>
                {
                        return codificationType.codification_id==codification.id;
                })
            })
           
            res.status(200).json({ payload: codificationsWithCodificationTypes });
        } catch (error) {
            next(error);
        }
      },
      getAllFloodingReasons: async(req,res,next)=>{
        try {
            const getAllFloodingReasons = await CatalogService.getAllFloodingReasons();
            res.status(200).json({ payload: getAllFloodingReasons });
        } catch (error) {
            next(error);
        }
      },
};