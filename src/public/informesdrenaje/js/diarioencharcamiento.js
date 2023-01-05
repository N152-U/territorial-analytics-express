module.exports = {
  templatediarioencharcamiento: (startDate, finalDate, today, diarioencharcamientos, tmpl, getAllFloodingReasons, logoCDMXB64, logoCiudadInnovadoraB64) => {
    function promediame(array) {
      var suma = 0;
      for (var i = 0; i < array.length; i++) {
        suma += array[i];

      }
      return suma / array.length;
    }

    let grand_total = 0, header = "", floodingIncidents = "", index = 0, dataConsolidation = "";
    let solved = 0, in_process = 0, register = 0, contador = 0, average_solution_time = '', html, headMunicipality = '', headColumns = '',reasons='';
    getAllFloodingReasons.forEach((reason) => {
      reasons = `${reasons}
      <th
      style="background-color: #E5E8EA; font-size: 5.5pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
      ${reason.name}</th>
      `;
    });
    if (diarioencharcamientos != '') {
      let resume_metrics = diarioencharcamientos.map((value) => {
        solved = 0, in_process = 0, contador = 0, average_solution_time = '';
        grand_total += Number(value.subtotal_incidents);

        headMunicipality=`
        
          <table style="padding:0px;">
          <thead>
          <tr style="padding:0px;" color="#FF0000">
          <th color="#FF0000" colspan="11"
          class="bg-gradient-light" 
          style="background-color: #D9D9D9 !important; font-size: 7pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2 !important; border: 1px solid rgb(0, 0, 0) !important;">
          ALCALDÍA: ${value.municipality}</th>
          </tr>`;
        headColumns=`
          <tr>
          <td rowspan="2"
          style="width:3%; background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          No.</td>
          <td rowspan="2"
          style="width:10%; background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          FOLIO | FECHA</td>
          <td rowspan="2"
          style="width:10%; background-color: #E5E8EA  !important; font-size:5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          MEDIO DE RECEPCIÓN</td>
          <td rowspan="2"
          style="width:20%; background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          UBICACIÓN</td>
          <td colspan="3"
          style="width:35%;background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          DURACIÓN (HRS)</td>
          <td colspan="3"
          style="width:20%; background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          DIMENSIONES (M)</td>
          <td rowspan="3"
          style="width:20%; background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold !important; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          CAUSA</td>
          </tr>
          <tr>
          <td
          style="background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          INICIO</td>
          <td
          style="background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          ARRIBO PERSONAL</td>
          <td
          style="background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          TERMINO</td>
          <td
          style="background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          LARGO</td>
          <td
          style="background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          ANCHO</td>
          <td
          style="background-color: #E5E8EA  !important; font-size: 5pt !important; text-align:center !important; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) !important;">
          TIRANTE</td>
          </tr>
          </thead>
        `;

        floodingIncidents = ` ${floodingIncidents}
        ${headMunicipality}`;
        register ++; 

        if (register % 11 == 0) {
          register += 2;
          floodingIncidents = ` ${floodingIncidents}
          </table>
          <div style="page-break-after:always;"></div>
          ${headMunicipality}
        
      `}

        floodingIncidents = ` ${floodingIncidents}
        ${headColumns}`;
        register ++; 
                
        if (register % 11 == 0) {
          register += 2;
          floodingIncidents = ` ${floodingIncidents}
          </table>
          <div style="page-break-after:always;"></div>
          ${headMunicipality}
          ${headColumns}
      `}
        value.incidents.forEach((incidents, value) => {
          index++;
          floodingIncidents = ` ${floodingIncidents}
                  <tbody>
                      <tr>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${index}</td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.folio}</td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.receipt}</td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.address}
                        ${incidents.btw_street_first != '' && incidents.btw_street_second != '' ? `<br/>${incidents.btw_street_first} Y ${incidents.btw_street_second}` : ''}
                        ${incidents.btw_street_first != '' && incidents.btw_street_second == '' ? `<br/>Entre calle: ${incidents.btw_street_first}` : ''}
                        ${incidents.btw_street_first == '' && incidents.btw_street_second != '' ? `<br/>Entre calle: ${incidents.btw_street_second}` : ''}
                        ${incidents.corner != '' ? `<br/>Esq. ${incidents.corner}` : ''}
                        <br>
                        Col. ${incidents.settlement}
                        </td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.start_date}
                        </td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.arrive}
                        <br>
                        ${incidents.operators}
                        </td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.finished_date}</td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.long}</td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.width}</td>
                        <td
                        style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.tirante}</td>
                        <td
                        style=" font-size: 4pt; text-align:center;line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${incidents.reason}</td>
                      </tr>
                  `;
          register++;
          if (register % 11 == 0) {
           
            floodingIncidents = `
        ${floodingIncidents}
        </tbody>
        </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
        <tbody>
        `
        register += 2;
          }
        });
        floodingIncidents = ` ${floodingIncidents}
                  <tr>
                        <td colspan="10"
                        style="text-align:right ; font-size: 7pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                        Subtotal:</td>
                        <th
                        style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                        ${value.subtotal_incidents}
                        </th>
                      </tr>
                      <tr>
                        <td colspan="11"
                        style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">
                        Espacio</td>
                      </tr>
                  </tbody>
                  </table>`;
        index = 0;
        register++;
        if (register % 11 == 0) {
          floodingIncidents = `
        ${floodingIncidents}
        <div style="page-break-after:always;"></div>
        `
        }
        value.incidents.forEach((incident) => {
          if (incident.status_id == 9 && incident.finished == true) { solved++; }
          if (incident.status_id != 0 && incident.finished == false) { in_process++; }
        });

        average_solution_time = value.incidents.map((incident) => {
          //console.log("#######FLOODING START DATE##############", incident)
          if (incident.finished_date != 'En proceso' && incident.start_date != 'En proceso') {
            if (incident.finished_date >= incident.start_date) {
              datetime1 = Date.parse(incident.finished_date) / 1000;
              datetime2 = Date.parse(incident.start_date) / 1000;
             

              contador = (datetime1 / 60) - (datetime2 / 60);

            }
          }
          return contador;
        });



        average_solution_time = promediame(average_solution_time).toFixed(2);

        dataConsolidation = ` ${dataConsolidation}
                <tr>
                  <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">${value.municipality}
                  </td>
        
                  <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${Number(value.subtotal_incidents)}</td>
                  <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${in_process}</td>
                  <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${solved}</td>
                  <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${Number(average_solution_time)}</td>
                </tr>
                `;

        return {
          'municipality': value.municipality,
          'Captados': Number(value.subtotal_incidents),
          'En proceso': in_process,
          'Solucionados': solved,
          'average_solution_time': Number(average_solution_time)
        };

      });

      let total_incidents = 0, total_in_process = 0, total_solved = 0, total_average_solution_time = 0;
      let total_resume_metrics = resume_metrics.map((value) => {

        total_incidents += value.Captados;
        total_in_process += value['En proceso'];
        total_solved += value.Solucionados;
        total_average_solution_time += value.average_solution_time;

        return {
          'total_incidents': total_incidents,
          'total_in_process': total_in_process,
          'total_solved': total_solved,
          'total_average_solution_time': total_average_solution_time
        }
      }).pop();

      let footer_resume_metrics = `
            <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Subtotal
            </td>
    
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${total_resume_metrics.total_incidents}</td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${total_resume_metrics.total_in_process}</td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${total_resume_metrics.total_solved}</td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${total_resume_metrics.total_average_solution_time/resume_metrics.length}</td>
            `;

      let countReasons = [];
      getAllFloodingReasons.forEach((value) => {
        countReasons[value.name] = 0;
        diarioencharcamientos.forEach((flooding) => {
          flooding.incidents.forEach((incident) => {
            if (value.name == incident.reason) {
              countReasons[value.name]++;
            }
          });
        });
      });

      let floodingReasons = [];

      getAllFloodingReasons.map((value) => {
        floodingReasons[value.name] = 0;
      });

      let resumeMunicipality = diarioencharcamientos.map((flooding) => {
        let newFloodingReasons = [];
        //newFloodingReasons[flooding.municipality] = [];
        newFloodingReasons[flooding.municipality] = floodingReasons;
        flooding.incidents.map((incident) => {  
          
          getAllFloodingReasons.map((value) => {
           
            if (value.name == incident.reason) {
              newFloodingReasons[flooding.municipality][value.name]++;
              //array[incident.municipality][value.name] ? array[incident.municipality][value.name]++ : array.push({[[incident.municipality][value.name]]:0});
              //array[incident.municipality][value.name] = array[incident.municipality][value.name]?array[incident.municipality][value.name]++:0;
            }
          });
        });

        return {
          'municipality': flooding.municipality,
          'Solucionados': newFloodingReasons,
        };

      });

      resumeMunicipality.forEach((value)=>{
      });

      let resume_reasons = `
          <tr>
                    <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Subtotal
                    </td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ${countReasons['[A] Coladera Obstruida']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[B] Atarjea Obstruida']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[C] Insuficiencia de Atarjea y Colector']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[D] Insuficiencia de Grieta']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[E] Hundimiento de la Carpeta Asfáltica']}</td>
                         <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[F] Falta de Infraestructura']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[G] Inexistente al Momento de la Inspección [No se Aprecian Dimensiones]']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[H] En Revisión']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[I] No se Operó Cárcamo de Bombeo']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[J] Ruptura de Tubo de Agua Potable']}</td>
                    <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                         ${countReasons['[K] Bajada de Aguas Broncas']}</td>
                   

                </tr>
          `;
      let countReasonsMunicipality = [], prueba = [];
      getAllFloodingReasons.forEach((reason) => {
        countReasonsMunicipality[reason.name] = 0;
      });
console.log("templateReplace", tmpl)
      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{header}}", header)
        .replace("{{incidents}}", floodingIncidents)
        .replace("{{grand_total}}", grand_total)
        .replace("{{dataConsolidation}}", dataConsolidation)
        .replace("{{footer_resume_metrics}}", footer_resume_metrics)
        .replace("{{resume_reasons}}", resume_reasons)
        .replace("{{reasons}}",reasons);
    } else {
      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{header}}", '')
        .replace("{{incidents}}", '')
        .replace("{{grand_total}}", 0)
        .replace("{{dataConsolidation}}", '')
        .replace("{{footer_resume_metrics}}", '')
        .replace("{{resume_reasons}}", '')
        .replace("{{reasons}}",reasons);

    }
    return html;
  },
};
