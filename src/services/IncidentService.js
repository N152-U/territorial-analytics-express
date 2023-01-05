const {
  User,
  UserLog,
  Role,
  Permission,
  tPostgres,
} = require("../models/index.js");
const { QueryTypes } = require("sequelize");
const postgresClient = require("../utils/postgresClient.js");
const moment = require("moment");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

let t;
module.exports = {
  /*Daily */
  receivedDaily: () => {
    const daily = moment().format("YYYY-MM-DD");
    const query = ` Select to_char(incidents."created_at", 'DD-MM-YYYY') as count_date ,
    count(to_char(incidents."created_at", 'DD-MM-YYYY')) as received,
    count(to_char(incidents."created_at", 'DD-MM-YYYY')) as process,
    count(to_char(incidents."created_at", 'DD-MM-YYYY')) as repaired
    from
    incidents  join reports   on 	incidents.folio = reports.incident_id	where to_char(incidents."created_at", 'YYYY-MM-DD') like :day and reports.codification_id in (1,2,3)
		and incidents.active = true and reports.active = true  
    group by to_char(incidents."created_at", 'DD-MM-YYYY') order by count_date`;
    return postgresClient.query(query, {
      raw: true,
      replacements: { day: daily + "%" },
      type: QueryTypes.SELECT,
    });
  },
  processedDaily: () => {
    const daily = moment().format("YYYY-MM-DD");

    const query = ` select count(to_char(incidents."created_at", 'DD-MM-YYYY')) as processed,
    to_char(incidents."created_at", 'DD-MM-YYYY') as count_date
    from incidents  join reports   on 	incidents.folio = reports.incident_id	where reports.codification_id in (1,2,3)
    and incidents.active = true and reports.active = true  
   and incidents.status_id != 9 and incidents.close_id != 12  and to_char(incidents."created_at", 'YYYY-MM-DD') like :day
    group by to_char(incidents."created_at", 'DD-MM-YYYY') order by count_date`;
    return postgresClient.query(query, {
      raw: true,
      replacements: { day: daily + "%" },
      type: QueryTypes.SELECT,
    });
  },
  repairedDaily: () => {
    const daily = moment().format("YYYY-MM-DD");

    const query = ` select count(to_char(incidents."created_at", 'DD-MM-YYYY')) as repaired,
    to_char(incidents."created_at", 'DD-MM-YYYY') as count_date
    from incidents  join reports   on 	incidents.folio = reports.incident_id	where reports.codification_id in (1,2,3)
    and incidents.active = true and reports.active = true  
   and incidents.status_id = 9 and incidents.close_id = 12  and to_char(incidents."created_at", 'YYYY-MM-DD') like :day
    group by to_char(incidents."created_at", 'DD-MM-YYYY') order by count_date`;
    return postgresClient.query(query, {
      raw: true,
      replacements: { day: daily + "%" },
      type: QueryTypes.SELECT,
    });
  },

  /*****************************INFROME **********************/
  incidentsCountByDate: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    if (finalDate == "null" || finalDate == null || finalDate == "undefined") {
      finalDate = startDate;
    }
    if (
      codificationId == "null" ||
      codificationId == null ||
      codificationId == "undefined" ||
      codificationId == undefined
    ) {
      andcodificationId = "and reports.codification_id in(1,2,3)";
    } else {
      andcodificationId =
        " and reports.codification_id in(" + codificationId + ")";
    }
    if (
      codificationTypeId == "null" ||
      codificationTypeId == null ||
      codificationTypeId == "undefined" ||
      codificationTypeId == undefined
    ) {
      andCodificationTypeId = "";
    } else {
      andCodificationTypeId =
        " and reports.codification_type_id in (" + codificationTypeId + ")";
    }
    const query = ` select 
    count(*) incidents
    from "incidents" 
    where "active" = true 
    and "active" = true 
    and 
    exists (select * from "reports" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where 
    "reports"."active" = true 
    and "incidents"."folio" = "reports"."incident_id" 
        
        ${andcodificationId}
        ${andCodificationTypeId}
        and "reports".status_id != 1
        and "reports"."duplicated" = false		
    ) 
    and created_at between :initialDate and :finalDate;`;

    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCountByCodification: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    //const daily = moment().format("YYYY-MM-DD");
    if (finalDate == "null") {
      finalDate = startDate;
    }
    if (
      codificationId == "null" ||
      codificationId == null ||
      codificationId == "undefined" ||
      codificationId == undefined
    ) {
      andcodificationId = "and reports.codification_id in(1,2,3)";
    } else {
      andcodificationId =
        " and reports.codification_id in(" + codificationId + ")";
    }
    if (
      codificationTypeId == "null" ||
      codificationTypeId == null ||
      codificationTypeId == "undefined" ||
      codificationId == undefined
    ) {
      andCodificationTypeId = "";
    } else {
      andCodificationTypeId =
        " and reports.codification_type_id in (" + codificationTypeId + ")";
    }
    const query = `select "codifications"."codification", COALESCE("a"."count",0) "numberIncidents"
    from "codifications"
    left join (
    select "codifications"."codification",count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate 
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    ${andcodificationId}
    ${andCodificationTypeId}
    group by "codifications"."codification") "a" on "codifications"."codification" = "a"."codification"
  
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCountByCodificationReceipt: (
    startDate,
    finalDate,
    codificationTypeId
  ) => {
    //const daily = moment().format("YYYY-MM-DD");

    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `
   
    select "service_centers"."name"  "campamento",
    count(*) "y" 
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationTypeId)
    group by "service_centers"."name", "codification_types"."codification_type","codifications"."codification"
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
        codificationTypeId,
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCountByTypeCodification: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `
    select 
    COALESCE("a"."name") "campamento",
    COALESCE("a"."codification") "drilldown",
    COALESCE("a"."count",0) "Recibidos",
	COALESCE("b"."count",0) "Concluidos",
    COALESCE("c"."count",0) "Rechazados, duplicados",
    COALESCE("d"."count",0) "En proceso"
    from service_centers
	  --Consulta total recibidos por campamentos
    LEFT JOIN (select "service_centers"."name", CONCAT("codifications"."codification",' ',"codification_types"."codification_type") as codification, count(*) "count"
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (1,2,3)
    group by "service_centers"."name", "codification_types"."codification_type","codifications"."codification") "a" ON "service_centers"."name" = "a"."name"
	
	  LEFT JOIN (
	-- Concluidos por campamentos
	  select "service_centers"."name", "codification_types"."codification_type", count(*) "count","codifications"."codification"
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and (("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      or ("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      or("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      and "incidents"."close_id" is not null
    and "incidents"."refuse_id" is not null
      )
	  and "incidents"."close_id" is not null
    and "incidents"."refuse_id" is not null
    or (
    (
      ("incidents"."status_id" not in(10)
      and
      "incidents"."close_id" not in (1)
      ) or
      ("incidents"."status_id" not in(9)
      and
      "incidents"."close_id" not in (1))
      )
    or (
      ("incidents"."status_id" not in(10)
      and
      "incidents"."refuse_id" not in (3)
      ) or
      (
      "incidents"."close_id" not in (6))
    )
    or (
      ("incidents"."status_id" not in(10)
      and
      "incidents"."close_id" not in (13)
      ) or
      ("incidents"."status_id" not in(9)
      and
      "incidents"."close_id" not in (13))
    ))
    and "incidents"."status_id" in(9)
    and "incidents"."close_id" in(12)
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
	and "reports"."codification_id" in (1,2,3)
	group by "service_centers"."name", "codification_types"."codification_type","codifications"."codification") "b" ON "service_centers"."name" = "b"."name"
	
  LEFT JOIN (
	  -- Rechazados, inexistentes, duplicados por campamentos
	  select "service_centers"."name", "codification_types"."codification_type",count(*) "count","codifications"."codification"
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
	 
    and (("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      or ("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      or("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      and "incidents"."close_id" is not null
    and "incidents"."refuse_id" is not null
      )
	  and "incidents"."close_id" is not null
    and "incidents"."refuse_id" is not null
    or (
    (
      ("incidents"."status_id" in(10)
      and
      "incidents"."close_id" in (1)
      ) or
      ("incidents"."status_id" in(9)
      and
      "incidents"."close_id" in (1))
      )
    or (
      ("incidents"."status_id" in(10)
      and
      "incidents"."refuse_id" in (3)
      ) or
      (
      "incidents"."close_id" in (6))
    )
    or (
      ("incidents"."status_id" in(10)
      and
      "incidents"."close_id" in (13)
      ) or
      ("incidents"."status_id" in(9)
      and
      "incidents"."close_id" in (13))
    ))
    and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
    and "reports"."codification_id" in (1,2,3)
    group by "service_centers"."name" , "codification_types"."codification_type","codifications"."codification") "c" ON "service_centers"."name" = "c"."name"
    LEFT JOIN (
    -- En proceso por campamentos
    select "service_centers"."name","codification_types"."codification_type","codifications"."codification",count(*) "count"
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
		and (("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      or ("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      or("incidents"."status_id" not in(6)
    and "incidents"."assigned_tormenta" is not null
    and "incidents"."assigned_cuadrilla" is not null)
      and "incidents"."close_id" is not null
    and "incidents"."refuse_id" is not null
      )
      and "incidents"."close_id" is not null
    and "incidents"."refuse_id" is not null
    or (
    (
      ("incidents"."status_id" not in(10)
      and
      "incidents"."close_id" not in (1)
      ) or
      ("incidents"."status_id" not in(9)
      and
      "incidents"."close_id" not in (1))
      )
    or (
      ("incidents"."status_id" not in(10)
      and
      "incidents"."refuse_id" not in (3)
      ) or
      (
      "incidents"."close_id" not in (6))
    )
    or (
      ("incidents"."status_id" not in(10)
      and
      "incidents"."close_id" not in (13)
      ) or
      ("incidents"."status_id" not in(9)
      and
      "incidents"."close_id" not in (13))
    ))
    and "incidents"."status_id" not in(9)
    and "incidents"."close_id" not in(12)
  	and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
	and "reports"."codification_id" in (1,2,3)
    group by "service_centers"."name", "codification_types"."codification_type","codifications"."codification") "d" 
	ON "service_centers"."name" = "d"."name"
    where service_centers.active = true
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
        codification_id: codificationId,
        codification_type_id: codificationTypeId,
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsCountByCodificationAndCodificationType: (
    startDate,
    finalDate,
    codificationId,
    groupId,
    codificationTypeId
  ) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    if (codificationTypeId != "null") {
      andCodificationTypeId =
        " and reports.codification_type_id in (" + codificationTypeId + ")";
      andServiceCenterCodificationTypeId =
        "and service_centers.codification_types_serve::jsonb @> '[" +
        codificationTypeId +
        "]'";
    } else {
      andCodificationTypeId = " ";
      andServiceCenterCodificationTypeId = " ";
    }

    const query = ` 
    select 
    COALESCE("a"."name",service_centers.name) "campamento",
    COALESCE("a"."group") "codification",
    COALESCE("a"."count",0) "Recibidos",
  COALESCE("b"."count",0) "Concluidos",
    COALESCE("c"."count",0) "Rechazados, duplicados",
    COALESCE("d"."count",0) "En proceso"
    from service_centers
    --Consulta total recibidos por campamentos
    LEFT JOIN (select  "service_centers"."name",
 "groups"."group",count(distinct(incidents.folio)) from "incidents"
 left join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 left join "groups" on "groups"."id" = "incidents"."group_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 where "incidents"."active" = true
 and "incidents"."status_id" != 10
 and "reports"."codification_id" in (:codificationId)
 and "reports"."duplicated" = false
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <= :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 ${andCodificationTypeId}
 ${andServiceCenterCodificationTypeId}
 and "service_centers"."sacmex_type" = 'CAMPAMENT'
 group by "service_centers"."name","groups"."group") "a" ON "service_centers"."name" = "a"."name"
  
    LEFT JOIN (
  -- Concluidos por campamentos
    select  "service_centers"."name",
 "groups"."group",count(distinct(incidents.folio)) from "incidents"
 left join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 left join "groups" on "groups"."id" = "incidents"."group_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 where "incidents"."active" = true
 and "incidents"."status_id" != 10
 and "reports"."codification_id" in (:codificationId)
 and "reports"."duplicated" = false
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <= :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "incidents"."status_id" in(9)
 and "incidents"."close_id" in(12)
 ${andCodificationTypeId}
 ${andServiceCenterCodificationTypeId}
 and "service_centers"."sacmex_type" = 'CAMPAMENT'
 group by "service_centers"."name","groups"."group") "b" ON "service_centers"."name" = "b"."name"
  
  LEFT JOIN (
    -- Rechazados, inexistentes, duplicados por campamentos
    select  "service_centers"."name",
 "groups"."group",count(distinct(incidents.folio)) from "incidents"
 left join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 left join "groups" on "groups"."id" = "incidents"."group_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 where "incidents"."active" = true
 and "incidents"."status_id" != 10
 and "reports"."codification_id" in (:codificationId)
 and "reports"."duplicated" = false
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "incidents"."status_id" not in(3,6,4)
 and "incidents"."close_id" not in(12)
 ${andCodificationTypeId}
 ${andServiceCenterCodificationTypeId}
 and ("incidents"."close_id"  in(6,13,1) or "incidents"."refuse_id" in (3))
 and "service_centers"."sacmex_type" = 'CAMPAMENT'
 group by "service_centers"."name","groups"."group") "c" ON "service_centers"."name" = "c"."name"
    LEFT JOIN (
    -- En proceso por campamentos
    select  "service_centers"."name",
 "groups"."group",count(distinct(incidents.folio)) from "incidents"
 left join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 left join "groups" on "groups"."id" = "incidents"."group_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 where "incidents"."active" = true
 and "incidents"."status_id" != 10
 and "reports"."codification_id" in (:codificationId)
 and "reports"."duplicated" = false
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 ${andCodificationTypeId}
 ${andServiceCenterCodificationTypeId}
 and ("incidents"."status_id" !=9 or "incidents"."close_id" != 12)
 and "incidents"."status_id" in(3,6,4,5,7)	
 and "service_centers"."sacmex_type" = 'CAMPAMENT'
 group by "service_centers"."name","groups"."group") "d" 
  ON "service_centers"."name" = "d"."name"
    where service_centers.active = true
    and service_centers.group_id =:groupId
  and "service_centers"."sacmex_type" = 'CAMPAMENT'
  ${andServiceCenterCodificationTypeId}
  
  
    `;
    return postgresClient.query(query, {
      raw: true,
      plain: false,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
        codificationId,
        groupId,
      },
      type: QueryTypes.SELECT,
    });
  },
  codificationName: (codificationId, codificationTypeId) => {
    let codification_type_id, select_codification_type, join_codification_type;

    if (
      codificationTypeId == "null" ||
      codificationTypeId == null ||
      codificationTypeId == "undefined" ||
      codificationTypeId == undefined
    ) {
      select_codification_type = "";
      codification_type_id = "";
    } else {
      codification_type_id = ` and codification_types.id in (${codificationTypeId})`;
      select_codification_type = `,
    "codification_types"."codification_type"`;
    }
    const query = `
      select codifications.codification
      ${select_codification_type}
      from "codification_types"
      join "codifications" on "codifications"."id" = "codification_types"."codification_id"
      where
      codifications.id in (:codificationId)
      ${codification_type_id}
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        codificationId,
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsCountByCodificationType: (codificationId, startDate, finalDate) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }

    const query = `
    select "codification_types"."codification_type", 
    COALESCE("a"."count",0) "Total"
    from codification_types
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    group by "codification_types"."codification_type") "a" ON "codification_types"."codification_type" = "a"."codification_type"
    WHERE "codification_types"."codification_id" in (:codificationId);
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        codificationId,
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCountByCodificationMunicipalities: (startDate, finalDate) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `
    SELECT municipalities.municipality,"municipalities"."acronym", COALESCE("a"."count",0) "Agua Potable"
    ,COALESCE("b"."count",0) "Drenaje",COALESCE("c"."count",0) "Agua tratada"
    FROM municipalities
    LEFT JOIN (
    select municipalities.municipality,"municipalities"."acronym",count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" between :initialDate and :finalDate
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (1)
    group by "municipalities"."acronym",municipalities.municipality) "a" ON "a"."acronym" = "municipalities"."acronym"
    LEFT JOIN (
    select municipalities.municipality,"municipalities"."acronym",count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" between :initialDate and :finalDate
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (2)
    group by "municipalities"."acronym",municipalities.municipality) "b" ON "b"."acronym" = "municipalities"."acronym"
    LEFT JOIN (
    select municipalities.municipality,"municipalities"."acronym",count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" between :initialDate and :finalDate
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (3)
    group by "municipalities"."acronym",municipalities.municipality) "c" ON "c"."acronym" = "municipalities"."acronym";
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsCountByMunicipalitiesCodificationType: (codificationId, date) => {
    //const daily = "2022-01-05";

    const query = `

    select "codification_types"."codification_type", 
    COALESCE("a"."count",0) "AZC",
    COALESCE("b"."count",0) "CYC",
    COALESCE("c"."count",0) "CDM",
    COALESCE("d"."count",0) "GAM",
    COALESCE("e"."count",0) "IZC",
    COALESCE("f"."count",0) "IZT",
    COALESCE("g"."count",0) "LMC",
    COALESCE("h"."count",0) "MAT",
    COALESCE("i"."count",0) "ALO",
    COALESCE("j"."count",0) "TLH",
    COALESCE("k"."count",0) "TLP",
    COALESCE("l"."count",0) "XOC",
    COALESCE("m"."count",0) "BJZ",
    COALESCE("n"."count",0) "CHT",
    COALESCE("o"."count",0) "MGO",
    COALESCE("p"."count",0) "VCZ"
    from codification_types
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate 
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (2)
    group by "codification_types"."codification_type") "a" ON "codification_types"."codification_type" = "a"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (3)
    group by "codification_types"."codification_type") "b" ON "codification_types"."codification_type" = "b"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (4)
    group by "codification_types"."codification_type") "c" ON "codification_types"."codification_type" = "c"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (5)
    group by "codification_types"."codification_type") "d" ON "codification_types"."codification_type" = "d"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (6)
    group by "codification_types"."codification_type") "e" ON "codification_types"."codification_type" = "e"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (7)
    group by "codification_types"."codification_type") "f" ON "codification_types"."codification_type" = "f"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (8)
    group by "codification_types"."codification_type") "g" ON "codification_types"."codification_type" = "g"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (9)
    group by "codification_types"."codification_type") "h" ON "codification_types"."codification_type" = "h"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (10)
    group by "codification_types"."codification_type") "i" ON "codification_types"."codification_type" = "i"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (11)
    group by "codification_types"."codification_type") "j" ON "codification_types"."codification_type" = "j"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (12)
    group by "codification_types"."codification_type") "k" ON "codification_types"."codification_type" = "k"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (13)
    group by "codification_types"."codification_type") "l" ON "codification_types"."codification_type" = "l"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (14)
    group by "codification_types"."codification_type") "m" ON "codification_types"."codification_type" = "m"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (15)
    group by "codification_types"."codification_type") "n" ON "codification_types"."codification_type" = "n"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (16)
    group by "codification_types"."codification_type") "o" ON "codification_types"."codification_type" = "o"."codification_type"
    
    LEFT JOIN (
    select "codification_types"."codification_type", count(*) "count"
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate  
    and "incidents"."created_at" <=  :finalDate 
    and "reports"."active" = true 
    and "incidents"."active" = true 
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and "reports"."codification_id" in (:codificationId)
    and "municipalities"."real_id" in (17)
    group by "codification_types"."codification_type") "p" ON "codification_types"."codification_type" = "p"."codification_type"
    WHERE "codification_types"."codification_id" in (:codificationId);
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        codificationId,
        initialDate: date + " 00:00:00",
        finalDate: date + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsCodificationTopSettlement: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `select  *
    from (
    select codifications.codification,codification_type,
    municipalities.municipality as municipalityname, 
    case 
    when municipalities.real_id = 2 then 'AZC' 
    when municipalities.real_id = 3 then 'CYC' 
    when municipalities.real_id = 4 then 'CDM' 
    when municipalities.real_id = 5 then 'GAM' 
    when municipalities.real_id = 6 then 'IZC' 
    when municipalities.real_id = 7 then 'IZT' 
    when municipalities.real_id = 8 then 'LMC'
    when municipalities.real_id = 9 then 'MAT'
    when municipalities.real_id = 10 then 'ALO'
    when municipalities.real_id = 11 then 'TLH' 
    when municipalities.real_id = 12 then 'TLP' 
    when municipalities.real_id = 13 then 'XOC' 
    when municipalities.real_id = 14 then 'BJZ'
    when municipalities.real_id = 15 then 'CHT' 
    when municipalities.real_id = 16 then 'MGO' 
    when municipalities.real_id = 17 then 'VCZ' 
    end as municipality ,
    "settlements"."settlement",  count("settlements"."settlement") "count", 
    ROW_NUMBER() OVER (
    PARTITION BY codification_type ORDER BY  count("settlements"."settlement") desc  ) 
    as row_num
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true  
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    
    group by codification_types.codification_type,  municipalities.municipality,
      codifications.codification, "settlements"."settlement",municipalities.real_id
    ORDER BY  count("settlements"."settlement") desc) a
    where a.row_num<=5
    order by a.count desc
	fetch first 5 rows only
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCodificationTopSettlementByCodification: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    if (
      codificationId == "null" ||
      codificationId == null ||
      codificationId == "undefined" ||
      codificationId == undefined
    ) {
      andcodificationId = "and reports.codification_id in(1,2,3)";
    } else {
      andcodificationId =
        " and reports.codification_id in(" + codificationId + ")";
    }
    if (
      codificationTypeId == "null" ||
      codificationTypeId == null ||
      codificationTypeId == "undefined" ||
      codificationId == undefined
    ) {
      andCodificationTypeId = "";
    } else {
      andCodificationTypeId =
        " and reports.codification_type_id in (" + codificationTypeId + ")";
    }
    const query = `
    select  *
    from (
    select codifications.codification,codification_type,
    municipalities.municipality as municipalityname, 
    case 
    when municipalities.real_id = 2 then 'AZC' 
    when municipalities.real_id = 3 then 'CYC' 
    when municipalities.real_id = 4 then 'CDM' 
    when municipalities.real_id = 5 then 'GAM' 
    when municipalities.real_id = 6 then 'IZC' 
    when municipalities.real_id = 7 then 'IZT' 
    when municipalities.real_id = 8 then 'LMC'
    when municipalities.real_id = 9 then 'MAT'
    when municipalities.real_id = 10 then 'ALO'
    when municipalities.real_id = 11 then 'TLH' 
    when municipalities.real_id = 12 then 'TLP' 
    when municipalities.real_id = 13 then 'XOC' 
    when municipalities.real_id = 14 then 'BJZ'
    when municipalities.real_id = 15 then 'CHT' 
    when municipalities.real_id = 16 then 'MGO' 
    when municipalities.real_id = 17 then 'VCZ' 
    end as municipality ,
    "settlements"."settlement",  count("settlements"."settlement") "count", 
    ROW_NUMBER() OVER (
    PARTITION BY codification_type ORDER BY  count("settlements"."settlement") desc  ) 
    as row_num
    from "incidents" 
    inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
    where "incidents"."active" = true 
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true  
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    ${andcodificationId}
    ${andCodificationTypeId}
    
    group by codification_types.codification_type,  municipalities.municipality,
      codifications.codification, "settlements"."settlement",municipalities.real_id
    ORDER BY  count("settlements"."settlement") desc) a
    where a.row_num<=5
    order by a.count desc
	fetch first 5 rows only

    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
        codificationId,
        codificationTypeId,
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCodificationTopMunicipality: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    /*  const daily = moment().format("YYYY-MM-DD"); */

    if (finalDate == "null") {
      finalDate = startDate;
    }

    const query = `select  *
    from (
    select codifications.codification,codification_type,
      municipalities.municipality as municipalityname,
    case
    when municipalities.real_id = 2 then 'AZC'
    when municipalities.real_id = 3 then 'CYC'
    when municipalities.real_id = 4 then 'CDM'
    when municipalities.real_id = 5 then 'GAM'
    when municipalities.real_id = 6 then 'IZC'
    when municipalities.real_id = 7 then 'IZT'
    when municipalities.real_id = 8 then 'LMC'
    when municipalities.real_id = 9 then 'MAT'
    when municipalities.real_id = 10 then 'ALO'
    when municipalities.real_id = 11 then 'TLH'
    when municipalities.real_id = 12 then 'TLP'
    when municipalities.real_id = 13 then 'XOC'
    when municipalities.real_id = 14 then 'BJZ'
    when municipalities.real_id = 15 then 'CHT'
    when municipalities.real_id = 16 then 'MGO'
    when municipalities.real_id = 17 then 'VCZ'
    end as municipality , count(municipalities.municipality) "count",
    ROW_NUMBER() OVER (
    PARTITION BY codification_type ORDER BY  count(municipalities.municipality) desc  )
    as row_num
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    group by codification_types.codification_type,  municipalities.municipality,
      codifications.codification,municipalities.real_id
    ORDER BY  count(municipalities.municipality) desc) a
    where a.row_num<=5
    order by a.count desc
    fetch first 5 rows only
    
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsRecurrence: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    if (
      codificationId == "null" ||
      codificationId == null ||
      codificationId == "undefined" ||
      codificationId == undefined
    ) {
      andcodificationId = "and reports.codification_id in(1,2,3)";
    } else {
      andcodificationId =
        " and reports.codification_id in(" + codificationId + ")";
    }
    if (
      codificationTypeId == "null" ||
      codificationTypeId == null ||
      codificationTypeId == "undefined" ||
      codificationId == undefined
    ) {
      andCodificationTypeId = "";
    } else {
      andCodificationTypeId =
        " and reports.codification_type_id in (" + codificationTypeId + ")";
    }

    const query = `
    select  *
    from (
    select codifications.codification, codifications.id as codification_id,codification_type, codification_types.id as codification_type_id,CONCAT(codifications.codification,' ',codification_type) categoria,incidents.created_at::timestamp::date,
    to_char( incidents.created_at::timestamp::date, 'DD-MM-YYYY') date,
    municipalities.municipality as municipalityname,
    case
    when municipalities.real_id = 2 then 'AZC'
    when municipalities.real_id = 3 then 'CYC'
    when municipalities.real_id = 4 then 'CDM'
    when municipalities.real_id = 5 then 'GAM'
    when municipalities.real_id = 6 then 'IZC'
    when municipalities.real_id = 7 then 'IZT'
    when municipalities.real_id = 8 then 'LMC'
    when municipalities.real_id = 9 then 'MAT'
    when municipalities.real_id = 10 then 'ALO'
    when municipalities.real_id = 11 then 'TLH'
    when municipalities.real_id = 12 then 'TLP'
    when municipalities.real_id = 13 then 'XOC'
    when municipalities.real_id = 14 then 'BJZ'
    when municipalities.real_id = 15 then 'CHT'
    when municipalities.real_id = 16 then 'MGO'
    when municipalities.real_id = 17 then 'VCZ'
    end as municipality ,
    "settlements"."settlement",  count("settlements"."settlement") "count",
    ROW_NUMBER() OVER (
    PARTITION BY codification_type ORDER BY  count("settlements"."settlement") desc  )
    as row_num,
		ROW_NUMBER() OVER (
    PARTITION BY "settlements"."settlement" ORDER BY codification,codification_type )
    as "day_count"
	
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    ${andcodificationId}
    ${andCodificationTypeId}
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    group by codification_types.id,codification_types.codification_type,  municipalities.municipality,
      codifications.codification, codifications.id, "settlements"."settlement",municipalities.real_id,incidents.created_at::timestamp::date
    ORDER BY  count("settlements"."settlement"
    ) desc) a
       order by a.codification_type,a.count desc,a.created_at
    `;
    return postgresClient
      .query(query, {
        raw: true,
        replacements: {
          initialDate: startDate + " 00:00:00",
          finalDate: finalDate + " 23:59:59",
        },
        type: QueryTypes.SELECT,
      })
      .then((data) => {
        return data;
      });
  },

  incidentsCoordinatesData: (
    codificationId,
    codificationTypeId,
    startDate,
    endDate
  ) => {
    if (codificationTypeId != "all") {
      andCodificationTypeId =
        " AND r.codification_type_id = " + codificationTypeId + " ";
    } else {
      andCodificationTypeId = " ";
    }

    const query = `SELECT DISTINCT max(i.latitude) latitude, max(i.longitude) longitude, max(i.folio) folio, max(m.municipality) municipality, CONCAT( max(m.municipality),' ', max(s.settlement), ' ', max(r.address)) place, max(cts.codification_type) codification_type,  EXTRACT (epoch FROM max(i.created_at)) *1000 AS time, count(r.id)::INTEGER  as reports  
    FROM incidents i 
    INNER JOIN "reports" r on i."folio" = r."incident_id"
    INNER JOIN "codification_types" cts ON cts.id=r.codification_type_id 
    INNER JOIN "municipalities" m ON m.real_id=r.municipality_id
    INNER JOIN "settlements" s ON s.id=r.settlement_id
    WHERE i.active=true
    AND r.active=true
    AND r.codification_id=:codificationId
    AND i.created_at 
    BETWEEN :initialDate AND :endDate
    ${andCodificationTypeId}
    GROUP BY i.folio
    ORDER BY max(i.folio) ASC;`;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        codificationId: codificationId,
        initialDate: startDate + " 00:00:00",
        endDate: endDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsByCodificationWithCodificationTypes: (
    codificationId,
    codificationTypeId,
    startDate,
    endDate
  ) => {
    if (codificationTypeId != "all") {
      andCodificationTypeId =
        " AND r.codification_type_id = " + codificationTypeId + " ";
    } else {
      andCodificationTypeId = " ";
    }

    const query = `SELECT DATE(i.created_at) AS DATE, r.codification_id, ct.codification, r.codification_type_id, cts.codification_type, count(i.id)::INTEGER  incidents_count  
      FROM incidents i 
      LEFT JOIN "reports" r on i."folio" = r."incident_id"
      LEFT JOIN "codifications" ct ON ct.id=r.codification_id
      LEFT JOIN "codification_types" cts ON cts.id=r.codification_type_id 
      LEFT JOIN "municipalities" m ON m.real_id=r.municipality_id
      INNER JOIN "settlements" s ON s.id=r.settlement_id
      WHERE i.active=true
      AND r.active=true
      AND r.codification_id=:codificationId
      AND i.created_at 
      BETWEEN :initialDate AND :endDate
      ${andCodificationTypeId}
      GROUP BY DATE(i.created_at), r.codification_id, ct.codification, r.codification_type_id, cts.codification_type
      ORDER BY DATE(i.created_at) ASC;
     `;

    return postgresClient.query(query, {
      raw: true,
      replacements: {
        codificationId: codificationId,
        initialDate: startDate + " 00:00:00",
        endDate: endDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsCodificationTopMunicipalityByCodification: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `
    select  *
    from (
    select codifications.codification,codification_type,
    DISTINCT municipalities.municipality as municipalityname,
    case
    when municipalities.real_id = 2 then 'AZC'
    when municipalities.real_id = 3 then 'CYC'
    when municipalities.real_id = 4 then 'CDM'
    when municipalities.real_id = 5 then 'GAM'
    when municipalities.real_id = 6 then 'IZC'
    when municipalities.real_id = 7 then 'IZT'
    when municipalities.real_id = 8 then 'LMC'
    when municipalities.real_id = 9 then 'MAT'
    when municipalities.real_id = 10 then 'ALO'
    when municipalities.real_id = 11 then 'TLH'
    when municipalities.real_id = 12 then 'TLP'
    when municipalities.real_id = 13 then 'XOC'
    when municipalities.real_id = 14 then 'BJZ'
    when municipalities.real_id = 15 then 'CHT'
    when municipalities.real_id = 16 then 'MGO'
    when municipalities.real_id = 17 then 'VCZ'
    end as municipality , count(municipalities.municipality) "count",
    ROW_NUMBER() OVER (
    PARTITION BY codification_type ORDER BY  count(municipalities.municipality) desc  )
    as row_num
    from "incidents"
    inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    inner join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    
  	and "reports"."codification_id" in (:codificationId)
  	and "reports"."codification_type_id" in (:codificationTypeId)
    group by codification_types.codification_type,  municipalities.municipality,
    codifications.codification,municipalities.real_id
    ORDER BY  count(municipalities.municipality) desc) a
    where a.row_num<=5
    order by a.count desc
    fetch first 5 rows only
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
        codificationId,
        codificationTypeId,
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsVitherGetAllByDate: (startDate, finalDate) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `
    select "incidents"."folio" as "incident_folio",
    count(reports.sequence) as "count_reports",
    json_agg(json_build_object(
        'report_sequence', "reports".sequence:: varchar(255),
        'report_codification', codifications.codification:: varchar(255),
        'report_codification_type', "codification_types".codification_type:: varchar(255),
        'report_municipality', "municipalities".municipality:: varchar(255),
        'report_settlement', settlements.settlement:: varchar(255),
        'report_zip_code', settlements.zip_code:: varchar(255),
        'report_address', reports.address:: varchar(255),
        'report_btw_street_first', reports.btw_street_first:: varchar(255),
        'report_btw_street_second', reports.btw_street_second:: varchar(255),
        'report_full_address', concat(reports.address, ' ', reports.external_number, ', ', settlements.settlement, ', ', settlements.zip_code, ', ', "municipalities".municipality):: varchar(255),
        'report_georreferencia', concat(reports.latitude, ', ', reports.longitude):: varchar(255),
        'report_latitude', reports.latitude:: varchar(255),
        'report_longitude', reports.longitude:: varchar(255),
        'report_created_at', reports.created_at:: varchar(255),
        'report_updated_at', reports.updated_at:: varchar(255),
        'report_verified_datetime', reports.verified_datetime:: varchar(255),
        'report_citizen_id', citizens.id:: varchar(255),
        'report_duration_name', durations.name:: varchar(255),
        'report_duplicated', reports.duplicated:: varchar(255),
        'report_receipt_id', reports.receipt_id:: varchar(255)
    )) as "reports"
    ,
    incidents.created_at as "incident_created_at",
    incidents.updated_at as "incident_updated_at",
    incidents.closed_date as "incident_closed_date",
    statuses.name as "incident_status_name",
    statuses.id as "incident_status_id",
    incidents.attended_date as "incident_attended_date",
    incidents.closed_observation as "incident_closed_observation",
    incidents.attended_observation as "incident_attended_observation",
    service_centers.id as "incident_service_center_id",
    incidents.assigned_tormenta as "incident_assigned_tormenta_id",
    incidents.assigned_tormenta_datetime as "incident_assigned_tormenta_datetime",
    incidents.assigned_cuadrilla as "incident_assigned_cuadrilla",
    incidents.assigned_cuadrilla_datetime as "incident_assigned_cuadrilla_datetime",
    incidents.refuse_date as "incident_refuse_date",
    incidents.refuse_observation as "incident_refuse_observation"
        from "incidents" 
        inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
        inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
        inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        inner join settlements on settlements.id = "reports"."settlement_id"
        inner join statuses on statuses.id = incidents.status_id
        inner join citizens on citizens.id = reports.citizen_id
        left join durations on durations.id = reports.duration_id
        where "incidents"."active" = true 
        and "incidents"."created_at" between :initialDate and :finalDate
        and "reports"."active" = true 
        and "incidents"."active" = true 
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "reports"."codification_id" in (1, 2, 3)
        group by "incidents"."folio",
    incidents.created_at,
    incidents.updated_at,
    incidents.closed_date, statuses.name,
    incidents.attended_date,
    incidents.closed_observation,
    incidents.attended_observation,
    incidents.assigned_tormenta, incidents.assigned_tormenta_datetime,
    incidents.assigned_cuadrilla, incidents.assigned_cuadrilla_datetime, incidents.refuse_date, incidents.refuse_observation,
    service_centers.id, statuses.name, statuses.id
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsDatosAbiertosGetAllByDate: (startDate, finalDate) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `  select 
      incidents.id as "incident_id",
      "incidents"."folio" as "incident_folio",
      incidents.latitude as "incident_latitude",
      incidents.longitude as "incident_longitude",
      incidents.created_at as "incident_created_at",
     json_agg(json_build_object(
          'report_id', "reports".id:: varchar(255),
          'report_sequence', reports.sequence::varchar(255),
          'report_codification_id', reports.codification_id:: varchar(255),
          'report_codification_type_id',reports.codification_type_id:: varchar(255),
          'report_created_at', reports.created_at::varchar(255),
          'report_receipt_id', reports.receipt_id::varchar(255),
          'report_incident_id', reports.incident_id::varchar(255)
     )) as "reports"
         from "incidents" 
         inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
         left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
         inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
         left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
         inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
     left join floodings on floodings.incident_id = CASE WHEN incidents.id is not null THEN incidents.id ELSE null END
         inner join settlements on settlements.id = "reports"."settlement_id"
         inner join statuses on statuses.id = incidents.status_id
         inner join citizens on citizens.id = reports.citizen_id
         left join durations on durations.id = reports.duration_id
     inner join "receipts" on reports.receipt_id = receipts.id
     left join affectations on affectations.id = CASE WHEN reports.affectation_id is not null THEN reports.affectation_id ELSE null END
     left join flooding_reasons on flooding_reasons.id = CASE WHEN floodings.flooding_reason_id is not null THEN floodings.flooding_reason_id ELSE null END
         where "incidents"."active" = true 
         and "incidents"."created_at" between :initialDate and :finalDate
         and "reports"."active" = true 
         and "incidents"."active" = true 
         and "service_centers"."active" = true
     and receipts.active = true
         and "codifications"."active" = true
         and "reports"."codification_id" in (1, 2, 3)
         group by incidents.id,"incidents"."folio",
     incidents.created_at,
     incidents.updated_at,
     incidents.closed_date, statuses.name,
     incidents.attended_date,
     incidents.closed_observation,
     incidents.attended_observation,
     incidents.assigned_tormenta, incidents.assigned_tormenta_datetime,
     incidents.assigned_cuadrilla, incidents.assigned_cuadrilla_datetime, incidents.refuse_date, incidents.refuse_observation,
     service_centers.id, statuses.name, statuses.id,floodings.id,flooding_reasons.id `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsInconcertDatosAbiertosGetAllByDate: (startDate, finalDate) => {
    if (finalDate == "null") {
      finalDate = startDate;
    }
    const query = `
      select 
        folio,tipo_de_falla,latitude,longitude,fecha as fecha_creacion
      from incidents_inconcert 
      where fecha between :initialDate and :finalDate
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },
  incidentsTerritorialHidroanalisisFeaturesData: (
    codificationTypeId,
    statusId,
    startDate,
    endDate
  ) => {
    let andStatusId = "",
      andCodificationTypeId = "";

    if (codificationTypeId != "all") {
      andCodificationTypeId =
        " AND r.codification_type_id = " + codificationTypeId + " ";
    } else {
      andCodificationTypeId = " ";
    }

    if (statusId != "all") {
      andStatusId = " AND i.status_id IN (" + statusId + ") ";
    } else {
      andStatusId = "AND i.status_id IN ( 4,5,6,7,8,9) ";
    }

    const query = `SELECT   DISTINCT max(i.folio) folio,  max(i.latitude) latitude, max(i.longitude) longitude, max(m.municipality) municipality, max(m.real_id)   as municipality_id,  CONCAT( max(m.municipality),' ', max(s.settlement), ' ', max(r.address)) place, max(cts.codification_type) codification_type,  EXTRACT (epoch FROM max(i.created_at)) *1000 AS time, max(i.created_at) AS date, count(r.id)::INTEGER   as reports, 'Incidentes_Territorial' as name_layer, i.id as ObjectID, max(s.settlement) as settlement_name
    FROM incidents i 
    INNER JOIN "reports" r on i."folio" = r."incident_id"
    INNER JOIN "codification_types" cts ON cts.id=r.codification_type_id 
    INNER JOIN "municipalities" m ON m.real_id=r.municipality_id
    INNER JOIN "settlements" s ON s.id=r.settlement_id
    WHERE i.active=true
    ${andStatusId}
    AND r.active=true
    AND i.settlement_shape_id is not null
    AND i.created_at BETWEEN :initialDate AND :endDate
    ${andCodificationTypeId}
    GROUP BY i.folio, i.id
    ORDER BY max(i.folio) ASC;`;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        endDate: endDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },

  incidentsInconcertHidroanalisisFeaturesData: (
    codificationTypeId,
    statusId,
    startDate,
    endDate
  ) => {
    let andStatusId = "",
      andCodificationTypeId = "";

    if (codificationTypeId != "all") {
      switch (codificationTypeId) {
        case 1:
          andCodificationTypeId = " AND i.tipo_de_falla = 'Fuga'";

          break;
        case 2:
          andCodificationTypeId = " AND i.tipo_de_falla = 'Falta de agua'";

          break;
        case 9:
          andCodificationTypeId = " AND i.tipo_de_falla = 'Encharcamiento'";

          break;
        default:
          break;
      }
    } else {
      andCodificationTypeId = " ";
    }

    if (statusId != "all") {
      switch (statusId) {
        case 4:
        case 5:
        case 6:
        case 7:
          andStatusId = "AND (i.dictamen in ('PENDIENTES','PENDIENTE')) ";
          break;
        case 8:
        case 9:
          andStatusId = "AND (i.dictamen in ('SERVICIO NORMAL', 'ATENDIDA')) ";
          break;
        default:
          break;
      }
    } else {
      andStatusId =
        "AND (i.dictamen in ('PENDIENTES','PENDIENTE', 'SERVICIO NORMAL', 'ATENDIDA')) ";
    }

    const query = `SELECT   *
    FROM incidents_inconcert i 
    INNER JOIN "municipalities" m ON m.real_id=i.municipality_id
    INNER JOIN "settlements" s ON s.id=i.settlement_shape_id
    WHERE i.active=true
    ${andStatusId}
    AND i.active=true
    AND i.settlement_shape_id is not null
    AND i.fecha BETWEEN :initialDate AND :endDate
    ${andCodificationTypeId}

    ORDER BY i.folio ASC;`;

    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        endDate: endDate + " 23:59:59",
      },
      type: QueryTypes.SELECT,
    });
  },
  diarioencharcamientos: (startDate, finalDate, type) => {
    //type: 0->Todos los encharcamientos, 1->Vialidad Primaria, 2->Vialidad Secundaria
    let andWhere = "";

    if (type == 1) {
      andWhere = "and reports.details->>'roads' = '1'";
    }
    if (type == 2) {
      andWhere = "and reports.details->>'roads' = '2'";
    }

    const query = `
    select 
    a.municipality,
    count(distinct a.folio) as "subtotal_incidents",
    json_agg(DISTINCT jsonb_build_object(
        'folio', a.folio:: varchar(255),
        'status_id', a.status_id,
        'finished',a.finished,
        'external_number',a.external_number:: varchar(255),
        'internal_number',a.internal_number:: varchar(255),
        'manzana',a.manzana:: varchar(255),
        'lote',a.lote:: varchar(255),
        'receipt', a.receipt:: varchar(255),
        'municipality', "a".municipality:: varchar(255),
        'settlement', a.settlement:: varchar(255),
        'address', a.address:: varchar(255),
        'btw_street_first',COALESCE (CAST( a.btw_street_first AS varchar), ''):: varchar(255),
        'btw_street_second', COALESCE (CAST( a.btw_street_second AS varchar), ''):: varchar(255),
        'corner', COALESCE (CAST( a.corner AS varchar), ''):: varchar(255),
        'start_date', COALESCE (CAST(a.report_created_at AS varchar), 'En proceso'):: varchar(255),
        'arrive', COALESCE (CAST(a.arrival AS varchar), 'En proceso'):: varchar(255),
        'finished_date', COALESCE (CAST(a.finished_date AS varchar),'En proceso'):: varchar(255),
        'long',a.long:: varchar(255),
        'width',a.width:: varchar(255),
        'tirante',a.tirante:: varchar(255),
		'reason',COALESCE (a.flooding_reasons_name, 'En proceso'):: varchar(255),
        'operators', a.clave_radio
    )) as "incidents"
    from ( select 
              distinct (incidents.folio),
              ROW_NUMBER() OVER(PARTITION BY incidents.folio) as row_number,
              incidents.created_at,reports.address,
              reports.closed_observation,
              citizens.fullname,settlements.settlement,
              reports.manzana,reports.lote,reports.external_number,
              reports.internal_number,
              reports.created_at as report_created_at,
              municipalities.municipality,
              codification_types.codification_type,citizens.phone1,
              reports.reference,reports.status_id,
              floodings.finished, receipts.receipt,
              COALESCE (CAST( reports.btw_street_first AS varchar), '') btw_street_first,
              COALESCE (CAST( reports.btw_street_second AS varchar), '') btw_street_second,
              COALESCE (CAST( reports.corner AS varchar), '') corner,
              COALESCE (CAST(floodings.arrival AS varchar), 'En proceso') arrival,
              COALESCE (CAST(floodings.finished_date AS varchar),'En proceso') finished_date,
              reports.details->>'long' long,
              reports.details->>'width' width,
              reports.details->>'tirante' tirante,
              COALESCE (flooding_reasons.name, 'En proceso') flooding_reasons_name,
              COALESCE ( operators.clave_radio, 'Sin clave de radio') clave_radio
              from incidents
              inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
              left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
              inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
              left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
              inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
              inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
              inner join "receipts" on reports.receipt_id = receipts.id
              inner join floodings on floodings.incident_id = incidents.id
              left join flooding_reasons on flooding_reasons.id = CASE WHEN floodings.flooding_reason_id is not null THEN floodings.flooding_reason_id ELSE null END
              left join users on users.id = CASE WHEN floodings.operator_id is not null THEN floodings.operator_id ELSE null END
              left join operators on operators.user_id = CASE WHEN users.id is not null THEN users.id ELSE null END
              inner join citizens on reports.citizen_id = citizens.id
              where incidents.active = true
              and reports.active = true
              and service_centers.active = true
              and codifications.active = true
              and codification_types.active = true
              and municipalities.active = true
              and settlements.active = true
              and receipts.active = true
              and floodings.active = true
              and incidents.status_id != 10
              and incidents.group_id in(7)
              and reports.codification_type_id in (9)
              ${andWhere}
              and incidents.created_at 
              between :initialDate
              and :finalDate

        ) a
        where a.row_number = 1
    group by a.municipality
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },

  relacionpendientes: (startDate, finalDate, codification_type_id) => {
    const query = `
    select 
    a.municipality,
      count(distinct a.folio) as "subtotal_incidents",
   json_agg(DISTINCT jsonb_build_object (
            'folio', a.folio:: varchar(255),
            'created_at', a.created_at::varchar(255),
            'address', a.address:: varchar(255),
            'manzana', (CASE WHEN (a.manzana IS NULL) THEN '' ELSE concat('Mz. ',a.manzana)END):: varchar(255),
            'lote', (CASE WHEN (a.lote IS NULL) THEN '' ELSE concat('Lt. ',a.lote)END):: varchar(255),
            'internal_number', (CASE WHEN (a.internal_number IS NULL) THEN '' ELSE concat('#Int. ',a.internal_number)END):: varchar(255),
            'external_number', (CASE WHEN (a.external_number IS NULL) THEN '' ELSE concat('#Ext. ',a.external_number)END):: varchar(255),
            'btw_street_first',COALESCE (CAST( a.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
            'btw_street_second', COALESCE (CAST( a.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
            'corner', COALESCE (CAST( a.corner AS varchar), 'Sin dato'):: varchar(255),
            'closed_observation', COALESCE (CAST( a.closed_observation AS varchar), 'Sin dato'):: varchar(255),
            'citizen_fullname', a.fullname,
            'settlement', a.settlement:: varchar(255),
            'municipality', "a".municipality:: varchar(255),
            'service_center',a.name::varchar(255),
            'codification_type',a.codification_type,
            'phone',a.phone1,
            'reference', COALESCE (CAST( a.reference AS varchar), 'Sin dato'):: varchar(255)
        )) as "incidents"
      
    from (
      select
      distinct (incidents.folio),
      ROW_NUMBER() OVER(PARTITION BY incidents.folio) as row_number,
      incidents.created_at,reports.address,reports.btw_street_first,
      reports.btw_street_second,reports.closed_observation,citizens.fullname,settlements.settlement,reports.corner,
      reports.manzana,reports.lote,reports.external_number,reports.internal_number,
      municipalities.municipality,service_centers.name,codification_types.codification_type,citizens.phone1,reports.reference
        from incidents
        inner join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        inner join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
        inner join citizens on reports.citizen_id = citizens.id
        inner join users on users.id = reports.created_by
        inner join "receipts" on reports.receipt_id = receipts.id
        where incidents.active = true
        and reports.active = true
        and service_centers.active = true
        and codifications.active = true
        and codification_types.active = true
        and municipalities.active = true
        and settlements.active = true
        and receipts.active = true
        and incidents.status_id != 10
        and incidents.status_id != 9
        and reports.codification_id in (1)
        and reports.codification_type_id in (:codification_type_id)
      and "incidents"."status_id" in (3,4,5,6,7)
      and "incidents"."close_id" is null
        and "incidents"."refuse_id" is null
      and incidents.created_at
        between :initialDate
        and :finalDate
    ) a
  where a.row_number = 1
  group by a.municipality
  
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        codification_type_id,
      },
      type: QueryTypes.SELECT,
    });
  },
  solicitudespipas: (startDate, finalDate) => {
    const query = `
    select 
    a.municipality,
      count(distinct a.folio) as "subtotal_incidents",
   json_agg(DISTINCT jsonb_build_object (
	   		'pipa',a.supply_id,
	   		'stores',a.store,
	   		'capacity',a.size_id,
	   		'meters',a.hose_id,
            'folio', a.folio:: varchar(255),
            'created_at', a.created_at::varchar(255),
            'address', a.address:: varchar(255),
            'manzana', (CASE WHEN (a.manzana IS NULL) THEN '' ELSE concat('Mz. ',a.manzana)END):: varchar(255),
            'lote', (CASE WHEN (a.lote IS NULL) THEN '' ELSE concat('Lt. ',a.lote)END):: varchar(255),
            'internal_number', (CASE WHEN (a.internal_number IS NULL) THEN '' ELSE concat('#Int. ',a.internal_number)END):: varchar(255),
            'external_number', (CASE WHEN (a.external_number IS NULL) THEN '' ELSE concat('#Ext. ',a.external_number)END):: varchar(255),
            'btw_street_first',COALESCE (CAST( a.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
            'btw_street_second', COALESCE (CAST( a.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
            'closed_observation', COALESCE (CAST( a.closed_observation AS varchar), 'Sin dato'):: varchar(255),
            'citizen_fullname', a.fullname,
            'settlement', a.settlement:: varchar(255),
            'municipality', "a".municipality:: varchar(255),
            'service_center',a.name::varchar(255),
            'codification_type',a.codification_type,
            'phone',a.phone1,
            'reference', COALESCE (CAST( a.reference AS varchar), 'Sin dato'):: varchar(255)
        )) as "incidents"
      
    from (
      select
      distinct (incidents.folio),
      ROW_NUMBER() OVER(PARTITION BY incidents.folio) as row_number,
      incidents.created_at,reports.address,reports.btw_street_first,
      reports.btw_street_second,reports.closed_observation,citizens.fullname,settlements.settlement,
      reports.manzana,reports.lote,reports.external_number,reports.internal_number,
      municipalities.municipality,service_centers.name,codification_types.codification_type,citizens.phone1,reports.reference
        ,reports.details->>'supply_id' as supply_id, stores.store
		,reports.details->>'size_id' as size_id
		,reports.details->>'hose_id' as hose_id
		from incidents
        inner join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        inner join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
        inner join citizens on reports.citizen_id = citizens.id
        inner join users on users.id = reports.created_by
        inner join "receipts" on reports.receipt_id = receipts.id
		inner join stores on reports.details->>'supply_id' = CAST( stores.id AS varchar)
        where incidents.active = true
        and reports.active = true
        and service_centers.active = true
        and codifications.active = true
        and codification_types.active = true
        and municipalities.active = true
        and settlements.active = true
        and receipts.active = true
        and incidents.status_id != 10
        and incidents.status_id != 9
        and reports.codification_id in (1)
        and reports.codification_type_id in (2)
      and "incidents"."status_id" in (3,4,5,6,7)
      and "incidents"."close_id" is null
        and "incidents"."refuse_id" is null
		 and reports.details->>'supply_id' = '1'
      and incidents.created_at
        between :initialDate
        and :finalDate
    ) a
  where a.row_number = 1
  group by a.municipality
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  cortesfaltasagua: (startDate, finalDate) => {
    const query = `
    select municipalities.municipality,
    COALESCE(a.subtotal_incidents,0) as incidentsCount
    from municipalities
    left join
    (
       select 
         municipalities.municipality,
         count(distinct incidents.folio) as "subtotal_incidents"  
        from incidents
          inner join "reports" on "incidents"."folio" = "reports"."incident_id"
          left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
          inner join "codifications" on "codifications"."id" = "reports"."codification_id"
          left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
          left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
          inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
          inner join citizens on reports.citizen_id = citizens.id
          inner join users on users.id = reports.created_by
          inner join "receipts" on reports.receipt_id = receipts.id
          where incidents.active = true
          and reports.active = true
          and service_centers.active = true
          and codifications.active = true
          and codification_types.active = true
          and municipalities.active = true
          and settlements.active = true
          and receipts.active = true
          and incidents.status_id != 10
          and incidents.status_id != 9
          and reports.codification_id in (1)
          and reports.codification_type_id in (2)
        and incidents.created_at
          between :initialDate
          and :finalDate
    group by municipalities.municipality
    ) "a"
    on "a".municipality = municipalities.municipality
   order by municipalities.municipality`;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  reportesdrenaje: (startDate, finalDate) => {
    const query = `
        select distinct  "service_centers"."name",
        COALESCE("h"."count",0) "incidents_total_camp",
        COALESCE("i"."count",0) "incidents_not_received_camp",
        COALESCE( COALESCE(CAST("h"."count" AS INTEGER),0)-COALESCE(CAST("i"."count" AS INTEGER),0)-COALESCE(CAST("n"."count" AS INTEGER),0)-COALESCE(CAST("j"."count" AS INTEGER),0)-COALESCE(CAST("k"."count" AS INTEGER),0)-COALESCE(CAST("l"."count" AS INTEGER),0)) "incidents_process_camp",
        COALESCE( COALESCE(CAST("j"."count" AS INTEGER),0)+COALESCE(CAST("k"."count" AS INTEGER),0)+COALESCE(CAST("l"."count" AS INTEGER),0)) "incidents_inexists_wrong_location_dup_camp",
        COALESCE("n"."count",0) "incidents_repaired_camp",
        COALESCE("m"."count",0) "incidents_pending_camp"
        from service_centers
        -- CONSULTA TOTAL RECIBIDOS POR CODIFICACION
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        group by service_centers.name
        order by service_centers.name ) "h" ON "service_centers"."name" = "h"."name"
        --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        and (("incidents"."status_id"  in(3)
        and "incidents"."assigned_tormenta" is null
        and "incidents"."assigned_cuadrilla" is null)
        or ("incidents"."status_id" in(6)
        and "incidents"."assigned_tormenta" is null
        and "incidents"."assigned_cuadrilla" is null)
        or("incidents"."status_id" in(4)
        and "incidents"."assigned_tormenta" is null
        and "incidents"."assigned_cuadrilla" is null)
        and "incidents"."close_id" is null
        and "incidents"."refuse_id" is null
        )
        group by service_centers.name
        order by service_centers.name ) "i" ON "service_centers"."name" = "i"."name"
        -- CONSULTA REPORTES INEXISTENTES, DUPLICADOS Y MALAS UBICACIONES
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        and (("incidents"."status_id"  in(10)
        and "incidents"."close_id" in (1))
        or ("incidents"."status_id" in(9)
        and "incidents"."close_id" in (1))
        )
        group by service_centers.name
        order by service_centers.name ) "j" ON "service_centers"."name" = "j"."name"
        -- CONSULTA REPORTES MALA UBICACIÓN
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        and "reports"."duplicated" = false
        and incidents.status_id != 10
        and (("incidents"."status_id"  in(10)
        and "incidents"."refuse_id" in (3))
        or ("incidents"."close_id" in (6))
        )
        group by service_centers.name
        order by service_centers.name ) "k" ON "service_centers"."name" = "k"."name"
        -- CONSULTA REPORTES DUPLICADOS
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        and (("incidents"."status_id"  in(10)
        and "incidents"."close_id" in (13))
        or ("incidents"."status_id"  in(9)
        and "incidents"."close_id" in (13))
        )
        group by service_centers.name
        order by service_centers.name ) "l" ON "service_centers"."name" = "l"."name"
        -- CONSULTA FUGAS PENDIENTES
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        and "incidents"."status_id" in(3,4,5,6,7)
        group by service_centers.name
        order by "service_centers"."name") "m" ON "service_centers"."name" = "m"."name"
        -- CONSULTA REPORTES REPARADOS
        LEFT JOIN (
        Select
        service_centers."name",
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        left join "groups" on "groups"."id" = "incidents"."group_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "reports"."active" = true
        and "groups"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (7)
        and "reports"."codification_type_id" in (7, 8, 9, 10, 11, 12, 13, 14, 15, 29, 30, 32, 33)
        and "incidents"."status_id"  in(9)
        and "incidents"."close_id" in (12)
        group by service_centers.name
        order by "service_centers"."name") "n" ON "service_centers"."name" = "n"."name"
        where  
        service_centers.group_id in (7)
        and service_centers.active = true
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  encharcamientosxalcaldia: (startDate, finalDate) => {
    const query = `
    select 
    municipalities.municipality,
    count(incidents.folio) as "subtotal_incidents",
    json_agg(json_build_object(
        'folio', incidents.folio:: varchar(255),
        'finished',floodings.finished,
        'municipality', "municipalities".municipality:: varchar(255),
        'settlement', settlements.settlement:: varchar(255),
        'address', reports.address:: varchar(255),
        'btw_street_first',COALESCE (CAST( reports.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
        'btw_street_second', COALESCE (CAST( reports.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
        'arrive', COALESCE (CAST(floodings.arrival AS varchar), 'En proceso'):: varchar(255),
        'finished_date', COALESCE (CAST(floodings.finished_date AS varchar),'En proceso'):: varchar(255),
        'long',reports.details->>'long':: varchar(255),
        'width',reports.details->>'width':: varchar(255),
        'tirante',reports.details->>'tirante':: varchar(255),
        'reason',COALESCE (flooding_reasons.name, 'En proceso'):: varchar(255),
        'created_at',to_char(incidents."created_at", :formatDate)
    )) as "incidents"
    from incidents
      inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
      inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
      inner join "receipts" on reports.receipt_id = receipts.id
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = CASE WHEN floodings.flooding_reason_id is not null THEN floodings.flooding_reason_id ELSE null END
      left join users on users.id = CASE WHEN floodings.operator_id is not null THEN floodings.operator_id ELSE null END
      where incidents.active = true
      and reports.active = true
      and service_centers.active = true
      and codifications.active = true
      and codification_types.active = true
      and municipalities.active = true
      and settlements.active = true
      and receipts.active = true
      and floodings.active = true
      and incidents.status_id != 10
      and incidents.group_id in(7)
      and reports.codification_type_id in (9)
      and incidents.created_at 
      between :initialDate
      and :finalDate
    group by municipalities.municipality;
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        formatDate: "YYYY-MM-DD HH:MM:SS",
      },
      type: QueryTypes.SELECT,
    });
  },
  prediosafectados: (startDate, finalDate) => {
    const query = `
    select
    municipalities.municipality,
      count(incidents.folio) as "subtotal_incidents",
      json_agg( json_build_object(
                  'municipality', "municipalities".municipality:: varchar(255),
                  'folio', incidents.folio ::varchar(255),
                  'address',reports.address ::varchar(255),
                  'btw_street_first', COALESCE (CAST( reports.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
                  'btw_street_second',  COALESCE (CAST( reports.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
                  'settlement', settlements.settlement::varchar(255),
                  'created_at', incidents.created_at ::varchar(255),
                  'codification_type',codification_types.codification_type,
                  'finished_date', COALESCE (CAST(floodings.finished_date AS varchar),'En proceso'):: varchar(255),
                  'reference', COALESCE (CAST( reports.reference AS varchar), 'Sin dato'):: varchar(255),
                  'number_property',COALESCE(number_property,0)::varchar(255)
       )) as "incidents"
              from incidents
              left Join reports on incidents.folio  = reports.incident_id
              inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
              inner Join settlements on reports.settlement_id = settlements.id
              inner join floodings on floodings.incident_id = incidents.id
              left Join service_centers on service_centers.id = incidents.service_center_id
              join codifications on codifications.id = reports.codification_id
              left Join codification_types on codification_types.id = reports.codification_type_id
        where incidents.active = true
              and incidents.status_id != 10
              and incidents.group_id =7
        and incidents.created_at >= :initialDate
              and incidents.created_at <= :finalDate
              and reports.codification_type_id = 9
              and reports.codification_id = 2
              and reports.active = true
              and incidents.active = true
              and service_centers.active = true
      group by  municipalities.municipality
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        formatDate: "YYYY-MM-DD HH:MM:SS",
      },
      type: QueryTypes.SELECT,
    });
  },
  encharcamientosxalcaldiaxtipofalla: (startDate, finalDate) => {
    const query = `
    select distinct  municipalities.municipality,
    COALESCE("a"."count", 0) "a",
    COALESCE("b"."count", 0) "b",
    COALESCE("c"."count", 0) "c",
    COALESCE("d"."count", 0) "d",
    COALESCE("e"."count", 0) "e",
    COALESCE("f"."count", 0) "f",
    COALESCE("g"."count", 0) "g",
    COALESCE("h"."count", 0) "h",
    COALESCE("i"."count", 0) "i",
    COALESCE("j"."count", 0) "j",
    COALESCE("k"."count", 0) "k",
    (COALESCE(CAST("a"."count" AS INTEGER),0)+
    COALESCE(CAST("b"."count" AS INTEGER),0)+
    COALESCE(CAST("c"."count" AS INTEGER),0)+
    COALESCE(CAST("d"."count" AS INTEGER),0)+
    COALESCE(CAST("e"."count" AS INTEGER),0)+
    COALESCE(CAST("f"."count" AS INTEGER),0)+
    COALESCE(CAST("g"."count" AS INTEGER),0)+
    COALESCE(CAST("h"."count" AS INTEGER),0)+
    COALESCE(CAST("i"."count" AS INTEGER),0)+
    COALESCE(CAST("j"."count" AS INTEGER),0)+
    COALESCE(CAST("k"."count" AS INTEGER),0)) "subtotal"
  
  from  municipalities
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 1
      group by municipalities."municipality") "a" ON municipalities."municipality" = "a"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 2
      group by municipalities."municipality") "b" ON municipalities."municipality" = "b"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 3
      group by municipalities."municipality") "c" ON municipalities."municipality" = "c"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 4
      group by municipalities."municipality") "d" ON municipalities."municipality" = "d"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 5
      group by municipalities."municipality") "e" ON municipalities."municipality" = "e"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 6
      group by municipalities."municipality") "f" ON municipalities."municipality" = "f"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 7
      group by municipalities."municipality") "g" ON municipalities."municipality" = "g"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 8
      group by municipalities."municipality") "h" ON municipalities."municipality" = "h"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 9
      group by municipalities."municipality") "i" ON municipalities."municipality" = "i"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 10
      group by municipalities."municipality") "j" ON municipalities."municipality" = "j"."municipality"
  left join(
  select
      municipalities."municipality", count (distinct incidents."folio") 
      from "incidents"
      left join "reports" on "incidents"."folio" = "reports"."incident_id"
      inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      inner join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      inner join floodings on floodings.incident_id = incidents.id
      left join flooding_reasons on flooding_reasons.id = floodings.flooding_reason_id
      where "incidents"."active" = true
      and "incidents"."status_id" != 10
      and "incidents"."group_id" = 7
      and floodings.active = true
      and flooding_reasons.active = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."codification_type_id" = 9
      and "reports"."codification_id" in (2)
      and "reports"."active" = true
      and "service_centers"."active" = true
      and floodings.flooding_reason_id = 11
      group by municipalities."municipality") "k" ON municipalities."municipality" = "k"."municipality"
  
  where municipalities.active = true
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  resumenacumuladogeneralencharcamientos: (startDate, finalDate) => {
    const query = `

    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  reportespendientesperiodo: (
    startDate,
    finalDate,
    codificationType,
    serviceCenter,
    municipality
  ) => {
    if (
      codificationType == "null" ||
      codificationType == null ||
      codificationType == "undefined" ||
      codificationType == undefined
    ) {
      codificationType = "";
    } else {
      codificationType =
        "and reports.codification_type_id in (" + codificationType + ")";
    }

    if (
      serviceCenter == "null" ||
      serviceCenter == null ||
      serviceCenter == "undefined" ||
      serviceCenter == undefined
    ) {
      serviceCenter = "";
    } else {
      serviceCenter = " and service_centers.id in (" + serviceCenter + ")";
    }

    if (
      municipality == "null" ||
      municipality == null ||
      municipality == "undefined" ||
      municipality == undefined
    ) {
      municipality = "";
    } else {
      municipality = " and reports.municipality_id in (" + municipality + ")";
    }

    const query = `
    select 
    a.service_centers_name,
      count(distinct a.folio) as "subtotal_incidents",
   json_agg(DISTINCT jsonb_build_object (
            'folio', a.folio:: varchar(255),
            'created_at', a.created_at::varchar(255),
            'address', a.address:: varchar(255),
            'manzana', (CASE WHEN (a.manzana IS NULL) THEN '' ELSE concat('Mz. ',a.manzana)END):: varchar(255),
            'lote', (CASE WHEN (a.lote IS NULL) THEN '' ELSE concat('Lt. ',a.lote)END):: varchar(255),
            'internal_number', (CASE WHEN (a.internal_number IS NULL) THEN '' ELSE concat('#Int. ',a.internal_number)END):: varchar(255),
            'external_number', (CASE WHEN (a.external_number IS NULL) THEN '' ELSE concat('#Ext. ',a.external_number)END):: varchar(255),
            'btw_street_first',COALESCE (CAST( a.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
            'btw_street_second', COALESCE (CAST( a.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
            'corner', COALESCE (CAST( a.corner AS varchar), 'Sin dato'):: varchar(255),
            'closed_observation', COALESCE (CAST( a.closed_observation AS varchar), 'Sin dato'):: varchar(255),
            'citizen_fullname', a.fullname,
            'settlement', a.settlement:: varchar(255),
            'municipality', "a".municipality:: varchar(255),
            'service_center',a.service_centers_name::varchar(255),
            'codification_type',a.codification_type,
            'phone',a.phone1,
            'reference', COALESCE (CAST( a.reference AS varchar), 'Sin dato'):: varchar(255)
        )) as "incidents"
      
    from (
      select
      distinct (incidents.folio),
      ROW_NUMBER() OVER(PARTITION BY incidents.folio) as row_number,
      incidents.created_at,reports.address,reports.btw_street_first,
      reports.btw_street_second,reports.closed_observation,citizens.fullname,settlements.settlement,reports.corner,
      reports.manzana,reports.lote,reports.external_number,reports.internal_number,
      municipalities.municipality,service_centers.name as service_centers_name,codification_types.codification_type,citizens.phone1,reports.reference
        from incidents
        inner join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        inner join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        inner join "settlements" on "settlements"."id" = "reports"."settlement_id"
        inner join citizens on reports.citizen_id = citizens.id
        inner join users on users.id = reports.created_by
        inner join "receipts" on reports.receipt_id = receipts.id
        where incidents.active = true
        and reports.active = true
        and service_centers.active = true
        and codifications.active = true
        and codification_types.active = true
        and municipalities.active = true
        and settlements.active = true
        and receipts.active = true
        and incidents.status_id != 10
        and incidents.status_id != 9
        ${codificationType}
        ${serviceCenter}
        ${municipality}
      and "incidents"."status_id" in (3,4,5,6,7)
      and "incidents"."close_id" is null
        and "incidents"."refuse_id" is null
      and incidents.created_at
        between :initialDate
        and :finalDate
    ) a
    where a.row_number = 1
  group by a.service_centers_name
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  analisisgeneralaguapotable: (startDate, finalDate) => {
    const query = `
    select * from (select
      'Fuga (Alcaldías) *' as "codification_type",
      COALESCE("a"."count",0) "incidents_total",
      COALESCE("b"."count",0) "incidents_not_received",
      COALESCE("c"."count",0) "incidents_inexists",
      COALESCE("d"."count",0) "incidents_wrong_location",
      COALESCE("e"."count",0) "incidents_duplicated",
    
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
            COALESCE(CAST("c"."count" AS INTEGER),0)-
            COALESCE(CAST("d"."count" AS INTEGER),0)-
            COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_neto",
    
      COALESCE("f"."count",0) "incidents_repaired",
    
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
            COALESCE(CAST("c"."count" AS INTEGER),0)-
            COALESCE(CAST("d"."count" AS INTEGER),0)-
            COALESCE(CAST("e"."count" AS INTEGER),0)-
            COALESCE("f"."count",0)
            ) "incidents_process"
      from codification_types
      --Consulta total recibidos por codificacion
      LEFT JOIN (
      select "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
    and "codification_types"."id" = 1
    and "incidents"."group_id" = 5
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type"  ) "a" ON "codification_types"."codification_type" = "a"."codification_type"
       --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
      LEFT JOIN (
      select
          "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(3)
      and "incidents"."assigned_tormenta" is null
      and "incidents"."assigned_cuadrilla" is null)
      or ("incidents"."status_id" in(6)
      and "incidents"."assigned_tormenta" is null
      and "incidents"."assigned_cuadrilla" is null)
      or("incidents"."status_id" in(4)
      and "incidents"."assigned_tormenta" is null
      and "incidents"."assigned_cuadrilla" is null)
      and "incidents"."close_id" is null
      and "incidents"."refuse_id" is null
      )
    and "incidents"."group_id" = 5
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type" ) "b" ON "codification_types"."codification_type" = "b"."codification_type"
      -- CONSULTA REPORTES INEXISTENTES
      LEFT JOIN (
      select
          "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(10)
      and "incidents"."close_id" in (1))
      or ("incidents"."status_id" in(9)
      and "incidents"."close_id" in (1))
      )
    and "incidents"."group_id" = 5
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "c" ON "codification_types"."codification_type" = "c"."codification_type"
      -- CONSULTA REPORTES MALA UBICACIÓN
      LEFT JOIN (
      select "codification_types"."codification_type", count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(10)
      and "incidents"."refuse_id" in (3))
      or ("incidents"."close_id" in (6))
      )
    and "incidents"."group_id" = 5
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "d" ON "codification_types"."codification_type" = "d"."codification_type"
      -- CONSULTA REPORTES DUPLICADOS
      LEFT JOIN (
      select "codification_types"."codification_type", count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(10)
      and "incidents"."close_id" in (13))
      or ("incidents"."status_id"  in(9)
      and "incidents"."close_id" in (13))
      )
    and "incidents"."group_id" = 5
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "e" ON "codification_types"."codification_type" = "e"."codification_type"
      -- CONSULTA REPORTES REPARADOS
      LEFT JOIN (
      select
          "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and "incidents"."status_id"  in(9)
      and "incidents"."close_id" in (12)
    and "codification_types"."id" = 1
    and "incidents"."group_id" = 5
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "f" ON "codification_types"."codification_type" = "f"."codification_type"
      where "codification_types"."codification_id" in (1)
    and "codification_types"."id" = 1
      and codification_types.active = true
    UNION ALL 
     select
      'Fuga (SACMEX)' as "codification_type",
      COALESCE("a"."count",0) "incidents_total",
      COALESCE("b"."count",0) "incidents_not_received",
      COALESCE("c"."count",0) "incidents_inexists",
      COALESCE("d"."count",0) "incidents_wrong_location",
      COALESCE("e"."count",0) "incidents_duplicated",
    
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
            COALESCE(CAST("c"."count" AS INTEGER),0)-
            COALESCE(CAST("d"."count" AS INTEGER),0)-
            COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_neto",
    
      COALESCE("f"."count",0) "incidents_repaired",
    
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
            COALESCE(CAST("c"."count" AS INTEGER),0)-
            COALESCE(CAST("d"."count" AS INTEGER),0)-
            COALESCE(CAST("e"."count" AS INTEGER),0)-
            COALESCE("f"."count",0)
            ) "incidents_process" from codification_types
      --Consulta total recibidos por codificacion
      LEFT JOIN (
      select "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
    and "codification_types"."id" = 1
    and "incidents"."group_id" = 1
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type"  ) "a" ON "codification_types"."codification_type" = "a"."codification_type"
       --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
      LEFT JOIN (
      select
          "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(3)
      and "incidents"."assigned_tormenta" is null
      and "incidents"."assigned_cuadrilla" is null)
      or ("incidents"."status_id" in(6)
      and "incidents"."assigned_tormenta" is null
      and "incidents"."assigned_cuadrilla" is null)
      or("incidents"."status_id" in(4)
      and "incidents"."assigned_tormenta" is null
      and "incidents"."assigned_cuadrilla" is null)
      and "incidents"."close_id" is null
      and "incidents"."refuse_id" is null
      )
    and "incidents"."group_id" = 1
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type" ) "b" ON "codification_types"."codification_type" = "b"."codification_type"
      -- CONSULTA REPORTES INEXISTENTES
      LEFT JOIN (
      select
          "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(10)
      and "incidents"."close_id" in (1))
      or ("incidents"."status_id" in(9)
      and "incidents"."close_id" in (1))
      )
    and "incidents"."group_id" = 1
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "c" ON "codification_types"."codification_type" = "c"."codification_type"
      -- CONSULTA REPORTES MALA UBICACIÓN
      LEFT JOIN (
      select "codification_types"."codification_type", count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(10)
      and "incidents"."refuse_id" in (3))
      or ("incidents"."close_id" in (6))
      )
    and "incidents"."group_id" = 1
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "d" ON "codification_types"."codification_type" = "d"."codification_type"
      -- CONSULTA REPORTES DUPLICADOS
      LEFT JOIN (
      select "codification_types"."codification_type", count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and (("incidents"."status_id"  in(10)
      and "incidents"."close_id" in (13))
      or ("incidents"."status_id"  in(9)
      and "incidents"."close_id" in (13))
      )
    and "incidents"."group_id" = 1
    and "codification_types"."id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "e" ON "codification_types"."codification_type" = "e"."codification_type"
      -- CONSULTA REPORTES REPARADOS
      LEFT JOIN (
      select
          "codification_types"."codification_type",
          count(distinct incidents.folio) "count"
      from "incidents"
       left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "incidents"."created_at" >=  :initialDate
      and "incidents"."created_at" <=  :finalDate
      and "reports"."active" = true
      and "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" = true
      and "reports"."duplicated" = false
      and incidents.status_id != 10
      and "reports"."codification_id" in (1)
      and "incidents"."status_id"  in(9)
      and "incidents"."close_id" in (12)
    and "codification_types"."id" = 1
    and "incidents"."group_id" = 1
      group by "codification_types"."codification_type"
      order by "codification_types"."codification_type") "f" ON "codification_types"."codification_type" = "f"."codification_type"
      where "codification_types"."codification_id" in (1)
    and "codification_types"."id" = 1
      and codification_types.active = true
  UNION ALL select
  -- Editar aqui
    --COALESCE( CASE WHEN "a"."codification_type" = 'Fuga' THEN 'Fuga (SACMEX)' ELSE "a"."codification_type" END,CASE WHEN "codification_types"."codification_type" = 'Fuga' THEN 'Fuga (SACMEX)' ELSE "codification_types"."codification_type" END) "codification_type",
    COALESCE("a"."codification_type", "codification_types"."codification_type") "codification_type",
      COALESCE("a"."count",0) "incidents_total",
      COALESCE("b"."count",0) "incidents_not_received",
      COALESCE("c"."count",0) "incidents_inexists",
      COALESCE("d"."count",0) "incidents_wrong_location",
      COALESCE("e"."count",0) "incidents_duplicated",
    
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
            COALESCE(CAST("c"."count" AS INTEGER),0)-
            COALESCE(CAST("d"."count" AS INTEGER),0)-
            COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_neto",
    
      COALESCE("f"."count",0) "incidents_repaired",
    
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
            COALESCE(CAST("c"."count" AS INTEGER),0)-
            COALESCE(CAST("d"."count" AS INTEGER),0)-
            COALESCE(CAST("e"."count" AS INTEGER),0)-
            COALESCE("f"."count",0)
            ) "incidents_process" from codification_types
    --Consulta total recibidos por codificacion
    LEFT JOIN (
    select
        "codification_types"."codification_type",
        count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and incidents.status_id != 10
    and "reports"."codification_id" in (1)
        and "incidents"."group_id" != 5
  and	 "codification_types"."id" != 1
    group by "codification_types"."codification_type"
    order by "codification_types"."codification_type" ) "a" ON "codification_types"."codification_type" = "a"."codification_type"
   --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
    LEFT JOIN (
    select
        "codification_types"."codification_type",
        count(distinct incidents.folio) "count"
    from "incidents"
     left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and incidents.status_id != 10
    and "reports"."codification_id" in (1)
    and (("incidents"."status_id"  in(3)
    and "incidents"."assigned_tormenta" is null
    and "incidents"."assigned_cuadrilla" is null)
    or ("incidents"."status_id" in(6)
    and "incidents"."assigned_tormenta" is null
    and "incidents"."assigned_cuadrilla" is null)
    or("incidents"."status_id" in(4)
    and "incidents"."assigned_tormenta" is null
    and "incidents"."assigned_cuadrilla" is null)
    and "incidents"."close_id" is null
    and "incidents"."refuse_id" is null
    )
        and "incidents"."group_id" != 5
    and	 "codification_types"."id" != 1
    group by "codification_types"."codification_type"
    order by "codification_types"."codification_type" ) "b" ON "codification_types"."codification_type" = "b"."codification_type"
    -- CONSULTA REPORTES INEXISTENTES
    LEFT JOIN (
    select
        "codification_types"."codification_type",
        count(distinct incidents.folio) "count"
    from "incidents"
     left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and incidents.status_id != 10
  and	 "codification_types"."id" != 1
    and "reports"."codification_id" in (1)
    and (("incidents"."status_id"  in(10)
    and "incidents"."close_id" in (1))
    or ("incidents"."status_id" in(9)
    and "incidents"."close_id" in (1))
    )
    group by "codification_types"."codification_type"
    order by "codification_types"."codification_type") "c" ON "codification_types"."codification_type" = "c"."codification_type"
    -- CONSULTA REPORTES MALA UBICACIÓN
    LEFT JOIN (
    select "codification_types"."codification_type", count(distinct incidents.folio) "count"
    from "incidents"
     left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and incidents.status_id != 10
    and	 "codification_types"."id" != 1
    and "reports"."codification_id" in (1)
    and (("incidents"."status_id"  in(10)
    and "incidents"."refuse_id" in (3))
    or ("incidents"."close_id" in (6))
    )
        and "incidents"."group_id" != 5
    group by "codification_types"."codification_type"
    order by "codification_types"."codification_type") "d" ON "codification_types"."codification_type" = "d"."codification_type"
    -- CONSULTA REPORTES DUPLICADOS
    LEFT JOIN (
    select "codification_types"."codification_type", count(distinct incidents.folio) "count"
    from "incidents"
     left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and incidents.status_id != 10
    and	 "codification_types"."id" != 1
    and "reports"."codification_id" in (1)
    and (("incidents"."status_id"  in(10)
    and "incidents"."close_id" in (13))
    or ("incidents"."status_id"  in(9)
    and "incidents"."close_id" in (13))
    )
        and "incidents"."group_id" != 5
    group by "codification_types"."codification_type"
    order by "codification_types"."codification_type") "e" ON "codification_types"."codification_type" = "e"."codification_type"
    -- CONSULTA REPORTES REPARADOS
    LEFT JOIN (
    select
        "codification_types"."codification_type",
        count(distinct incidents.folio) "count"
    from "incidents"
     left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and "reports"."active" = true
    and "incidents"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "reports"."duplicated" = false
    and incidents.status_id != 10
    and "reports"."codification_id" in (1)
    and "incidents"."status_id"  in(9)
    and "incidents"."close_id" in (12)
    and	 "codification_types"."id" != 1
        and "incidents"."group_id" != 5
    group by "codification_types"."codification_type"
    order by "codification_types"."codification_type") "f" ON "codification_types"."codification_type" = "f"."codification_type"
    where "codification_types"."codification_id" in (1)
    and codification_types.active = true) as resumen where codification_type!='Fuga'
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  analisisgeneral: (startDate, finalDate, codification_id) => {
    const query = `select 
    COALESCE("a"."codification_type","codification_types"."codification_type") "codification_type",
    COALESCE("a"."count",0) "incidents_total",
    COALESCE("b"."count",0) "incidents_not_received",
    COALESCE("c"."count",0) "incidents_inexists",
    COALESCE("d"."count",0) "incidents_wrong_location",
    COALESCE("e"."count",0) "incidents_duplicated",
     COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
          COALESCE(CAST("c"."count" AS INTEGER),0)-
          COALESCE(CAST("d"."count" AS INTEGER),0)-
          COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_neto",
    COALESCE("f"."count",0) "incidents_repaired",
      COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-
          COALESCE(CAST("c"."count" AS INTEGER),0)-
          COALESCE(CAST("d"."count" AS INTEGER),0)-
          COALESCE(CAST("e"."count" AS INTEGER),0)-
          COALESCE("f"."count",0)
          ) "incidents_process"
    from codification_types

 --Consulta total recibidos por codificacion
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and incidents.status_id != 10
 and "reports"."codification_id" in (:codification_id)
 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type" ) "a" ON "codification_types"."codification_type" = "a"."codification_type"
 --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and incidents.status_id != 10
 and "reports"."codification_id" in (:codification_id)

 and (("incidents"."status_id"  in(3)
 and "incidents"."assigned_tormenta" is null
 and "incidents"."assigned_cuadrilla" is null)
 or ("incidents"."status_id" in(6)
 and "incidents"."assigned_tormenta" is null
 and "incidents"."assigned_cuadrilla" is null)
 or("incidents"."status_id" in(4)
 and "incidents"."assigned_tormenta" is null
 and "incidents"."assigned_cuadrilla" is null)
 and "incidents"."close_id" is null
 and "incidents"."refuse_id" is null
 )
 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type" ) "b" ON "codification_types"."codification_type" = "b"."codification_type"
 -- CONSULTA REPORTES INEXISTENTES
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and incidents.status_id != 10
 and "reports"."codification_id" in (:codification_id)

 and (("incidents"."status_id"  in(10)
 and "incidents"."close_id" in (1))
 or ("incidents"."status_id" in(9)
 and "incidents"."close_id" in (1))
 )
 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type") "c" ON "codification_types"."codification_type" = "c"."codification_type"

 -- CONSULTA REPORTES MALA UBICACIÓN
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and incidents.status_id != 10
 and "reports"."codification_id" in (:codification_id)

 and (("incidents"."status_id"  in(10)
 and "incidents"."refuse_id" in (3))
 or ("incidents"."close_id" in (6))
 )
 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type") "d" ON "codification_types"."codification_type" = "d"."codification_type"

 -- CONSULTA REPORTES DUPLICADOS
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and incidents.status_id != 10
 and "reports"."codification_id" in (:codification_id)

 and (("incidents"."status_id"  in(10)
 and "incidents"."close_id" in (13))
 or ("incidents"."status_id"  in(9)
 and "incidents"."close_id" in (13))
 )
 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type") "e" ON "codification_types"."codification_type" = "e"."codification_type"

 -- CONSULTA REPORTES REPARADOS
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and incidents.status_id != 10
 and "reports"."codification_id" in (:codification_id)
 and "incidents"."status_id"  in(9)
 and "incidents"."close_id" in (12)
 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type") "f" ON "codification_types"."codification_type" = "f"."codification_type"
 --CONSULTA EN PROCESO
 LEFT JOIN (
 select "codification_types"."codification_type", count(distinct incidents.folio) "count"
 from "incidents"
 inner join "reports" on "incidents"."folio" = "reports"."incident_id"
 left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
 inner join "codifications" on "codifications"."id" = "reports"."codification_id"
 left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
 inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
 where "incidents"."active" = true
 and "incidents"."created_at" >=  :initialDate
 and "incidents"."created_at" <=  :finalDate
 and "reports"."active" = true
 and "incidents"."active" = true
 and "service_centers"."active" = true
 and "codifications"."active" = true
 and "reports"."duplicated" = false
 and "reports"."codification_id" in (:codification_id)

 and "incidents"."status_id" in(2,3,4,5,6,7)

 group by "codification_types"."codification_type"
 order by "codification_types"."codification_type") "g" ON "codification_types"."codification_type" = "g"."codification_type"
 where "codification_types"."codification_id" in (:codification_id)
 and codification_types.active = true
 `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        codification_id: codification_id,
      },
      type: QueryTypes.SELECT,
    });
  },
  fugasaguapotablediametrosalcaldias: (startDate, finalDate) => {
    const query = `select municipalities."municipality",
    COALESCE("a"."count", 0) "a",
    COALESCE("b"."count", 0) "b",
    COALESCE("c"."count", 0) "c",
    COALESCE("d"."count", 0) "d",
    COALESCE("e"."count", 0) "e",
    COALESCE("f"."count", 0) "f",
    COALESCE("g"."count", 0) "g",
    COALESCE("h"."count", 0) "h",
    COALESCE("i"."count", 0) "i",
    COALESCE("j"."count", 0) "j",
    COALESCE("k"."count", 0) "k",
    COALESCE("l"."count", 0) "l",
    COALESCE("m"."count", 0) "m",
    COALESCE("n"."count", 0) "n",
    COALESCE("ñ"."count", 0) "ñ",
    COALESCE("o"."count", 0) "o",
    COALESCE("p"."count", 0) "p",
    COALESCE("q"."count", 0) "q",
    COALESCE("r"."count", 0) "r",
    COALESCE("s"."count", 0) "s",
    COALESCE("t"."count", 0) "t",
    COALESCE("u"."count", 0) "u",
    COALESCE("v"."count", 0) "v",
    COALESCE("w"."count", 0) "w",
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)+COALESCE(CAST("b"."count" AS INTEGER),0)+COALESCE(CAST("c"."count" AS INTEGER),0)+
    COALESCE(CAST("d"."count" AS INTEGER),0)+COALESCE(CAST("e"."count" AS INTEGER),0)+
    COALESCE(CAST("f"."count" AS INTEGER),0)+COALESCE(CAST("g"."count" AS INTEGER),0)+
    COALESCE(CAST("h"."count" AS INTEGER),0)+COALESCE(CAST("i"."count" AS INTEGER),0)+
    COALESCE(CAST("j"."count" AS INTEGER),0)+COALESCE(CAST("k"."count" AS INTEGER),0)+
    COALESCE(CAST("l"."count" AS INTEGER),0)+COALESCE(CAST("m"."count" AS INTEGER),0)+
    COALESCE(CAST("n"."count" AS INTEGER),0)+COALESCE(CAST("ñ"."count" AS INTEGER),0)+
    COALESCE(CAST("o"."count" AS INTEGER),0)+COALESCE(CAST("p"."count" AS INTEGER),0)+
    COALESCE(CAST("q"."count" AS INTEGER),0)+COALESCE(CAST("r"."count" AS INTEGER),0)+
    COALESCE(CAST("s"."count" AS INTEGER),0)+COALESCE(CAST("t"."count" AS INTEGER),0)+
    COALESCE(CAST("u"."count" AS INTEGER),0)+COALESCE(CAST("v"."count" AS INTEGER),0)+
    COALESCE(CAST("w"."count" AS INTEGER),0)) "Total"
    
  from municipalities
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '1/2' 
  group by municipalities."municipality") "a" ON municipalities."municipality" = "a"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '3/8' 
  group by municipalities."municipality") "b" ON municipalities."municipality" = "b"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id"
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '5/8' 
  group by municipalities."municipality") "c" ON municipalities."municipality" = "c"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio")
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id"
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" 
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '3/4' 
  group by municipalities."municipality") "d" ON municipalities."municipality" = "d"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '1' 
  group by municipalities."municipality") "e" ON municipalities."municipality" = "e"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '1 1/4' 
  group by municipalities."municipality") "f" ON municipalities."municipality" = "f"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '1 1/2' 
  group by municipalities."municipality") "g" ON municipalities."municipality" = "g"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '2' 
  group by municipalities."municipality") "h" ON municipalities."municipality" = "h"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '2 1/2' 
  group by municipalities."municipality") "i" ON municipalities."municipality" = "i"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '3' 
  group by municipalities."municipality") "j" ON municipalities."municipality" = "j"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '4' 
  group by municipalities."municipality") "k" ON municipalities."municipality" = "k"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '5' 
  group by municipalities."municipality") "l" ON municipalities."municipality" = "l"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '6' 
  group by municipalities."municipality") "m" ON municipalities."municipality" = "m"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '8' 
  group by municipalities."municipality") "n" ON municipalities."municipality" = "n"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '10' 
  group by municipalities."municipality") "ñ" ON municipalities."municipality" = "ñ"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '12' 
  group by municipalities."municipality") "o" ON municipalities."municipality" = "o"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '16' 
  group by municipalities."municipality") "p" ON municipalities."municipality" = "p"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '20' 
  group by municipalities."municipality") "q" ON municipalities."municipality" = "q"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '24' 
  group by municipalities."municipality") "r" ON municipalities."municipality" = "r"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '30' 
  group by municipalities."municipality") "s" ON municipalities."municipality" = "s"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '36' 
  group by municipalities."municipality") "t" ON municipalities."municipality" = "t"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '42' 
  group by municipalities."municipality") "u" ON municipalities."municipality" = "u"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '48' 
  group by municipalities."municipality") "v" ON municipalities."municipality" = "v"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
  from incidents 
  inner join reports on "incidents"."folio" = "reports"."incident_id"
  inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
  inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
  where incidents."active" = true 
  and "incidents"."status_id" = 9 
  and "incidents"."status_id" != 10 
  and "incidents"."created_at" between  :initialDate and  :finalDate
  and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
  and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
  and municipalities."municipality" is not null
  and repairs."diameter" like '72' 
  group by municipalities."municipality") "w" ON municipalities."municipality" = "w"."municipality"
  where municipalities.active = true
   `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  fugasaguaspotablediametrosscmxalcaldias: (startDate, finalDate) => {
    const query = `
    select distinct municipalities."municipality",
    COALESCE("a"."count", 0) "a",
    COALESCE("b"."count", 0) "b",
    COALESCE("c"."count", 0) "c",
    COALESCE("d"."count", 0) "d",
    COALESCE("e"."count", 0) "e",
    COALESCE("f"."count", 0) "f",
    COALESCE("g"."count", 0) "g",
    COALESCE("h"."count", 0) "h",
    COALESCE("i"."count", 0) "i",
    COALESCE("j"."count", 0) "j",
    COALESCE("k"."count", 0) "k",
    COALESCE("l"."count", 0) "l",
    COALESCE("m"."count", 0) "m",
    COALESCE("n"."count", 0) "n",
    COALESCE("ñ"."count", 0) "ñ",
    COALESCE("o"."count", 0) "o",
    COALESCE("p"."count", 0) "p",
    COALESCE("q"."count", 0) "q",
    COALESCE("r"."count", 0) "r",
    COALESCE("s"."count", 0) "s",
    COALESCE("t"."count", 0) "t",
    COALESCE("u"."count", 0) "u",
    COALESCE("v"."count", 0) "v",
    COALESCE("w"."count", 0) "w",
    COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)+COALESCE(CAST("b"."count" AS INTEGER),0)+
        COALESCE(CAST("c"."count" AS INTEGER),0)+COALESCE(CAST("d"."count" AS INTEGER),0)+
        COALESCE(CAST("e"."count" AS INTEGER),0)+COALESCE(CAST("f"."count" AS INTEGER),0)+
        COALESCE(CAST("g"."count" AS INTEGER),0)+COALESCE(CAST("h"."count" AS INTEGER),0)+
        COALESCE(CAST("i"."count" AS INTEGER),0)+COALESCE(CAST("j"."count" AS INTEGER),0)+
        COALESCE(CAST("k"."count" AS INTEGER),0)+COALESCE(CAST("l"."count" AS INTEGER),0)+
        COALESCE(CAST("m"."count" AS INTEGER),0)+COALESCE(CAST("n"."count" AS INTEGER),0)+
        COALESCE(CAST("ñ"."count" AS INTEGER),0)+COALESCE(CAST("o"."count" AS INTEGER),0)+
        COALESCE(CAST("p"."count" AS INTEGER),0)+COALESCE(CAST("q"."count" AS INTEGER),0)+
        COALESCE(CAST("r"."count" AS INTEGER),0)+COALESCE(CAST("s"."count" AS INTEGER),0)+
        COALESCE(CAST("t"."count" AS INTEGER),0)+COALESCE(CAST("u"."count" AS INTEGER),0)+
        COALESCE(CAST("v"."count" AS INTEGER),0)+COALESCE(CAST("w"."count" AS INTEGER),0)) "Total"
      
    
        from municipalities
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '1/2' 
    and service_centers.group_id =5
  group by municipalities."municipality") "a" ON municipalities."municipality" = "a"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '3/8' 
    and service_centers.group_id =5
  group by municipalities."municipality") "b" ON municipalities."municipality" = "b"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '5/8' 
    and service_centers.group_id =5
  group by municipalities."municipality") "c" ON municipalities."municipality" = "c"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '3/4' 
    and service_centers.group_id =5
  group by municipalities."municipality") "d" ON municipalities."municipality" = "d"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '1' 
    and service_centers.group_id =5
  group by municipalities."municipality") "e" ON municipalities."municipality" = "e"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '1 1/4' 
    and service_centers.group_id =5
  group by municipalities."municipality") "f" ON municipalities."municipality" = "f"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '1 1/2' 
    and service_centers.group_id =5
  group by municipalities."municipality") "g" ON municipalities."municipality" = "g"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '2' 
    and service_centers.group_id =5
  group by municipalities."municipality") "h" ON municipalities."municipality" = "h"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '2 1/2' 
    and service_centers.group_id =5
  group by municipalities."municipality") "i" ON municipalities."municipality" = "i"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '3' 
    and service_centers.group_id =5
  group by municipalities."municipality") "j" ON municipalities."municipality" = "j"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '4' 
    and service_centers.group_id =5
  group by municipalities."municipality") "k" ON municipalities."municipality" = "k"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '5' 
    and service_centers.group_id =5
  group by municipalities."municipality") "l" ON municipalities."municipality" = "l"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '6' 
    and service_centers.group_id =5
  group by municipalities."municipality") "m" ON municipalities."municipality" = "m"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '8' 
    and service_centers.group_id =5
  group by municipalities."municipality") "n" ON municipalities."municipality" = "n"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '10' 
    and service_centers.group_id =5
  group by municipalities."municipality") "ñ" ON municipalities."municipality" = "ñ"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '12' 
    and service_centers.group_id =5
  group by municipalities."municipality") "o" ON municipalities."municipality" = "o"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '16' 
    and service_centers.group_id =5
  group by municipalities."municipality") "p" ON municipalities."municipality" = "p"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '20' 
    and service_centers.group_id =5
  group by municipalities."municipality") "q" ON municipalities."municipality" = "q"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '24' 
    and service_centers.group_id =5
  group by municipalities."municipality") "r" ON municipalities."municipality" = "r"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '30' 
    and service_centers.group_id =5
  group by municipalities."municipality") "s" ON municipalities."municipality" = "s"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '36' 
    and service_centers.group_id =5
  group by municipalities."municipality") "t" ON municipalities."municipality" = "t"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '42' 
    and service_centers.group_id =5
  group by municipalities."municipality") "u" ON municipalities."municipality" = "u"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '48' 
    and service_centers.group_id =5
  group by municipalities."municipality") "v" ON municipalities."municipality" = "v"."municipality"
  
  left join(
  select  municipalities."municipality", count (distinct incidents."folio") 
    from incidents 
    inner join reports on "incidents"."folio" = "reports"."incident_id"
    inner join municipalities on reports."municipality_id" = municipalities."real_id" and incidents."active" = true
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
    where incidents."active" = true 
    and "incidents"."status_id" = 9 
    and "incidents"."status_id" != 10 
    and "incidents"."created_at" between  :initialDate and  :finalDate
    and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
    and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
    and municipalities."municipality" is not null
    and repairs."diameter" like '72' 
    and service_centers.group_id =5
  group by municipalities."municipality") "w" ON municipalities."municipality" = "w"."municipality"    
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  fugasaguaspotablediametrosscmxcamp: (startDate, finalDate) => {
    const query = `
    select distinct  "service_centers"."name",
	COALESCE("a"."count", 0) "a",
	COALESCE("b"."count", 0) "b",
	COALESCE("c"."count", 0) "c",
	COALESCE("d"."count", 0) "d",
	COALESCE("e"."count", 0) "e",
	COALESCE("f"."count", 0) "f",
	COALESCE("g"."count", 0) "g",
	COALESCE("h"."count", 0) "h",
	COALESCE("i"."count", 0) "i",
	COALESCE("j"."count", 0) "j",
	COALESCE("k"."count", 0) "k",
	COALESCE("l"."count", 0) "l",
	COALESCE("m"."count", 0) "m",
	COALESCE("n"."count", 0) "n",
	COALESCE("ñ"."count", 0) "ñ",
	COALESCE("o"."count", 0) "o",
	COALESCE("p"."count", 0) "p",
	COALESCE("q"."count", 0) "q",
	COALESCE("r"."count", 0) "r",
	COALESCE("s"."count", 0) "s",
	COALESCE("t"."count", 0) "t",
	COALESCE("u"."count", 0) "u",
	COALESCE("v"."count", 0) "v",
	COALESCE("w"."count", 0) "w",
	COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)+COALESCE(CAST("b"."count" AS INTEGER),0)+
			COALESCE(CAST("c"."count" AS INTEGER),0)+COALESCE(CAST("d"."count" AS INTEGER),0)+
			COALESCE(CAST("e"."count" AS INTEGER),0)+COALESCE(CAST("f"."count" AS INTEGER),0)+
			COALESCE(CAST("g"."count" AS INTEGER),0)+COALESCE(CAST("h"."count" AS INTEGER),0)+
			COALESCE(CAST("i"."count" AS INTEGER),0)+COALESCE(CAST("j"."count" AS INTEGER),0)+
			COALESCE(CAST("k"."count" AS INTEGER),0)+COALESCE(CAST("l"."count" AS INTEGER),0)+
			COALESCE(CAST("m"."count" AS INTEGER),0)+COALESCE(CAST("n"."count" AS INTEGER),0)+
			COALESCE(CAST("ñ"."count" AS INTEGER),0)+COALESCE(CAST("o"."count" AS INTEGER),0)+
			COALESCE(CAST("p"."count" AS INTEGER),0)+COALESCE(CAST("q"."count" AS INTEGER),0)+
			COALESCE(CAST("r"."count" AS INTEGER),0)+COALESCE(CAST("s"."count" AS INTEGER),0)+
			COALESCE(CAST("t"."count" AS INTEGER),0)+COALESCE(CAST("u"."count" AS INTEGER),0)+
			COALESCE(CAST("v"."count" AS INTEGER),0)+COALESCE(CAST("w"."count" AS INTEGER),0)) "Total"
    
	

from service_centers
left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
and repairs."diameter" like '1/2' 
group by "service_centers"."name") "a" ON "service_centers"."name" = "a"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
and repairs."diameter" like '3/8' 
group by "service_centers"."name") "b" ON "service_centers"."name" = "b"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true)
and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true order by "repairs"."id" desc)
and repairs."diameter" like '5/8' 
group by "service_centers"."name") "c" ON "service_centers"."name" = "c"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '3/4' 
group by "service_centers"."name") "d" ON "service_centers"."name" = "d"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '1' 
group by "service_centers"."name") "e" ON "service_centers"."name" = "e"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '1 1/4' 
group by "service_centers"."name") "f" ON "service_centers"."name" = "f"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '1 1/2' 
group by "service_centers"."name") "g" ON "service_centers"."name" = "g"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '2' 
group by "service_centers"."name") "h" ON "service_centers"."name" = "h"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '2 1/2' 
group by "service_centers"."name") "i" ON "service_centers"."name" = "i"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '3' 
group by "service_centers"."name") "j" ON "service_centers"."name" = "j"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '4' 
group by "service_centers"."name") "k" ON "service_centers"."name" = "k"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '5' 
group by "service_centers"."name") "l" ON "service_centers"."name" = "l"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '6' 
group by "service_centers"."name") "m" ON "service_centers"."name" = "m"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '8' 
group by "service_centers"."name") "n" ON "service_centers"."name" = "n"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '10' 
group by "service_centers"."name") "ñ" ON "service_centers"."name" = "ñ"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '12' 
group by "service_centers"."name") "o" ON "service_centers"."name" = "o"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '16' 
group by "service_centers"."name") "p" ON "service_centers"."name" = "p"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '20' 
group by "service_centers"."name") "q" ON "service_centers"."name" = "q"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '24' 
group by "service_centers"."name") "r" ON "service_centers"."name" = "r"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '30' 
group by "service_centers"."name") "s" ON "service_centers"."name" = "s"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '36' 
group by "service_centers"."name") "t" ON "service_centers"."name" = "t"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '42' 
group by "service_centers"."name") "u" ON "service_centers"."name" = "u"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '48' 
group by "service_centers"."name") "v" ON "service_centers"."name" = "v"."name"

left join(
select  "service_centers"."name", count (distinct incidents."folio") 
from incidents 
inner join reports on "incidents"."folio" = "reports"."incident_id"
inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
left Join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
left Join "groups" on "groups"."id" = "incidents"."group_id"
inner join "codifications" on "codifications"."id" = "reports"."codification_id"
left Join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
where incidents."active" = true 
and "incidents"."status_id" != 10 
and "incidents"."created_at" between  :initialDate and  :finalDate
and "reports"."codification_type_id" = 1
and "reports"."active" = true
and "incidents"."active" = true
and "service_centers"."active" = true
and "codifications"."active" = true
and "groups"."id" = 1
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and repairs."diameter" like '72' 
group by "service_centers"."name") "w" ON "service_centers"."name" = "w"."name"

where "service_centers"."active" = true
and "service_centers"."codification_types_serve"::jsonb@> '[1]' 
and service_centers.group_id = 1
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  atencionfaltasaguapotablescmx: (startDate, finalDate) => {
    const query = `
    select distinct  "service_centers"."name",
    COALESCE("h"."count",0) "incidents_total_camp",
    COALESCE("i"."count",0) "incidents_not_received_camp",
    COALESCE( COALESCE(CAST("h"."count" AS INTEGER),0)-COALESCE(CAST("i"."count" AS INTEGER),0)-COALESCE(CAST("n"."count" AS INTEGER),0)-COALESCE(CAST("j"."count" AS INTEGER),0)-COALESCE(CAST("k"."count" AS INTEGER),0)-COALESCE(CAST("l"."count" AS INTEGER),0)) "incidents_process_camp",
    COALESCE( COALESCE(CAST("j"."count" AS INTEGER),0)+COALESCE(CAST("k"."count" AS INTEGER),0)+COALESCE(CAST("l"."count" AS INTEGER),0)) "incidents_inexists_wrong_location_dup_camp",
    COALESCE("n"."count",0) "incidents_repaired_camp",
    COALESCE("m"."count",0) "incidents_pending_camp"
    from service_centers
    -- CONSULTA TOTAL RECIBIDOS POR CODIFICACION
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    group by service_centers.name
    order by service_centers.name ) "h" ON "service_centers"."name" = "h"."name"
    --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    and (("incidents"."status_id"  in(3)
    and "incidents"."assigned_tormenta" is null
    and "incidents"."assigned_cuadrilla" is null)
    or ("incidents"."status_id" in(6)
    and "incidents"."assigned_tormenta" is null
    and "incidents"."assigned_cuadrilla" is null)
    or("incidents"."status_id" in(4)
    and "incidents"."assigned_tormenta" is null
    and "incidents"."assigned_cuadrilla" is null)
    and "incidents"."close_id" is null
    and "incidents"."refuse_id" is null
    )
    group by service_centers.name
    order by service_centers.name ) "i" ON "service_centers"."name" = "i"."name"
    -- CONSULTA REPORTES INEXISTENTES, DUPLICADOS Y MALAS UBICACIONES
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    and (("incidents"."status_id"  in(10)
    and "incidents"."close_id" in (1))
    or ("incidents"."status_id" in(9)
    and "incidents"."close_id" in (1))
    )
    group by service_centers.name
    order by service_centers.name ) "j" ON "service_centers"."name" = "j"."name"
    -- CONSULTA REPORTES MALA UBICACIÓN
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    and "reports"."duplicated" = false
    and incidents.status_id != 10
    and (("incidents"."status_id"  in(10)
    and "incidents"."refuse_id" in (3))
    or ("incidents"."close_id" in (6))
    )
    group by service_centers.name
    order by service_centers.name ) "k" ON "service_centers"."name" = "k"."name"
    -- CONSULTA REPORTES DUPLICADOS
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    and (("incidents"."status_id"  in(10)
    and "incidents"."close_id" in (13))
    or ("incidents"."status_id"  in(9)
    and "incidents"."close_id" in (13))
    )
    group by service_centers.name
    order by service_centers.name ) "l" ON "service_centers"."name" = "l"."name"
    -- CONSULTA FUGAS PENDIENTES
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    and "incidents"."status_id" in(3,4,5,6,7)
    group by service_centers.name
    order by "service_centers"."name") "m" ON "service_centers"."name" = "m"."name"
    -- CONSULTA REPORTES REPARADOS
    LEFT JOIN (
    Select
    service_centers."name",
    count(distinct incidents.folio) "count"
    from "incidents"
    left Join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
    left join "groups" on "groups"."id" = "incidents"."group_id"
    join "codifications" on "codifications"."id" = "reports"."codification_id"
    left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    where "incidents"."active" = true
    and "reports"."active" = true
    and "groups"."active" = true
    and "service_centers"."active" = true
    and "codifications"."active" = true
    and "incidents"."created_at" >=  :initialDate
    and "incidents"."created_at" <=  :finalDate
    and incidents.status_id != 10
    and incidents.group_id in (1)
    and "reports"."codification_type_id" in (2)
    and "incidents"."status_id"  in(9)
    and "incidents"."close_id" in (12)
    group by service_centers.name
    order by "service_centers"."name") "n" ON "service_centers"."name" = "n"."name"
    where
    service_centers.group_id in (1)
	and "service_centers"."codification_types_serve"::jsonb@> '[2]'
	and service_centers.active = true `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  reparacionesfugasaguapotablesacmex: (startDate, finalDate) => {
    const query = `
        select
        COALESCE("a"."municipality","municipalities"."municipality") "municipality",
        COALESCE("a"."count",0) "incidents_total",
        COALESCE("b"."count",0) "incidents_not_received",
        COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-COALESCE(CAST("b"."count" AS INTEGER),0)-COALESCE(CAST("f"."count" AS INTEGER),0)-COALESCE(CAST("c"."count" AS INTEGER),0)-COALESCE(CAST("d"."count" AS INTEGER),0)-COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_process",
        COALESCE( COALESCE(CAST("c"."count" AS INTEGER),0)+COALESCE(CAST("d"."count" AS INTEGER),0)+COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_inexists_wrong_location_dup",
        COALESCE("f"."count",0) "incidents_repaired",
        COALESCE("g"."count",0) "incidents_pending"
        from municipalities
        --Consulta total recibidos por codificacion
        LEFT JOIN (
        select
        municipalities.municipality,
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"		
        
        where "incidents"."active" = true		
        and "reports"."active" = true
        and "service_centers"."active" = true		
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and incidents.status_id != 10
        and incidents.group_id in (1)
        and "reports"."codification_type_id" = 1	
        group by municipalities.municipality
        order by municipalities.municipality ) "a" ON "municipalities"."municipality" = "a"."municipality"
      
      --CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
        LEFT JOIN (
        select
        municipalities.municipality,
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true		
        and "reports"."active" = true
        and "service_centers"."active" = true		
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        
        and incidents.status_id != 10
        and incidents.group_id in (1)
        and "reports"."codification_type_id" = 1	
        and (("incidents"."status_id"  in(3)
        and "incidents"."assigned_tormenta" is null
        and "incidents"."assigned_cuadrilla" is null)
        or ("incidents"."status_id" in(6)
        and "incidents"."assigned_tormenta" is null
        and "incidents"."assigned_cuadrilla" is null)
        or("incidents"."status_id" in(4)
        and "incidents"."assigned_tormenta" is null
        and "incidents"."assigned_cuadrilla" is null)
        and "incidents"."close_id" is null
        and "incidents"."refuse_id" is null
        )
        group by municipalities.municipality
        order by municipalities.municipality ) "b" ON "municipalities"."municipality" = "b"."municipality"
      
        -- CONSULTA REPORTES INEXISTENTES, DUPLICADOS Y MALAS UBICACIONES
        -- CONSULTA REPORTES INEXISTENTES
        LEFT JOIN (
        select 
        municipalities.municipality, 
        count(distinct incidents.folio) "count"
        from "incidents"
        inner join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        inner join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and "reports"."active" = true
        and "incidents"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "reports"."duplicated" = false
        and incidents.status_id != 10
        and incidents.group_id in (1)
        and "reports"."codification_type_id" = 1	
        and (("incidents"."status_id"  in(10)
        and "incidents"."close_id" in (1))
        or ("incidents"."status_id" in(9)
        and "incidents"."close_id" in (1))
        )
        group by municipalities.municipality
        order by municipalities.municipality) "c" ON "municipalities"."municipality" = "c"."municipality"
      
        -- CONSULTA REPORTES MALA UBICACIÓN
        LEFT JOIN (
        select 
        municipalities.municipality, 
        count(distinct incidents.folio) "count"
        from "incidents"
        inner join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        inner join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and "reports"."active" = true
        and "incidents"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "reports"."duplicated" = false
        and incidents.status_id != 10
        and incidents.group_id in (1)
        and "reports"."codification_type_id" = 1	
        and (("incidents"."status_id"  in(10)
        and "incidents"."refuse_id" in (3))
        or ("incidents"."close_id" in (6))
        )
        group by municipalities.municipality
        order by municipalities.municipality) "d" ON "municipalities"."municipality" = "d"."municipality"
        
      -- CONSULTA REPORTES DUPLICADOS
        LEFT JOIN (
        select 
        municipalities.municipality, 
        count(distinct incidents.folio) "count"
        from "incidents"
        inner join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        inner join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and "reports"."active" = true
        and "incidents"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "reports"."duplicated" = false
        and incidents.status_id != 10
        and incidents.group_id in (1)
        and "reports"."codification_type_id" = 1	
        and (("incidents"."status_id"  in(10)
        and "incidents"."close_id" in (13))
        or ("incidents"."status_id"  in(9)
        and "incidents"."close_id" in (13))
        )
        group by municipalities.municipality
        order by municipalities.municipality) "e" ON "municipalities"."municipality" = "e"."municipality"
      
      -- CONSULTA FUGAS PENDIENTES
        LEFT JOIN (
        select 
        municipalities.municipality, 
        count(distinct incidents.folio) "count"
        from "incidents"
        left Join "reports" on "incidents"."folio" = "reports"."incident_id"
        left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
        join "codifications" on "codifications"."id" = "reports"."codification_id"
        left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
        left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
        where "incidents"."active" = true
        and "incidents"."created_at" >=  :initialDate
        and "incidents"."created_at" <=  :finalDate
        and "reports"."active" = true
        and "incidents"."active" = true
        and "service_centers"."active" = true
        and "codifications"."active" = true
        and "reports"."duplicated" = false
        and "reports"."codification_type_id" = 1
        and incidents.group_id in (1)
        and "incidents"."status_id" in(3,4,5,6,7)
        group by municipalities.municipality
        order by "municipalities"."municipality") "g" ON "municipalities"."municipality" = "g"."municipality"
      
        -- CONSULTA REPORTES REPARADOS
        LEFT JOIN (
        select
          municipalities.municipality,
          count(distinct incidents.folio) "count"
          from "incidents"
          left Join "reports" on "incidents"."folio" = "reports"."incident_id"
          left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
          join "codifications" on "codifications"."id" = "reports"."codification_id"
          left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
          left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
          where "incidents"."active" = true		
          and "reports"."active" = true
          and "service_centers"."active" = true		
          and "incidents"."created_at" >=  :initialDate
          and "incidents"."created_at" <=  :finalDate
          and incidents.status_id != 10
          and incidents.group_id in (1)
          and "reports"."codification_type_id" = 1
          and "incidents"."status_id"  in(9)
          and "incidents"."close_id" in (12)
        group by municipalities.municipality
        order by "municipalities"."municipality") "f" ON "municipalities"."municipality" = "f"."municipality"
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  reparacionesfugasaguapotablescmxalcaldias: (startDate, finalDate) => {
    const query = `

    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  atencionfugasaguapotableanual: (formattedStartDate, formattedFinalDate) => {
    const query = `
    select 
    municipalities.municipality,
    count(distinct incidents.folio) as "subtotal",
    json_agg(json_build_object(
        'folio', incidents.folio:: varchar(255),
           'address', concat(reports.address, ' ', reports.external_number, ', ', coalesce(reports.internal_number,'')),
           'report_btw_street_first',COALESCE (CAST( reports.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
           'report_btw_street_second', COALESCE (CAST( reports.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
        'report_settlement', settlements.settlement:: varchar(255),
        'repair_description', repairs.description::varchar(255),
        'repair_surface', repairs.description::varchar(255),
        'repair_diameter', repairs.diameter::varchar(255),
        'repair_material', repairs.material::varchar(255)
    )) 
    as incidents
   from "incidents" 
   inner join "reports" on "incidents"."folio" = "reports"."incident_id"
    left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
    inner join "repairs" on "incidents"."id" = "repairs"."incident_id" and incidents."active" = true
     inner join settlements on settlements.id = "reports"."settlement_id"
   where incidents."active" = true 
   and reports.active = true
   and incidents."status_id" = 9 
   and "incidents"."created_at" >=  :initialDate
and "incidents"."created_at" <=  :finalDate
  -- and incidents."created_at"::text ILIKE  '2022%'  
   and exists (select * from "reports" where "incidents"."folio" = "reports"."incident_id" and "active" = true) 
   and exists (select * from "repairs" where "incidents"."id" = "repairs"."incident_id" and "active" = true) 
   and exists (select * from "service_centers" where "incidents"."service_center_id" = "service_centers"."id" and "active" = true)
   and municipalities."municipality" is not null
     group by municipalities.municipality
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        // initialDate: year+'%',
        initialDate: formattedStartDate,
        finalDate: formattedFinalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia: (
    startDate,
    finalDate
  ) => {
    const query = `
    
select 
COALESCE(result.municipality),
grand_total_received.subtotal_received, 
grand_total_solved.subtotal_solved,
COALESCE( COALESCE(CAST(grand_total_received.subtotal_received AS INTEGER),0)-COALESCE(CAST(grand_total_solved.subtotal_solved AS INTEGER),0)) "total_process",
			json_agg(distinct jsonb_build_object(
			'settlement',result.settlement ,
		    'd_tipo_asenta', result.d_tipo_asenta,
			'total_received',result.subtotal_received,
			'total_solved',result.subtotal_solved
			)) as "count_reports"
from municipalities
left join(
select 
subresult.municipality,
subresult.settlement,
subresult.d_tipo_asenta,
sum(subresult.subtotal_received) as subtotal_received,
sum(subresult.subtotal_solved) as subtotal_solved
from (select 
	 b.municipality,
	 b.settlement,
	 b.d_tipo_asenta,
	 b.subtotal_received,
	 CASE WHEN b.status_id = 9 and b.close_id = 12 THEN sum(b.subtotal_received) ELSE 0 END as subtotal_solved
	 --,sum(b.subtotal_received) as subtotal_solved
	 from
			(
					select municipalities.municipality,
					settlements.settlement,settlements.d_tipo_asenta,incidents.close_id, incidents.status_id, 
					count(distinct reports.sequence) as "subtotal_received" 
					from "incidents"
					left join "reports" on "incidents"."folio" = "reports"."incident_id"
					inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
					inner join "citizens" on "reports"."citizen_id" = "citizens"."id"
					left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
					inner join "codifications" on "codifications"."id" = "reports"."codification_id"
					left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
					left join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id"
					where "incidents"."active" = true and "incidents"."status_id" != 10
					and "incidents"."created_at" >=  :initialDate
					and "incidents"."created_at" <=  :finalDate
					and "reports"."codification_type_id" = 2
					and "reports"."codification_id" in (1)
					and "reports"."active" = true
					and "incidents"."active" = true
					and "service_centers"."active" = true
					group by municipalities.municipality,
					settlements.settlement,settlements.d_tipo_asenta,incidents.close_id, incidents.status_id
					order by municipalities.municipality
			) b
	 group by  b.municipality,
	 b.settlement,
	 b.d_tipo_asenta,b.subtotal_received
	 ,b.status_id, b.close_id) subresult
	 group by  subresult.municipality,
	 subresult.settlement,subresult.d_tipo_asenta
) "result" on "municipalities"."municipality" = "result"."municipality"




		left join(
				select municipalities.municipality,
				count(distinct reports.sequence) as "subtotal_received" 
				from "incidents"
				left join "reports" on "incidents"."folio" = "reports"."incident_id"
				inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
				inner join "citizens" on "reports"."citizen_id" = "citizens"."id"
				left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
				inner join "codifications" on "codifications"."id" = "reports"."codification_id"
				left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
				left join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id"
				where "incidents"."active" = true and "incidents"."status_id" != 10
				and "incidents"."created_at" >=  :initialDate
				and "incidents"."created_at" <=  :finalDate
				and "reports"."codification_type_id" = 2
				and "reports"."codification_id" in (1)
				and "reports"."active" = true
				and "incidents"."active" = true
				and "service_centers"."active" = true
				group by municipalities.municipality
				order by municipalities.municipality
		) "grand_total_received" on "municipalities"."municipality" = "grand_total_received"."municipality"

		left join(
				select municipalities.municipality,
				count(distinct reports.sequence) as "subtotal_solved"
				from "incidents"
				left join "reports" on "incidents"."folio" = "reports"."incident_id"
				inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
				inner join "citizens" on "reports"."citizen_id" = "citizens"."id"
				left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
				inner join "codifications" on "codifications"."id" = "reports"."codification_id"
				left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
				left join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id"
				where "incidents"."active" = true and "incidents"."status_id" != 10
				and "incidents"."created_at" >=  :initialDate
				and "incidents"."created_at" <=  :finalDate
				and "reports"."codification_type_id" = 2
				and "reports"."codification_id" in (1)
				and "incidents"."status_id"  in(9)
				and "incidents"."close_id" in (12)
				and "reports"."active" = true
				and "incidents"."active" = true
				and "service_centers"."active" = true
				group by municipalities.municipality
				order by municipalities.municipality
		) "grand_total_solved" on "municipalities"."municipality" = "grand_total_solved"."municipality"
	where result.municipality is not null
group by result.municipality
,grand_total_received.subtotal_received, grand_total_solved.subtotal_solved
order by result.municipality
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  sustitucionaccesorioshidraulicos: (startDate, finalDate) => {
    const query = `
    
    select 
COALESCE(result.municipality),
coalesce(grand_total_received.subtotal_received,0) as subtotal_received,
coalesce(grand_total_solved.subtotal_solved,0) as subtotal_solved,
COALESCE( COALESCE(CAST(grand_total_received.subtotal_received AS INTEGER),0)-COALESCE(CAST(grand_total_solved.subtotal_solved AS INTEGER),0)) "total_process",
			json_agg(distinct jsonb_build_object(
			'settlement',result.settlement ,
				'municipality',result.municipality,
		    'd_tipo_asenta', result.d_tipo_asenta,
			'total_received',result.subtotal_received,
			'total_solved',result.subtotal_solved,
				'total_coladera_sin_tapa',result.subtotal_coladera_sin_tapa_total,
				'total_pozo_de_visita',result.subtotal_pozo_de_visita_total,
				'total_boca_de_tormenta',result.subtotal_boca_de_tormenta_total,
				'total_rejilla_de_piso',result.subtotal_rejilla_de_piso_total,
				'solved_coladera_sin_tapa',result.subtotal_coladera_sin_tapa_solved,
				'solved_pozo_de_visita',result.subtotal_pozo_de_visita_solved,
				'solved_rejilla_de_piso',result.subtotal_rejilla_de_piso_solved,
				'solved_boca_de_tormenta',result.subtotal_boca_de_tormenta_solved
			)) as "count_reports"
from municipalities
left join(
select 
subresult.municipality,
subresult.settlement,
subresult.d_tipo_asenta,
sum(subresult.subtotal_received) as subtotal_received,
sum(subresult.subtotal_solved) as subtotal_solved,
	
sum(subtotal_coladera_sin_tapa_total) as subtotal_coladera_sin_tapa_total,
sum(subtotal_pozo_de_visita_total) as subtotal_pozo_de_visita_total,
sum(subtotal_rejilla_de_piso_total) as subtotal_rejilla_de_piso_total,
sum(subtotal_boca_de_tormenta_total) as subtotal_boca_de_tormenta_total,
	
sum(subtotal_coladera_sin_tapa_solved) as subtotal_coladera_sin_tapa_solved,
sum(subtotal_pozo_de_visita_solved) as subtotal_pozo_de_visita_solved,
sum(subtotal_rejilla_de_piso_solved) as subtotal_rejilla_de_piso_solved,
sum(subtotal_boca_de_tormenta_solved) as subtotal_boca_de_tormenta_solved
from (select 
	 b.municipality,
	 b.settlement,
	 b.d_tipo_asenta,
	 b.subtotal_received,
	 CASE WHEN b.status_id = 9 and b.close_id = 12 THEN sum(b.subtotal_received) ELSE 0 END as subtotal_solved,
	  CASE WHEN b.codification_type_id = 10 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_coladera_sin_tapa_total,
	  CASE WHEN b.codification_type_id = 11 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_pozo_de_visita_total,
	  CASE WHEN b.codification_type_id = 13 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_rejilla_de_piso_total,
	  CASE WHEN b.codification_type_id = 12 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_boca_de_tormenta_total,
	  CASE WHEN b.codification_type_id = 10 and b.status_id = 9 and b.close_id = 12 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_coladera_sin_tapa_solved,
	  CASE WHEN b.codification_type_id = 11 and b.status_id = 9 and b.close_id = 12 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_pozo_de_visita_solved,
	  CASE WHEN b.codification_type_id = 13 and b.status_id = 9 and b.close_id = 12 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_rejilla_de_piso_solved,
	  CASE WHEN b.codification_type_id = 12 and b.status_id = 9 and b.close_id = 12 THEN sum(b.subtotal_codification_type) ELSE 0 END as subtotal_boca_de_tormenta_solved
	 from
			(
					select 
	municipalities.municipality,
	settlements.settlement,settlements.d_tipo_asenta,incidents.close_id, incidents.status_id,
				reports.codification_type_id,
	count(reports.codification_type_id) as subtotal_codification_type,
	count(distinct reports.sequence) as "subtotal_received" 
from "incidents"
	left join "reports" on "incidents"."folio" = "reports"."incident_id"
	inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
	inner join "citizens" on "reports"."citizen_id" = "citizens"."id"
	left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
	inner join "codifications" on "codifications"."id" = "reports"."codification_id"
	left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
	left join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id"
where "incidents"."active" = true and "incidents"."status_id" != 10
	and "incidents"."created_at" >=  :initialDate
	and "incidents"."created_at" <=  :finalDate
	and "reports"."codification_type_id" in (10,11,12,13)
	and "reports"."codification_id" in (2)
	and "reports"."active" = true
	and "incidents"."active" = true
	and "service_centers"."active" = true
  and "service_centers"."id" in (118,119,120,121,122,123)
group by municipalities.municipality,
	settlements.settlement,settlements.d_tipo_asenta,incidents.close_id, incidents.status_id
	,reports.codification_type_id
order by municipalities.municipality
			) b
	 
	 group by  b.municipality,
	 b.settlement,
	 b.d_tipo_asenta,b.subtotal_received
	 ,b.status_id, b.close_id
	 ,b.codification_type_id
	 
	 ) subresult
	 group by  subresult.municipality,
	 subresult.settlement,subresult.d_tipo_asenta

) "result" on "municipalities"."municipality" = "result"."municipality"




		left join(
				select municipalities.municipality,
				count(distinct reports.sequence) as "subtotal_received" 
				from "incidents"
				left join "reports" on "incidents"."folio" = "reports"."incident_id"
				inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
				inner join "citizens" on "reports"."citizen_id" = "citizens"."id"
				left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
				inner join "codifications" on "codifications"."id" = "reports"."codification_id"
				left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
				left join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id"
				where "incidents"."active" = true and "incidents"."status_id" != 10
				and "incidents"."created_at" >=  :initialDate
				and "incidents"."created_at" <=   :finalDate
				and "reports"."codification_type_id" in (10,11,12,13)
				and "reports"."codification_id" in (2)
				and "reports"."active" = true
				and "incidents"."active" = true
				and "service_centers"."active" = true
        and "service_centers"."id" in (118,119,120,121,122,123)
				group by municipalities.municipality
				order by municipalities.municipality
		) "grand_total_received" on "municipalities"."municipality" = "grand_total_received"."municipality"

		left join(
				select municipalities.municipality,
				count(distinct reports.sequence) as "subtotal_solved"
				from "incidents"
				left join "reports" on "incidents"."folio" = "reports"."incident_id"
				inner join "settlements" on "reports"."settlement_id" = "settlements"."id"
				inner join "citizens" on "reports"."citizen_id" = "citizens"."id"
				left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
				inner join "codifications" on "codifications"."id" = "reports"."codification_id"
				left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
				left join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id"
				where "incidents"."active" = true and "incidents"."status_id" != 10
				and "incidents"."created_at" >=  :initialDate
				and "incidents"."created_at" <=   :finalDate
				and "reports"."codification_type_id" in (10,11,12,13)
				and "reports"."codification_id" in (2)
				and "incidents"."status_id"  in(9)
				and "incidents"."close_id" in (12)
				and "reports"."active" = true
				and "incidents"."active" = true
				and "service_centers"."active" = true
				and "service_centers"."id" in (118,119,120,121,122,123)
				group by municipalities.municipality
				order by municipalities.municipality
		) "grand_total_solved" on "municipalities"."municipality" = "grand_total_solved"."municipality"
	where result.municipality is not null
group by result.municipality
,grand_total_received.subtotal_received, grand_total_solved.subtotal_solved
order by result.municipality
   
   
   `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  reconstruccionpavimentacion: (
    startDate,
    finalDate,
    codificationType,
    serviceCenter,
    municipality
  ) => {
    if (
      codificationType == "null" ||
      codificationType == null ||
      codificationType == "undefined" ||
      codificationType == undefined
    ) {
      codificationType = "1";
    }

    if (
      serviceCenter == "null" ||
      serviceCenter == null ||
      serviceCenter == "undefined" ||
      serviceCenter == undefined
    ) {
      serviceCenter = "";
    } else {
      serviceCenter = " and service_centers.id in (" + serviceCenter + ")";
    }

    if (
      municipality == "null" ||
      municipality == null ||
      municipality == "undefined" ||
      municipality == undefined
    ) {
      municipality = "";
    } else {
      municipality = " and reports.municipality_id in (" + municipality + ")";
    }
    const query = `
    select
		a.municipality,
		count( a.folio) as "total_incidents",
		json_agg( jsonb_build_object(
		'folio', a.folio ::varchar(255),
		'address',a.address ::varchar(255),
		'btw_street_first', COALESCE (CAST( a.btw_street_first AS varchar), 'Sin dato'):: varchar(255),
		'btw_street_second',  COALESCE (CAST( a.btw_street_second AS varchar), 'Sin dato'):: varchar(255),
		'alcaldia', a.municipality::varchar(255),
		'settlement', a.settlement::varchar(255),
		'grupo', COALESCE (CAST( "a"."group" AS varchar), 'Sin dato'):: varchar(255),
		'unidad_que_repara', "a"."service_center_name" ::varchar(255),
		'descripcion', "a"."description"::varchar(255),
		'pavimentacion', "a"."paving"::varchar(255),
		'reparacion_banqueta', "a"."sidewalk"::varchar(255)
)) as "incidents"
from (select 
		distinct "citizens"."fullname", 
		CONCAT(users.name||' '|| users.paterno||' '|| users.materno) as usuariocapturo, 
		"codification_types"."codification_type", "incidents"."folio", 
		"incidents"."status_id", 
		"incidents"."refuse_id", "incidents"."close_id", "incidents"."created_at", 
		"incidents"."repaired", "incidents"."assigned_tormenta", "incidents"."assigned_cuadrilla", 
		"reports"."reference", "reports"."address", "reports"."external_number", 
		"reports"."internal_number", "reports"."manzana", "reports"."lote", 
		"municipalities"."municipality", "reports"."municipality_id", 
		"reports"."btw_street_first", "reports"."btw_street_second", 
		"settlements"."settlement", "repairs"."description", "reports"."details",
		"repairs"."paving", "repairs"."sidewalk", "repairs"."material", "repairs"."surface",
		"repairs"."diameter", "service_centers"."name" as "service_center_name", 
		"service_centers"."id" as "service_center_id", "groups"."group" 
	from "incidents" 
		inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
		left join "repairs" on "incidents"."id" = "repairs"."incident_id" 
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
		left join "groups" on "groups"."id" = "incidents"."group_id" 
		inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
		inner join "settlements" on "reports"."settlement_id" = "settlements"."id" 
		inner join "municipalities" on "reports"."municipality_id" = "municipalities"."real_id" 
		inner join "citizens" on "reports"."citizen_id" = "citizens"."id" 
		inner join "users" on "users"."id" = "reports"."created_by" 
	where "incidents"."active" = true
  ${serviceCenter}
  ${municipality}
	and "incidents"."status_id" = 9
	and incidents.close_id in (12,13)
	and codification_types.id = :codificationType
	and "reports".road_id in (1,2)
	and "groups".id in (1,5)
	and ("repairs"."paving" = true
	or "repairs"."sidewalk" = true)
	and "incidents"."created_at" >=  :initialDate
	and "incidents"."created_at" <= :finalDate 
	and "reports"."active" = true
	and "incidents"."active" = true
	and "service_centers"."active" = true 
	and "codifications"."active" = true
) a
group by a.municipality

    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        codificationType,
      },
      type: QueryTypes.SELECT,
    });
  },
  reportespendientesalcaldias: (startDate, finalDate, todayFormatted) => {
    const query = `Select
    COALESCE("a"."municipality","municipalities"."municipality") "municipality",
      COALESCE("a"."folio",0) "a",
    COALESCE("b"."folio",0) "b",
    COALESCE("c"."folio",0) "c",
    COALESCE("d"."folio",0) "d",
    COALESCE("e"."folio",0) "e",
    COALESCE("f"."folio",0) "f",
    COALESCE("g"."folio",0) "g",
    COALESCE("h"."folio",0) "h",
    COALESCE("i"."folio",0) "i",
    COALESCE("j"."folio",0) "j",
    COALESCE( COALESCE(CAST("a"."folio" AS INTEGER),0)+COALESCE(CAST("b"."folio" AS INTEGER),0)+
           COALESCE(CAST("c"."folio" AS INTEGER),0)+COALESCE(CAST("d"."folio" AS INTEGER),0)+
           COALESCE(CAST("e"."folio" AS INTEGER),0)+COALESCE(CAST("f"."folio" AS INTEGER),0)+
           COALESCE(CAST("g"."folio" AS INTEGER),0)+COALESCE(CAST("h"."folio" AS INTEGER),0)+
           COALESCE(CAST("i"."folio" AS INTEGER),0)+COALESCE(CAST("j"."folio" AS INTEGER),0)) "total"

    from municipalities

    LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in(0)
   group by municipalities.municipality
   order by municipalities.municipality ) "a" ON "municipalities"."municipality" = "a"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
    and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (1, 2)
  group by municipalities.municipality
  order by municipalities.municipality ) "b" ON "municipalities"."municipality" = "b"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (3, 4)
  group by municipalities.municipality
  order by municipalities.municipality ) "c" ON "municipalities"."municipality" = "c"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (5, 6, 7)
  group by municipalities.municipality
  order by municipalities.municipality ) "d" ON "municipalities"."municipality" = "d"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (8, 9, 10)
  group by municipalities.municipality
  order by municipalities.municipality ) "e" ON "municipalities"."municipality" = "e"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=11  
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) <=(20)
  group by municipalities.municipality
  order by municipalities.municipality ) "f" ON "municipalities"."municipality" = "f"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=21
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd'))<=(30)
  group by municipalities.municipality
  order by municipalities.municipality ) "g" ON "municipalities"."municipality" = "g"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=31
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) <=(60)
  group by municipalities.municipality
  order by municipalities.municipality ) "h" ON "municipalities"."municipality" = "h"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=61
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) <(90)
  group by municipalities.municipality
  order by municipalities.municipality ) "i" ON "municipalities"."municipality" = "i"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (5)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >= 90
  group by municipalities.municipality
  order by municipalities.municipality ) "j" ON "municipalities"."municipality" = "j"."municipality" `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        todayFormatted: todayFormatted,
      },
      type: QueryTypes.SELECT,
    });
  },
  reportespendientesacmex: (startDate, finalDate, todayFormatted) => {
    const query = `Select
    COALESCE("a"."municipality","municipalities"."municipality") "municipality",
      COALESCE("a"."folio",0) "k",
    COALESCE("b"."folio",0) "l",
    COALESCE("c"."folio",0) "m",
    COALESCE("d"."folio",0) "n",
    COALESCE("e"."folio",0) "o",
    COALESCE("f"."folio",0) "p",
    COALESCE("g"."folio",0) "q",
    COALESCE("h"."folio",0) "r",
    COALESCE("i"."folio",0) "s",
    COALESCE("j"."folio",0) "t",
    COALESCE( COALESCE(CAST("a"."folio" AS INTEGER),0)+COALESCE(CAST("b"."folio" AS INTEGER),0)+
           COALESCE(CAST("c"."folio" AS INTEGER),0)+COALESCE(CAST("d"."folio" AS INTEGER),0)+
           COALESCE(CAST("e"."folio" AS INTEGER),0)+COALESCE(CAST("f"."folio" AS INTEGER),0)+
           COALESCE(CAST("g"."folio" AS INTEGER),0)+COALESCE(CAST("h"."folio" AS INTEGER),0)+
           COALESCE(CAST("i"."folio" AS INTEGER),0)+COALESCE(CAST("j"."folio" AS INTEGER),0)) "total"

    from municipalities

    LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (0)
   group by municipalities.municipality
   order by municipalities.municipality ) "a" ON "municipalities"."municipality" = "a"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
    and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (1, 2)
  group by municipalities.municipality
  order by municipalities.municipality ) "b" ON "municipalities"."municipality" = "b"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (3, 4)
  group by municipalities.municipality
  order by municipalities.municipality ) "c" ON "municipalities"."municipality" = "c"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (5, 6, 7)
  group by municipalities.municipality
  order by municipalities.municipality ) "d" ON "municipalities"."municipality" = "d"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) in (8, 9, 10)
  group by municipalities.municipality
  order by municipalities.municipality ) "e" ON "municipalities"."municipality" = "e"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=11  
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) <=(20)
  group by municipalities.municipality
  order by municipalities.municipality ) "f" ON "municipalities"."municipality" = "f"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=21
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd'))<=(30)
  group by municipalities.municipality
  order by municipalities.municipality ) "g" ON "municipalities"."municipality" = "g"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=31
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) <=(60)
  group by municipalities.municipality
  order by municipalities.municipality ) "h" ON "municipalities"."municipality" = "h"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >=61
	  and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) <(90)
  group by municipalities.municipality
  order by municipalities.municipality ) "i" ON "municipalities"."municipality" = "i"."municipality"


  LEFT JOIN (
    Select
      municipalities.municipality,
      count(distinct incidents.folio) as folio
      from "incidents"
      left Join "reports" on "incidents"."folio" = "reports"."incident_id"
      join "settlements" on "reports"."settlement_id" = "settlements"."id"
      join "citizens" on "reports"."citizen_id" = "citizens"."id"
      left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
      join "codifications" on "codifications"."id" = "reports"."codification_id"
      left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
      join "users" on "users"."id" = "reports"."created_by"
      left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
      where "incidents"."active" = true
      and "service_centers"."active" = true
      and "codifications"."active" =true
      and "incidents"."created_at" >=   :initialDate
      and "incidents"."created_at" <=   :finalDate
      and incidents.status_id != 10
      and incidents.status_id != 9
      and incidents.group_id in (1)
      and "reports"."codification_type_id" = 1
      and exists (select municipalities.real_id from municipalities where "active" = true order by municipalities.municipality)
      and ( select :todayFormatted - to_date(to_char(incidents."created_at", 'yyyy-mm-dd'),'yyyy-mm-dd')) >= 90
  group by municipalities.municipality
  order by municipalities.municipality ) "j" ON "municipalities"."municipality" = "j"."municipality" `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
        todayFormatted: todayFormatted,
      },
      type: QueryTypes.SELECT,
    });
  },

  reparacionesfugasaguapotablemunicipality: (startDate, finalDate) => {
    const query = `
    select  
	COALESCE("a"."municipality","municipalities"."municipality") "municipality",
  COALESCE("a"."count",0) "incidents_total",
  COALESCE("b"."count",0) "incidents_not_received",
	COALESCE( COALESCE(CAST("a"."count" AS INTEGER),0)-COALESCE(CAST("b"."count" AS INTEGER),0)-COALESCE(CAST("f"."count" AS INTEGER),0)-COALESCE(CAST("c"."count" AS INTEGER),0)-COALESCE(CAST("d"."count" AS INTEGER),0)-COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_process",
	COALESCE( COALESCE(CAST("c"."count" AS INTEGER),0)+COALESCE(CAST("d"."count" AS INTEGER),0)+COALESCE(CAST("e"."count" AS INTEGER),0)) "incidents_inexists_wrong_location_dup",
	COALESCE("f"."count",0) "incidents_repaired",
	COALESCE("g"."count",0) "incidents_pending"
	
from municipalities
-- CONSULTA TOTAL RECIBIDOS POR CODIFICACION
    LEFT JOIN (
	Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1		
    group by municipalities.municipality
    order by municipalities.municipality ) "a" ON "municipalities"."municipality" = "a"."municipality"
	
--CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
   LEFT JOIN (
   Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1	
		and (("incidents"."status_id"  in(3)
		and "incidents"."assigned_tormenta" is null
		and "incidents"."assigned_cuadrilla" is null)
		or ("incidents"."status_id" in(6)
		and "incidents"."assigned_tormenta" is null
		and "incidents"."assigned_cuadrilla" is null)
		or("incidents"."status_id" in(4)
		and "incidents"."assigned_tormenta" is null
		and "incidents"."assigned_cuadrilla" is null)
		and "incidents"."close_id" is null
		and "incidents"."refuse_id" is null
		)
    group by municipalities.municipality
    order by municipalities.municipality ) "b" ON "municipalities"."municipality" = "b"."municipality"
	
	
	
-- CONSULTA REPORTES INEXISTENTES, DUPLICADOS Y MALAS UBICACIONES
    LEFT JOIN (
    Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1
		and (("incidents"."status_id"  in(10)
		and "incidents"."close_id" in (1))
		or ("incidents"."status_id" in(9)
		and "incidents"."close_id" in (1))
		)
    group by municipalities.municipality
    order by municipalities.municipality) "c" ON "municipalities"."municipality" = "c"."municipality"
    
-- CONSULTA REPORTES MALA UBICACIÓN
   LEFT JOIN (
   Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1
		
		and "reports"."duplicated" = false
		and incidents.status_id != 10
		and incidents.group_id in (1)
		and "reports"."codification_type_id" = 1	
		and (("incidents"."status_id"  in(10)
		and "incidents"."refuse_id" in (3))
		or ("incidents"."close_id" in (6))
		)
    group by municipalities.municipality
    order by municipalities.municipality) "d" ON "municipalities"."municipality" = "d"."municipality"
    
-- CONSULTA REPORTES DUPLICADOS
    LEFT JOIN (
    Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1
		and (("incidents"."status_id"  in(10)
		and "incidents"."close_id" in (13))
		or ("incidents"."status_id"  in(9)
		and "incidents"."close_id" in (13))
		)
    group by municipalities.municipality
    order by municipalities.municipality) "e" ON "municipalities"."municipality" = "e"."municipality"
	 
-- CONSULTA FUGAS PENDIENTES
    LEFT JOIN (
    Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1	
		and "incidents"."status_id" in(3,4,5,6,7)
    group by municipalities.municipality
    order by "municipalities"."municipality") "g" ON "municipalities"."municipality" = "g"."municipality"
	
-- CONSULTA REPORTES REPARADOS
	LEFT JOIN (
    Select
		municipalities."municipality", 
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (5)	
		and "reports"."codification_type_id" = 1
		and "incidents"."status_id"  in(9)
		and "incidents"."close_id" in (12)
    group by municipalities.municipality
    order by "municipalities"."municipality") "f" ON "municipalities"."municipality" = "f"."municipality"

    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  reparacionesfugasaguapotablecamp: (startDate, finalDate) => {
    const query = `
select distinct  "service_centers"."name",
    COALESCE("h"."count",0) "incidents_total_camp",
    COALESCE("i"."count",0) "incidents_not_received_camp",
	COALESCE( COALESCE(CAST("h"."count" AS INTEGER),0)-COALESCE(CAST("i"."count" AS INTEGER),0)-COALESCE(CAST("n"."count" AS INTEGER),0)-COALESCE(CAST("j"."count" AS INTEGER),0)-COALESCE(CAST("k"."count" AS INTEGER),0)-COALESCE(CAST("l"."count" AS INTEGER),0)) "incidents_process_camp",
	COALESCE( COALESCE(CAST("j"."count" AS INTEGER),0)+COALESCE(CAST("k"."count" AS INTEGER),0)+COALESCE(CAST("l"."count" AS INTEGER),0)) "incidents_inexists_wrong_location_dup_camp",
	COALESCE("n"."count",0) "incidents_repaired_camp",
	COALESCE("m"."count",0) "incidents_pending_camp"
	
from service_centers
-- CONSULTA TOTAL RECIBIDOS POR CODIFICACION
    LEFT JOIN (
	Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
		
		and "service_centers"."codification_types_serve"::jsonb@> '[1]'
   group by service_centers.name
    order by service_centers.name ) "h" ON "service_centers"."name" = "h"."name"
	
--CONSULTA PARA REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS
   LEFT JOIN (
   Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
	   
	   and "service_centers"."codification_types_serve"::jsonb@> '[1]'
		and (("incidents"."status_id"  in(3)
		and "incidents"."assigned_tormenta" is null
		and "incidents"."assigned_cuadrilla" is null)
		or ("incidents"."status_id" in(6)
		and "incidents"."assigned_tormenta" is null
		and "incidents"."assigned_cuadrilla" is null)
		or("incidents"."status_id" in(4)
		and "incidents"."assigned_tormenta" is null
		and "incidents"."assigned_cuadrilla" is null)
		and "incidents"."close_id" is null
		and "incidents"."refuse_id" is null
		)
    group by service_centers.name
     order by service_centers.name ) "i" ON "service_centers"."name" = "i"."name"
	
-- CONSULTA REPORTES INEXISTENTES, DUPLICADOS Y MALAS UBICACIONES
    LEFT JOIN (
    Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
		
		and "service_centers"."codification_types_serve"::jsonb@> '[1]'
		and (("incidents"."status_id"  in(10)
		and "incidents"."close_id" in (1))
		or ("incidents"."status_id" in(9)
		and "incidents"."close_id" in (1))
		)
   	group by service_centers.name
     order by service_centers.name ) "j" ON "service_centers"."name" = "j"."name"
-- CONSULTA REPORTES MALA UBICACIÓN
   LEFT JOIN (
   Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
		
		and "reports"."duplicated" = false
		and incidents.status_id != 10
		and incidents.group_id in (1)
		and "reports"."codification_type_id" = 1
	   
	   and "service_centers"."codification_types_serve"::jsonb@> '[1]'
		and (("incidents"."status_id"  in(10)
		and "incidents"."refuse_id" in (3))
		or ("incidents"."close_id" in (6))
		)
   group by service_centers.name
     order by service_centers.name ) "k" ON "service_centers"."name" = "k"."name"
-- CONSULTA REPORTES DUPLICADOS
    LEFT JOIN (
    Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
		
		and "service_centers"."codification_types_serve"::jsonb@> '[1]'
		and (("incidents"."status_id"  in(10)
		and "incidents"."close_id" in (13))
		or ("incidents"."status_id"  in(9)
		and "incidents"."close_id" in (13))
		)
   group by service_centers.name
     order by service_centers.name ) "l" ON "service_centers"."name" = "l"."name"
	
-- CONSULTA FUGAS PENDIENTES
    LEFT JOIN (
    Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
		
		and "service_centers"."codification_types_serve"::jsonb@> '[1]'
		and "incidents"."status_id" in(3,4,5,6,7)
   group by service_centers.name
    order by "service_centers"."name") "m" ON "service_centers"."name" = "m"."name"
	
-- CONSULTA REPORTES REPARADOS
	LEFT JOIN (
    Select
		service_centers."name",
        count(distinct incidents.folio) "count"
		from "incidents"
		left Join "reports" on "incidents"."folio" = "reports"."incident_id"
		left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id"
		left join "groups" on "groups"."id" = "incidents"."group_id"
		join "codifications" on "codifications"."id" = "reports"."codification_id"
		left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id"
		left join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
		where "incidents"."active" = true	
		and "reports"."active" = true
		and "groups"."active" = true
		and "service_centers"."active" = true
		and "codifications"."active" = true
		and "incidents"."created_at" >=  :initialDate
		and "incidents"."created_at" <=  :finalDate
		and incidents.status_id != 10
		and incidents.group_id in (1)	
		and "reports"."codification_type_id" = 1
		
		and "service_centers"."codification_types_serve"::jsonb@> '[1]'
		and "incidents"."status_id"  in(9)
		and "incidents"."close_id" in (12)
   	group by service_centers.name
    order by "service_centers"."name") "n" ON "service_centers"."name" = "n"."name"
	where  service_centers.group_id in (1)	
	and "service_centers"."codification_types_serve"::jsonb@> '[1]'
	and service_centers.active = true	
    
    
    `;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate,
        finalDate: finalDate,
      },
      type: QueryTypes.SELECT,
    });
  },
  getIncidentsByCodificationTypeBetweenDates: (
    startDate,
    finalDate,
    codificationId,
    codificationTypeId
  ) => {
    let andcodificationId,andCodificationTypeId;
    if (
      codificationId == "null" ||
      codificationId == null ||
      codificationId == "undefined" ||
      codificationId == undefined
    ) {
      andcodificationId = "and reports.codification_id in(1,2,3)";
    } else {
      andcodificationId =
        " and reports.codification_id in(" + codificationId + ")";
    }
    if (
      codificationTypeId == "null" ||
      codificationTypeId == null ||
      codificationTypeId == "undefined" ||
      codificationTypeId == undefined
    ) {
      andCodificationTypeId = "";
    } else {
      andCodificationTypeId =
        " and reports.codification_type_id in (" + codificationTypeId + ")";
    }
    const query = `select 
    "incidents"."folio" as "incident_folio",
    incidents.latitude as "incident_latitude",
    incidents.longitude as "incident_longitude",
    incidents.created_at as "incident_created_at",
    incidents.status_id as "incident_status_id",
    codifications.id as "incident_codification_id",
    "codification_types"."id" as "incident_codification_type_id"
       from "incidents" 
       inner join "reports" on "incidents"."folio" = "reports"."incident_id" 
       left join "service_centers" on "service_centers"."id" = "incidents"."service_center_id" 
       inner join "codifications" on "codifications"."id" = "reports"."codification_id" 
       left join "codification_types" on "codification_types"."id" = "reports"."codification_type_id" 
       inner join "municipalities" on "municipalities"."real_id" = "reports"."municipality_id"
       inner join settlements on settlements.id = "reports"."settlement_id"
         inner join statuses on statuses.id = incidents.status_id
         inner join citizens on citizens.id = reports.citizen_id
         left join durations on durations.id = reports.duration_id
     inner join "receipts" on reports.receipt_id = receipts.id
     where "incidents"."active" = true 
     and "incidents"."created_at" between :initialDate and :finalDate
     and "reports"."active" = true 
     and "incidents"."active" = true 
     and "service_centers"."active" = true
     and receipts.active = true
     and "codifications"."active" = true
     ${andcodificationId}
     ${andCodificationTypeId}
       group by incidents.id,"incidents"."folio",
       incidents.created_at,codifications.id,"codification_types"."id"
`;
    return postgresClient.query(query, {
      raw: true,
      replacements: {
        initialDate: startDate + " 00:00:00",
        finalDate: finalDate + " 23:59:59",
        codificationId,
        codificationTypeId,
      },
      type: QueryTypes.SELECT,
    });
  },
};
