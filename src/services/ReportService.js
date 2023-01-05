const { User, UserLog, Role, Permission, tPostgres } = require('../models/index.js');
const { QueryTypes } = require('sequelize');
const postgresClient = require('../utils/postgresClient.js');
const moment = require('moment');
const {
  Sequelize
} = require('sequelize');
const { Op } = require("sequelize");


let t;
module.exports = {

  /**INFROME */
  reportsCountDaily: (date) => {
    const daily = moment().format("YYYY-MM-DD");

    const query = `select count(*)  daily_reports from reports 
    where created_at between :initialDate and :finalDate
    and active = true
    and status_id != 1;` ;
    return postgresClient.query(query, {
      raw: true,
      replacements: { initialDate: date + " 00:00:00", finalDate: date + " 23:59:59" },
      type: QueryTypes.SELECT,

    });

  },
  reportsCountBeforeOneDay: (date) => {
    const daily = moment(date).subtract(1, 'd').format("YYYY-MM-DD");

    const query = `select count(*)  before_one_day_reports from reports 
    where created_at between :initialDate and :finalDate
    and active = true
    and status_id != 1;` ;
    return postgresClient.query(query, {
      raw: true,
      replacements: { initialDate: daily + " 00:00:00", finalDate: daily + " 23:59:59" },
      type: QueryTypes.SELECT,

    });

  },
  reportsCountByReceipts: (startDate,finalDate,codificationId) => {
    if(finalDate == 'null'){
      finalDate=startDate;
    }

    const daily = moment().format("YYYY-MM-DD");

    const query = `

    select COALESCE("a".receipt,receipts.receipt) as receipt,COALESCE("a".count_reports,0) as count_reports from receipts
	left join(
		 select rec.receipt, COALESCE(count(rec.receipt),0) as count_reports from reports rep inner join receipts rec on rep.receipt_id = rec.id
    inner join "incidents" on "incidents"."folio" = "rep"."incident_id" 
    where rep.created_at between :initialDate and :finalDate
    and rep.active = true
    and rep.status_id != 1 group by receipt 
	) "a" ON "receipts"."receipt" = "a"."receipt"
	where receipts.active = true
    ` ;
    return postgresClient.query(query, {
      raw: true,
      replacements: { initialDate: startDate + " 00:00:00", finalDate: finalDate + " 23:59:59" },
      type: QueryTypes.SELECT,
    });

  },
  reportsTotalCountByReceipts: (startDate,finalDate) => {
    if(finalDate == 'null'){
      finalDate=startDate;
    }

    const daily = moment().format("YYYY-MM-DD");

    const query = `
    select COALESCE(count(rec.receipt),0) as count_incidents from reports rep inner join receipts rec on rep.receipt_id = rec.id
    inner join "incidents" on "incidents"."folio" = "rep"."incident_id" 
    where rep.created_at between :initialDate and :finalDate
    and rep.active = true
    and rep.status_id != 1  

    ` ;
    return postgresClient.query(query, {
      raw: true,
      replacements: { initialDate: startDate + " 00:00:00", finalDate: finalDate + " 23:59:59" },
      type: QueryTypes.SELECT,
    });

  },
  relaciondereportescapturadosderedessociales:(startDate, finalDate)=>{
const query= `
select
concat (users.name,' ', users.paterno, ' ', users.materno) "users", 
count (*) as "subtotal_reports",

json_agg(json_build_object(
'sequence', reports.sequence,
'fullname', COALESCE(citizens.fullname,'Sin dato'),
'receipt',receipts.receipt,
'codification_type',codification_types.codification_type,
'municipality',municipalities.municipality,
'settlement',settlements.settlement,
'phone1', COALESCE(citizens.phone1,'Sin dato')
	
)) as "reports"
	
from "reports"
inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
inner join "receipts" on reports.receipt_id = receipts.id 	
inner join citizens on reports.citizen_id = citizens.id
inner join users on reports.created_by = users.id
where reports.active = true
and reports.created_at between :initialDate and :finalDate
and reports.status_id != 1
and reports.receipt_id in (22,23,24)
group by users.name, users.paterno, users.materno
`;
return postgresClient.query(query, {
  raw: true,
  replacements: { initialDate: startDate, finalDate: finalDate },
  type: QueryTypes.SELECT,
});
  }

};