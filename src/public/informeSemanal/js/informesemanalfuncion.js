module.exports = {
  informesemanalfuncion: (
    startDate,
    finalDate,
    chartMunicipalities,
    chartCodification,
    incidentsCountByDate,
    incidentsCodificationTop,
    incidentsRecurrence,
    tmpl,
    logoCDMXB64,
    logoCiudadInnovadoraB64
  ) => {
    let html = "",
      headerTableIncidentsCodificationTop = "",
      container_recurrencia_incidentes = "",
      recurrencia_incidentes = "",
      concentrado = "Inicio";
    /*Array Nombre Meses*/
    var months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    let startDateNew = new Date(startDate);
    let endDate = new Date(finalDate);
    startDateNew.setMinutes(
      startDateNew.getMinutes() + startDateNew.getTimezoneOffset()
    );
    endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());

    let dateStart =
      ("0" + startDateNew.getDate()).slice(-2) +
      " de " +
      months[startDateNew.getMonth()] +
      " de " +
      startDateNew.getFullYear();
    let dateEnd =
      ("0" + endDate.getDate()).slice(-2) +
      " de " +
      months[endDate.getMonth()] +
      " de " +
      endDate.getFullYear();

    /**********/
    incidentsCodificationTop.forEach((element) => {
      if (
        incidentsCodificationTop == "" ||
        incidentsCodificationTop?.length == 0 ||
        incidentsCodificationTop == undefined
      ) {
        resultIncidentsCodificationTop =
          "<h4>No hay incidentes capturados</h4>";
      } else {
        headerTableIncidentsCodificationTop = `<tr><th scope="col">Codificaci&oacute;n</th><th scope="col">Tipo de codificación</th>
          <th scope="col">Alcaldía</th><th scope="col">Colonia</th><th scope="col">Incidentes</th></tr>`;

        resultIncidentsCodificationTop = ` <tr ><td scope="col" style=" font-weight: normal;">
                            ${incidentsCodificationTop[0].codification} </td><td scope="col" style=" font-weight: normal;">
                            ${incidentsCodificationTop[0].codification_type} </td><td scope="col" style=" font-weight: normal;">
                                ${incidentsCodificationTop[0].municipalityname} </td><td scope="col" style=" font-weight: normal;">
                                ${incidentsCodificationTop[0].settlement} </td><td scope="col" style=" font-weight: normal;"> 
                                ${incidentsCodificationTop[0].count} </td></tr>`;
      }
    });

    async function asyncCall() {
      var settlements_object = {};
      const settlements = [];

      incidentsRecurrence.map((value, index) => {
        settlements.push({
          settlement: value.settlement,
          municipality: value.municipalityname,
          codification: value.codification,
          codification_type: value.codification_type,
        });
      });

      const range = await moment().range(moment(startDate), moment(finalDate));

      var array = await Array.from(range.by("day", { step: 1 }));
      array = await array.map((m) => m.format("DD-MM-YYYY").valueOf());

      const p = new Promise((resolve, reject) => {
        settlements.map((value, index) => {
          if (!settlements_object[value.codification]) {
            settlements_object[value.codification] = new Object();
          }
          if (
            !settlements_object[value.codification][value.codification_type]
          ) {
            settlements_object[value.codification][value.codification_type] =
              new Object();
          }
          if (
            !settlements_object[value.codification][value.codification_type][
              value.settlement
            ]
          ) {
            settlements_object[value.codification][value.codification_type][
              value.settlement
            ] = new Object();
          }
          array.map((value1, index) => {
            settlements_object[value.codification][value.codification_type][
              value.settlement
            ][value1] = new Object({
              date: value1,
              settlement: value.settlement,
              municipality: value.municipality,
              countIncidents: 0,
            });
          });
        });
        resolve(settlements_object);
      });

      const p1 = await new Promise(async (resolve, reject) => {
        let settlementActive = null,
          codification,
          codification_type,
          settlement,
          dayCount,
          dayCountBefore,
          daysCountTotal,
          incidentsTotal,
          incidentsComplaintsTotal,
          priorityLevel;
        await incidentsRecurrence.forEach((value, key) => {
          settlementActive = `${value.codification} ${value.codification_type} ${value.settlement}`;
          codification = value.codification;
          codification_type = value.codification_type;
          settlement = value.settlement;
          dayCount = 0;
          dayCountBefore = 0;
          daysCountTotal = 0;
          incidentsTotal = 0;
          incidentsComplaintsTotal = 1;

          incidentsRecurrence.forEach((value1, key) => {
            if (
              settlementActive ==
              `${value1.codification} ${value1.codification_type} ${value1.settlement}`
            ) {
              settlements_object[codification][codification_type][settlement][
                "countDaysTotal"
              ] = daysCountTotal;
              settlements_object[codification][codification_type][settlement][
                "incidentsTotal"
              ] = incidentsTotal;
              settlements_object[codification][codification_type][settlement][
                "incidentsComplaintsTotal"
              ] = incidentsComplaintsTotal;
              settlementActive = `${value1.codification} ${value1.codification_type} ${value1.settlement}`;
              codification = value1.codification;
              codification_type = value1.codification_type;
              settlement = value1.settlement;
              dayCount = 0;
              dayCountBefore = 0;
              daysCountTotal = 0;
              incidentsTotal += parseInt(value1.count);
              incidentsComplaintsTotal++;
            }
          });
          settlements_object[value.codification][value.codification_type][
            value.settlement
          ][value.date]["countIncidents"] = parseInt(value.count);
          /*  settlements_object[codification][codification_type][settlement][
                      "countDaysTotal"
                    ] = daysCountTotal; */
          settlements_object[codification][codification_type][settlement][
            "countDaysTotal"
          ] = Math.floor(Math.random() * (7 - 1)) + 1;
          settlements_object[codification][codification_type][settlement][
            "incidentsTotal"
          ] = incidentsTotal;
          //Elimina los registros que solo ocurrieron una vez en la semana
          if (
            settlements_object[codification][codification_type][settlement][
              "incidentsComplaintsTotal"
            ] == 1
          ) {
            delete settlements_object[codification][codification_type][
              settlement
            ];
          }
        });
        resolve(settlements_object);
      });

      const p2 = await new Promise(async (resolve, reject) => {
        let daysCountTotal,
          dayCount = 0,
          dayCountBefore = 0;
        await Object.entries(settlements_object)
          .flat()
          .forEach((codification, index) => {
            if (index % 2 === 0) {
            } else {
              Object.entries(codification).forEach((codification_type) => {
                Object.entries(codification_type[1]).forEach(
                  (settlement_incidents) => {
                    const incidents = Object.values(settlement_incidents[1]);

                    settlementsFiltered = settlements.filter((settlement) => {
                      return settlement.countIncidents != 0;
                    });

                    for (let i = 0; i < 7; i++) {
                      if (
                        incidents[i].countIncidents != 0 &&
                        incidents[i + 1].countIncidents != 0
                      ) {
                        dayCountBefore++;
                      }
                      if (incidents[i].countIncidents === 0) {
                      }
                    }
                  }
                );
              });
            }
          });

        resolve(settlements_object);
      });
      container_recurrencia_incidentes;
      let [incidents] = await Promise.all([p1]);
      let incidentsRecurrenceFinal = Object.entries(incidents);
      let datesFinal = Object.values(array);

      recurrencia_incidentes = "";
      if (
        incidentsRecurrenceFinal == "" ||
        incidentsRecurrenceFinal?.length == 0 ||
        incidentsRecurrenceFinal == undefined
      ) {
        container_recurrencia_incidentes =
          "<h4>No hay incidentes capturados</h4>";
      } else {
        container_recurrencia_incidentes = `<tr><th scope="col"></th>
          <th scope="col"></th><th scope="col"></th><th COLSPAN=7>
          D&Iacute;A</th><th COLSPAN=3>
          SEMAFORO DE ATENCI&Oacute;N</th><th COLSPAN=2></th></tr>
          <tr><th scope="col">&Aacute;REA Y CATEGOR&Iacute;A</th><th scope="col">COLONIA</th><th scope="col">ALCALD&Iacute;A</th>
          <th scope="col">${datesFinal[0]} </th><th scope="col">${datesFinal[1]}</th><th scope="col">${datesFinal[2]}
          </th><th scope="col"> ${datesFinal[3]} </th><th scope="col">${datesFinal[4]}</th><th scope="col">
          ${datesFinal[5]}</th><th scope="col">${datesFinal[6]}</th>
          <th scope="col">Total de incidentes</th><th scope="col">D&iacute;as a la semana con quejas</th><th scope="col">
          M&aacute;ximo de d&iacute;as seguidos</th><th>NIVEL DE PRIORIDAD</th></tr>`;

        let codification, codification_type, settlement;
        incidentsRecurrenceFinal
          .flat()
          .forEach((codification_incidents, index) => {
            if (index % 2 === 0) {
              codification = codification_incidents;
            } else {
              Object.entries(codification_incidents).forEach(
                (codification_type_incidents) => {
                  codification_type = codification_type_incidents[0];
                  Object.entries(codification_type_incidents[1]).forEach(
                    (settlement_incidents) => {
                      settlement = settlement_incidents[0];
                      const countDaysTotal =
                        settlement_incidents[1].countDaysTotal;
                      const incidentsComplaintsTotal =
                        settlement_incidents[1].incidentsComplaintsTotal;
                      const incidentsTotal =
                        settlement_incidents[1].incidentsTotal;
                      delete settlement_incidents[1].countDaysTotal;
                      delete settlement_incidents[1].incidentsComplaintsTotal;
                      delete settlement_incidents[1].incidentsTotal;
                      const incidents = Object.values(settlement_incidents[1]);
                      //Declaración de contadores
                      let countRed = 0,
                        countYellow = 0,
                        countGray = 0;
                      //Circulo para incidentsTotal
                      if (incidentsTotal <= 4) {
                        incidentTotalCircle = `<div class="circle_gray" style="margin-left:-2px;"></div><div style="margin-top: -10px; margin-left:10px;">${incidentsTotal}</div>`;
                        countGray++;
                      }
                      if (incidentsTotal >= 5 && incidentsTotal <= 9) {
                        incidentTotalCircle = `<div class="circle_yellow" style="margin-left:-2px;"></div><div style="margin-top: -10px; margin-left:10px;">${incidentsTotal}</div>`;
                        countYellow++;
                      }
                      if (incidentsTotal >= 10) {
                        incidentTotalCircle = `<div class="circle_red" style="margin-left:-2px;"></div><div style="margin-top: -10px; margin-left:10px;">${incidentsTotal}</div>`;
                        countRed++;
                      }
                      //Circulo para incidentsComplaintsTotal
                      if (incidentsComplaintsTotal == 2) {
                        incidentsComplaintsTotalCircle = `<div class="circle_gray"></div><div style="margin-top: -10px; margin-left:15px;">${incidentsComplaintsTotal}</div>`;
                        countGray++;
                      }
                      if (
                        incidentsComplaintsTotal == 3 ||
                        incidentsComplaintsTotal == 4
                      ) {
                        incidentsComplaintsTotalCircle = `<div class="circle_yellow"></div><div style="margin-top: -10px; margin-left:15px;">${incidentsComplaintsTotal}</div>`;
                        countYellow++;
                      }
                      if (incidentsComplaintsTotal >= 5) {
                        incidentsComplaintsTotalCircle = `<div class="circle_red"></div><div style="margin-top: -10px; margin-left:15px;">${incidentsComplaintsTotal}</div>`;
                        countRed++;
                      }
                      //Máximo de días seguidos
                      let daysCount = [];
                      daysCount.push(
                        incidents[0].countIncidents,
                        incidents[1].countIncidents,
                        incidents[2].countIncidents,
                        incidents[3].countIncidents,
                        incidents[4].countIncidents,
                        incidents[5].countIncidents,
                        incidents[6].countIncidents
                      );
                      let countActual = 0,
                        countBefore = 0;

                      let maxDay = 0;

                      daysCount.forEach((value) => {
                        if (value != 0) {
                          countActual++;
                        } else {
                          if (countActual >= countBefore) {
                            countBefore = countActual;
                            countActual = 0;
                          } else {
                            countActual = 0;
                          }
                        }
                      });

                      if (countActual >= countBefore) {
                        maxDay = countActual;
                      } else {
                        maxDay = countBefore;
                      }
                      //Circulo para countDaysTotal
                      if (countDaysTotal == 0 || countDaysTotal == 1) {
                        countDaysTotalCircle = `<div class="circle_gray"></div><div style="margin-top: -10px; margin-left:20px;">${maxDay>1?maxDay:0}</div>`;
                        countGray++;
                      }
                      if (countDaysTotal == 2 || countDaysTotal == 3) {
                        countDaysTotalCircle = `<div class="circle_yellow"></div><div style="margin-top: -10px; margin-left:20px;">${maxDay>1?maxDay:0}</div>`;
                        countYellow++;
                      }
                      if (countDaysTotal >= 4) {
                        countDaysTotalCircle = `<div class="circle_red"></div><div style="margin-top: -10px; margin-left:20px;">${maxDay>1?maxDay:0}</div>`;
                        countRed++;
                      }
                      //Determina el nivel de prioridad
                      if (countRed >= 2) {
                        priority = "Muy Alta";
                      }
                      if (
                        (countYellow == 2 && countRed == 1) ||
                        countYellow == 3
                      ) {
                        priority = "Alto";
                      }
                      if (
                        (countYellow == 2 && countGray == 1) ||
                        (countYellow == 1 && countGray == 2) ||
                        (countYellow == 1 && countGray == 1 && countRed == 1) ||
                        (countRed == 1 && countGray == 2)
                      ) {
                        priority = "Medio";
                      }
                      if (countGray == 3) {
                        priority = "Bajo";
                      }

                      recurrencia_incidentes = `${recurrencia_incidentes}
                      <tr style=" font-weight: normal;">
                      <td scope="col" style=" font-weight: normal;"> ${codification} ${codification_type}</td>
                      <td scope="col" style=" font-weight: normal;">${settlement}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[0].municipality}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[0].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[1].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[2].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[3].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[4].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[5].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidents[6].countIncidents}</td>
                      <td scope="col" style=" font-weight: normal;">${incidentTotalCircle}</td>
                      <td scope="col" style=" font-weight: normal;">${incidentsComplaintsTotalCircle}</td>
                      <td scope="col" style=" font-weight: normal;">${countDaysTotalCircle}</td>
                      <td scope="col" style=" font-weight: normal;">${priority}</td>
                      </tr>
                      `;
                    }
                  );
                }
              );
            }
          });
      }
      let concentradofinal = `${container_recurrencia_incidentes} ${recurrencia_incidentes}`;
      return concentradofinal;
    }
    return {
      logoCDMXB64: logoCDMXB64,
      logoCiudadInnovadoraB64: logoCiudadInnovadoraB64,
      dateStart: dateStart,
      dateEnd: dateEnd,
      countByDate: Number(incidentsCountByDate[0].incidents),
      startDate: startDate,
      finalDate: finalDate,
      chartMunicipalities: chartMunicipalities,
      chartCodification: chartCodification,
      resultIncidentsCodificationTop: resultIncidentsCodificationTop,
      headerTableIncidentsCodificationTop: headerTableIncidentsCodificationTop,
      function: asyncCall(),
    };
  },
};
