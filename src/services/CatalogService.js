const { User, UserLog, Role, Permission, tPostgres } = require('../models/index.js');
const { QueryTypes } = require('sequelize');
const postgresClient = require('../utils/postgresClient.js'); 
const {
    Sequelize
  } = require('sequelize');
 const { Op } = require("sequelize");


let t;
module.exports = {
 
    getAllCodification: () => {
        const query = `SELECT id,codification
        FROM codifications where active=true and id in(1,2,3)`;
    
    
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      }, 
      getAllReceipts: () => {
        const query = `SELECT id,receipt
        FROM receipts where active=true`;
    
    
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      }, 
      getAllIntensities: () => {
        const query = `SELECT id,name
        FROM intensities where active=true`;
    
    
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      }, 
      getAllPriorities: () => {
        const query = `SELECT id,priority
        FROM priorities where active=true`;
    
    
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      },
      getAllStatuses: () => {
        const query = `SELECT id,name
        FROM statuses where active=true`;
    
    
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      },
      getCodificationTypes: (id='all') => {
        if(id!="all")
        {
          const query = `SELECT id,codification_type, codification_id
          FROM codification_types where active=true and codification_id = :id
          ORDER BY codification_type`;
      
      
          return postgresClient.query(query, {
            raw: true,
            replacements: {id},
            type: QueryTypes.SELECT,
          });
        }else{
          const query = `SELECT id,codification_type, codification_id
          FROM codification_types where active=true  
          ORDER BY id`;
      
      
          return postgresClient.query(query, {
            raw: true,
        /*     replacements: {id}, */
            type: QueryTypes.SELECT,
          });
        }
       
      }, 
      getAllServiceCenters:()=>{
        const query = `SELECT id,sacmex_id
        FROM service_centers where active=true`;
    
    
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      },
      codificationsWithCodificationTypes: () => {
        const query = `
        select codifications.id, codifications.codification, codification_types.id, codification_types.codification_type
        from "codifications" 
        join "codification_types" on "codification_types"."codification_id" = "codifications"."id"
        ` ;
        return postgresClient.query(query, {
          raw: true,
          type: QueryTypes.SELECT,
        });
    
      },
      getAllFloodingReasons:()=>{
        const query = `select name from flooding_reasons where active=true`;
        return postgresClient.query(query, {
          raw: true,
          replacements: { },
          type: QueryTypes.SELECT,
        });
      },
};