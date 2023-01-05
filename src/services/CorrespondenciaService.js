/* eslint-disable no-multi-str */
const { QueryTypes } = require('sequelize');
const { sequelizeMssql } = require('../models/index.js');

// let t;
module.exports = {
  getAllCorrespondenciaByYear: (year) => {
    const query = 'SELECT a2.*,\
        CASE\
            WHEN [status] = \'CONTESTADA\' THEN [derivada]\
            ELSE [status]\
        END AS derivada,\
        CASE\
          WHEN [status] = \'CONTESTADA\' OR [status] = \'DE CONOCIMIENTO\' THEN 0\
          ELSE DATEDIFF(DAY, fecha_creacion , GETDATE())\
        END AS diferencia_dias\
        FROM (\
        SELECT\
            a1.*,\
            CASE\
              WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
              AND espera_respuesta = \'NO ESPERA\' \
              THEN \'DE CONOCIMIENTO\' \
              WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
              AND espera_respuesta <> \'NO ESPERA\' \
              AND espera_respuesta <> \'RESPONDIDA\' \
              AND derivada = \'NO TIENE DERIVADA\' \
              THEN \'NO CONTESTADA\' \
            WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
              AND espera_respuesta = \'RESPONDIDA\' \
              AND derivada = \'NO TIENE DERIVADA\' \
            THEN \'NO CONTESTADA\' \
              WHEN derivada = \'RESPUESTA EN ELABORACION\' \
              THEN \'EN ELABORACION\' \
              ELSE \'CONTESTADA\' \
            END AS status  FROM\
        (\
        SELECT \
        c.codigo_registro,\
        c.desccorr, CD.codest,\
        C.codcorr AS codcorr_externo,\
        CD.codcorr AS codcorr_interno,\
        CASE\
            WHEN C.codprior = 1 THEN \'URGENTE\'\
            ELSE \'RUTINA\'\
        END AS prioridad,\
        CASE\
          WHEN LEFT(v.codarea,4) = 0101 THEN \'DIRECCIÓN GENERAL DE APOYO TÉCNICO Y PLANEACIÓN\'\
          WHEN LEFT(v.codarea,4) = 0103 THEN \'DIRECCIÓN DE CONCERTACIÓN CIUDADANA\'\
          WHEN LEFT(v.codarea,4) = 0104 THEN \'DIRECCIÓN EJECUTIVA DE ASUNTOS JURÍDICOS\'\
          WHEN LEFT(v.codarea,4) = 0107 THEN \'DIRECCIÓN GENERAL DE SERVICIOS A USUARIOS\'\
          WHEN LEFT(v.codarea,4) = 0108 THEN \'DIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS\'\
          WHEN LEFT(v.codarea,4) = 0109 THEN \'DIRECCIÓN GENERAL DE AGUA POTABLE\'\
          WHEN LEFT(v.codarea,4) = 0111 THEN \'DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN  Y COMUNICACIONES\'\
          WHEN LEFT(v.codarea,4) = 0112 THEN \'DIRECCIÓN DE LA UNIDAD DE IGUALDAD SUSTANTIVA\'\
          WHEN LEFT(v.codarea,4) = 0114 THEN \'DIRECCIÓN GENERAL DE DRENAJE\'\
          ELSE \'COORDINACIÓN GENERAL DEL SISTEMA DE AGUAS DE LA CD. DE MÉXICO\'\
        END AS area_responsable,\
        CASE \
          WHEN CR.es_respuesta = 1 THEN \'RESPUESTA OFICIAL\'\
          WHEN CR.es_respuesta = 0 THEN \'RESPUESTA NO OFICIAL\'\
          ELSE \'DOCUMENTO ORIGINAL\'\
        END AS hay_respuesta,\
        CONVERT(VARCHAR(20), c.fecregcorr, 120) as fecha_creacion,\
        RTRIM(LTRIM(D.nombre +\' \' +D.apellido)) AS nombre_completo_emisor,\
        I.nominst AS institucion,\
        CASE \
          WHEN CR.correspondencia_derivada IS NOT NULL AND CD.codigo_registro IS NOT NULL  THEN RTRIM(LTRIM(CD.codigo_registro +\'->\' +CD.desccorr)) \
          WHEN CR.correspondencia_derivada IS NOT NULL AND CD.codigo_registro IS NULL  THEN \'RESPUESTA EN ELABORACION\'\
          ELSE \'NO TIENE DERIVADA\'\
          END AS derivada,\
          CASE \
          WHEN C.esperaresp = \'S\' THEN \'SI ESPERA\'\
          WHEN C.esperaresp = \'R\' THEN \'RESPONDIDA\'\
          WHEN C.esperaresp = \'N\' THEN \'NO ESPERA\'\
          ELSE \'NO ESPERA\'\
        END AS espera_respuesta,\
        COALESCE(T.duracion_gestion_horas,0)/24 AS tiempo_respuesta_en_dias \
        FROM recorrido R\
          JOIN correspondencia C ON C.codcorr = R.codcorr\
          JOIN destino_correspondencia D ON D.codcorr = C.codcorr\
          JOIN instituciones I ON I.codinst = D.codinst\
          FULL JOIN tipo_correspondencia T ON C.codigo_tipo = T.codigo_tipo\
          LEFT JOIN correspondencias_relacionadas CR ON CR.correspondencia_origen = C.codcorr\
          JOIN v_DespachosAdministracion v ON v.codigo_despa = r.codigo_despa \
          LEFT JOIN correspondencia CD ON CD.codcorr = CR.correspondencia_derivada\
        WHERE \
          c.codest NOT IN (7,1,8) AND\
          c.despacho_registrador IN (\'SA045\',\'SA046\',\'SA047\') \
          AND c.codigo_registro LIKE \'%EXT%\' AND\
          R.copia = 1 AND\
          R.codest IN (3,4,13,14)) AS a1) AS a2 WHERE [codigo_registro] LIKE :year';
    return sequelizeMssql.query(query, {
      raw: true,
      replacements: { year: `EXT%${year}` },
      type: QueryTypes.SELECT,
    });
  },
  getCountCorrespondenciaForAreaResponsableByYear: (year) => {
    const query = 'SELECT area_responsable AS name,\
    COUNT(area_responsable) AS value \
    FROM (\
    SELECT\
        a1.*,\
        CASE\
          WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
          AND espera_respuesta = \'NO ESPERA\' \
          THEN \'DE CONOCIMIENTO\' \
          WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
          AND espera_respuesta <> \'NO ESPERA\' \
          AND espera_respuesta <> \'RESPONDIDA\' \
          AND derivada = \'NO TIENE DERIVADA\' \
          THEN \'NO CONTESTADA\' \
        WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
          AND espera_respuesta = \'RESPONDIDA\' \
          AND derivada = \'NO TIENE DERIVADA\' \
        THEN \'NO CONTESTADA\' \
          WHEN derivada = \'RESPUESTA EN ELABORACION\' \
          THEN \'EN ELABORACION\' \
          ELSE \'CONTESTADA\' \
        END AS status  FROM\
    (\
    SELECT \
    c.codigo_registro,\
    c.desccorr,\
    C.codcorr AS codcorr_externo,\
    CD.codcorr AS codcorr_interno,\
    CASE\
        WHEN C.codprior = 1 THEN \'URGENTE\'\
        ELSE \'RUTINA\'\
    END AS prioridad,\
    CASE\
      WHEN LEFT(v.codarea,4) = 0101 THEN \'DIRECCIÓN GENERAL DE APOYO TÉCNICO Y PLANEACIÓN\'\
      WHEN LEFT(v.codarea,4) = 0103 THEN \'DIRECCIÓN DE CONCERTACIÓN CIUDADANA\'\
      WHEN LEFT(v.codarea,4) = 0104 THEN \'DIRECCIÓN EJECUTIVA DE ASUNTOS JURÍDICOS\'\
      WHEN LEFT(v.codarea,4) = 0107 THEN \'DIRECCIÓN GENERAL DE SERVICIOS A USUARIOS\'\
      WHEN LEFT(v.codarea,4) = 0108 THEN \'DIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS\'\
      WHEN LEFT(v.codarea,4) = 0109 THEN \'DIRECCIÓN GENERAL DE AGUA POTABLE\'\
      WHEN LEFT(v.codarea,4) = 0111 THEN \'DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN  Y COMUNICACIONES\'\
      WHEN LEFT(v.codarea,4) = 0112 THEN \'DIRECCIÓN DE LA UNIDAD DE IGUALDAD SUSTANTIVA\'\
      WHEN LEFT(v.codarea,4) = 0114 THEN \'DIRECCIÓN GENERAL DE DRENAJE\'\
      ELSE \'COORDINACIÓN GENERAL DEL SISTEMA DE AGUAS DE LA CD. DE MÉXICO\'\
    END AS area_responsable,\
    CASE \
      WHEN CR.es_respuesta = 1 THEN \'RESPUESTA OFICIAL\'\
      WHEN CR.es_respuesta = 0 THEN \'RESPUESTA NO OFICIAL\'\
      ELSE \'DOCUMENTO ORIGINAL\'\
    END AS hay_respuesta,\
    CONVERT(VARCHAR(20), c.fecregcorr, 120) as fecha_creacion,\
    RTRIM(LTRIM(D.nombre +\' \' +D.apellido)) AS nombre_completo_emisor,\
    I.nominst AS institucion,\
    CASE \
      WHEN CR.correspondencia_derivada IS NOT NULL AND CD.codigo_registro IS NOT NULL  THEN RTRIM(LTRIM(CD.codigo_registro +\'->\' +CD.desccorr)) \
      WHEN CR.correspondencia_derivada IS NOT NULL AND CD.codigo_registro IS NULL  THEN \'RESPUESTA EN ELABORACION\'\
      ELSE \'NO TIENE DERIVADA\'\
      END AS derivada,\
      CASE \
      WHEN C.esperaresp = \'S\' THEN \'SI ESPERA\'\
      WHEN C.esperaresp = \'R\' THEN \'RESPONDIDA\'\
      WHEN C.esperaresp = \'N\' THEN \'NO ESPERA\'\
      ELSE \'NO ESPERA\'\
    END AS espera_respuesta,\
    T.duracion_gestion_horas AS tiempo_respuesta_en_horas\
    FROM recorrido R\
      JOIN correspondencia C ON C.codcorr = R.codcorr\
      JOIN destino_correspondencia D ON D.codcorr = C.codcorr\
      JOIN instituciones I ON I.codinst = D.codinst\
      FULL JOIN tipo_correspondencia T ON C.codigo_tipo = T.codigo_tipo\
      LEFT JOIN correspondencias_relacionadas CR ON CR.correspondencia_origen = C.codcorr\
      JOIN v_DespachosAdministracion v ON v.codigo_despa = r.codigo_despa \
      LEFT JOIN correspondencia CD ON CD.codcorr = CR.correspondencia_derivada\
    WHERE \
      c.codest NOT IN (7,1,8) AND\
      c.despacho_registrador IN (\'SA045\',\'SA046\',\'SA047\') \
      AND c.codigo_registro LIKE \'%EXT%\' AND\
      R.copia = 1 AND\
      R.codest IN (3,4,13,14)) AS a1) AS a2 WHERE [codigo_registro] LIKE :year \
      GROUP BY area_responsable';
    return sequelizeMssql.query(query, {
      raw: true,
      replacements: { year: `EXT%${year}` },
      type: QueryTypes.SELECT,
    });
  },
  getCountCorrespondenciaForStatusByYearAndAreaResponsable: (year) => {
    const query = 'SELECT area_responsable, status AS name,\
    COUNT(status) AS value \
    FROM (\
    SELECT\
        a1.*,\
        CASE\
          WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
          AND espera_respuesta = \'NO ESPERA\' \
          THEN \'DE CONOCIMIENTO\' \
          WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
          AND espera_respuesta <> \'NO ESPERA\' \
          AND espera_respuesta <> \'RESPONDIDA\' \
          AND derivada = \'NO TIENE DERIVADA\' \
          THEN \'NO CONTESTADA\' \
        WHEN hay_respuesta = \'DOCUMENTO ORIGINAL\' \
          AND espera_respuesta = \'RESPONDIDA\' \
          AND derivada = \'NO TIENE DERIVADA\' \
        THEN \'NO CONTESTADA\' \
          WHEN derivada = \'RESPUESTA EN ELABORACION\' \
          THEN \'EN ELABORACION\' \
          ELSE \'CONTESTADA\' \
        END AS status  FROM\
    (\
    SELECT \
    c.codigo_registro,\
    c.desccorr,\
    C.codcorr AS codcorr_externo,\
    CD.codcorr AS codcorr_interno,\
    CASE\
        WHEN C.codprior = 1 THEN \'URGENTE\'\
        ELSE \'RUTINA\'\
    END AS prioridad,\
    CASE\
      WHEN LEFT(v.codarea,4) = 0101 THEN \'DIRECCIÓN GENERAL DE APOYO TÉCNICO Y PLANEACIÓN\'\
      WHEN LEFT(v.codarea,4) = 0103 THEN \'DIRECCIÓN DE CONCERTACIÓN CIUDADANA\'\
      WHEN LEFT(v.codarea,4) = 0104 THEN \'DIRECCIÓN EJECUTIVA DE ASUNTOS JURÍDICOS\'\
      WHEN LEFT(v.codarea,4) = 0107 THEN \'DIRECCIÓN GENERAL DE SERVICIOS A USUARIOS\'\
      WHEN LEFT(v.codarea,4) = 0108 THEN \'DIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS\'\
      WHEN LEFT(v.codarea,4) = 0109 THEN \'DIRECCIÓN GENERAL DE AGUA POTABLE\'\
      WHEN LEFT(v.codarea,4) = 0111 THEN \'DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN  Y COMUNICACIONES\'\
      WHEN LEFT(v.codarea,4) = 0112 THEN \'DIRECCIÓN DE LA UNIDAD DE IGUALDAD SUSTANTIVA\'\
      WHEN LEFT(v.codarea,4) = 0114 THEN \'DIRECCIÓN GENERAL DE DRENAJE\'\
      ELSE \'COORDINACIÓN GENERAL DEL SISTEMA DE AGUAS DE LA CD. DE MÉXICO\'\
    END AS area_responsable,\
    CASE \
      WHEN CR.es_respuesta = 1 THEN \'RESPUESTA OFICIAL\'\
      WHEN CR.es_respuesta = 0 THEN \'RESPUESTA NO OFICIAL\'\
      ELSE \'DOCUMENTO ORIGINAL\'\
    END AS hay_respuesta,\
    CONVERT(VARCHAR(20), c.fecregcorr, 120) as fecha_creacion,\
    RTRIM(LTRIM(D.nombre +\' \' +D.apellido)) AS nombre_completo_emisor,\
    I.nominst AS institucion,\
    CASE \
      WHEN CR.correspondencia_derivada IS NOT NULL AND CD.codigo_registro IS NOT NULL  THEN RTRIM(LTRIM(CD.codigo_registro +\'->\' +CD.desccorr)) \
      WHEN CR.correspondencia_derivada IS NOT NULL AND CD.codigo_registro IS NULL  THEN \'RESPUESTA EN ELABORACION\'\
      ELSE \'NO TIENE DERIVADA\'\
      END AS derivada,\
      CASE \
      WHEN C.esperaresp = \'S\' THEN \'SI ESPERA\'\
      WHEN C.esperaresp = \'R\' THEN \'RESPONDIDA\'\
      WHEN C.esperaresp = \'N\' THEN \'NO ESPERA\'\
      ELSE \'NO ESPERA\'\
    END AS espera_respuesta,\
    T.duracion_gestion_horas AS tiempo_respuesta_en_horas\
    FROM recorrido R\
      JOIN correspondencia C ON C.codcorr = R.codcorr\
      JOIN destino_correspondencia D ON D.codcorr = C.codcorr\
      JOIN instituciones I ON I.codinst = D.codinst\
      FULL JOIN tipo_correspondencia T ON C.codigo_tipo = T.codigo_tipo\
      LEFT JOIN correspondencias_relacionadas CR ON CR.correspondencia_origen = C.codcorr\
      JOIN v_DespachosAdministracion v ON v.codigo_despa = r.codigo_despa \
      LEFT JOIN correspondencia CD ON CD.codcorr = CR.correspondencia_derivada\
    WHERE \
      c.codest NOT IN (7,1,8) AND \
      c.despacho_registrador IN (\'SA045\',\'SA046\',\'SA047\') \
      AND c.codigo_registro LIKE \'%EXT%\' AND \
      R.copia = 1 AND \
      R.codest IN (3,4,13,14)) AS a1) AS a2 WHERE [codigo_registro] LIKE :year \
      GROUP BY status,area_responsable';
    return sequelizeMssql.query(query, {
      raw: true,
      replacements: { year: `EXT%${year}` },
      type: QueryTypes.SELECT,
    });
  },
};
