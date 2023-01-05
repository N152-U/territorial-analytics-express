module.exports = {
    prediosafectadosfuncion: (startDate, finalDate, today, prediosafectados, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {

        let grand_total = 0, header = "", floodingIncidents = "", index = 0, dataConsolidation = "";
        let solved = 0, in_process = 0, register = 0, contador = 0, average_solution_time = '', html,number_property_total=0;
    
        header = `
            <tr>
            <td rowspan="2" style="background-color: #E5E8EA; width:3%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">#</td>
            <td rowspan="2" style="background-color: #E5E8EA; width:12%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Fecha</td>
            <td colspan="3" style="background-color: #E5E8EA; width:30%;font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Ubicaci&oacute;n</td>
            <td rowspan="2" style="background-color: #E5E8EA; width:13%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Colonia</td>
            <td colspan="11" style="background-color: #E5E8EA; width:15%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Causas</td>
            <td rowspan="2" style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Fecha de Soluci&oacute;n</td>
            </tr>
            <tr>
            <td style="background-color: #E5E8EA; width:12%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(Calle, N&uacute;mero)</td>
            <td style="background-color: #E5E8EA; width:10%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">entre Calle</td>
            <td style="background-color: #E5E8EA; width:10%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">y Calle</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">A</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">B</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">C</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">D</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">E</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">F</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">G</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">H</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">I</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">J</td>
            <td style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">K</td>
            </tr>
           </thead>`;
    
        if (prediosafectados != '') {
          let encharcamiento = prediosafectados.map((value) => {
            solved = 0, in_process = 0, contador = 0, average_solution_time = '';
            grand_total += Number(value.subtotal_incidents);
            floodingIncidents = `
            ${floodingIncidents}
            <table align="center">
            <thead>
            <tr>
                <td colspan="18" style="font-size: 10pt; background-color: #D9D9D9 ; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);;">${value.municipality}</td>
            </tr>
        `;
            register++;
            if (register % 19 == 0) {
              register++;
              floodingIncidents = `
             ${floodingIncidents}  
             </thead>
             </table>
            <div style="page-break-after: always"></div>
            <table align="center">
            <thead>
            <tr>
                <td colspan="21" style="font-size: 10pt; background-color: #D9D9D9 ; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);;">${value.municipality}</td>
            </tr>
        `;
            }
    
            floodingIncidents = `
            ${floodingIncidents}
            ${header}
            </thead>
        `;
            register++;
    
            if (register % 19 == 0) {
              register+=2;
              floodingIncidents = `
             ${floodingIncidents}  
             </thead>
             </table>
            <div style="page-break-after: always"></div>
            <table align="center">
            <thead>
            <tr>
                <td colspan="21" style="font-size: 10pt; background-color: #D9D9D9 ; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);;">${value.municipality}</td>
            </tr>
            ${header}
            </thead>
        `;
            }
    
            value.incidents.forEach((incident) => {
              number_property_total += Number(incident.number_property);
              index++;
              floodingIncidents = ` ${floodingIncidents}
              <tbody>
              <tr>
              <td style=" font-size: 7pt; text-align:center;  line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${index}</td>
              <td style=" font-size: 7pt; text-align:center;  line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${incident.created_at}</td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${incident.address}</td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${incident.btw_street_first}</td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${incident.btw_street_second}</td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${incident.settlement}</td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
              <td style=" font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td></td>
              <td style="text-align:center; font-size: 7pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${incident.finished_date}</td>
            </tr>
            `
              register++;
              if (register % 19 == 0) {
                
                floodingIncidents = `
                ${floodingIncidents}  
                </tbody>
                </table>
                <div style="page-break-after: always"></div>
                <table align="center">
                <thead>
                <tr>
                <td colspan="21" style="font-size: 10pt; background-color: #D9D9D9 ; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);;">${value.municipality}</td>
                </tr>
                ${header}
                </thead>
                `;
                register+=2;
        
              }
    
            });
            floodingIncidents = ` ${floodingIncidents}
                  <tr>
                      <th colspan="17" style="text-align:right ; font-size: 7pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">Total de Predios Afectados en Alcaldía:</th>
                            <td
                            style="font-size: 8pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                            ${number_property_total}
                            </td>
                          </tr>
                      <tr>
                      <th colspan="17" style="text-align:right ; font-size: 7pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">Subtotal:</th>
                            <td
                            style="font-size: 8pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                            ${value.subtotal_incidents}
                            </td>
                          </tr>
                          <tr>
                            <td colspan="11"
                            style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">
                            Espacio</td>
                          </tr>
                      </tbody>
                      </table>`;
    
            index = 0;
            number_property_total=0;
            register ++;
            if (register % 19 == 0) {
              register += 2;
              floodingIncidents = `
                      ${floodingIncidents}  
                <div style="page-break-after: always"></div>
                  
                      `;
            }
    
          });
    
    
          html = tmpl
            .replace("{{logoCDMX}}", logoCDMXB64)
            .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
            .replace("{{startDate}}", startDate)
            .replace("{{finalDate}}", finalDate)
            .replace("{{today}}", today)
            .replace("{{incidents}}", floodingIncidents)
            .replace("{{grand_total}}", grand_total)
        } else {
          floodingIncidents = `
            ${floodingIncidents}
            <table align="center">
            <thead>
            ${header}
            </table>
        `;
          html = tmpl
            .replace("{{logoCDMX}}", logoCDMXB64)
            .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
            .replace("{{startDate}}", startDate)
            .replace("{{finalDate}}", finalDate)
            .replace("{{today}}", today)
            .replace("{{incidents}}", floodingIncidents)
            .replace("{{grand_total}}", 0)
        }
        return html;
      },
};