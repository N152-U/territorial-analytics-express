module.exports = {
  resumenacumuladogeneralencharcamientosfuncion: (startDate, finalDate, today, resumenacumuladogeneralencharcamientos, tmpl, getAllFloodingReasons,encharcamientosxalcaldiaxtipofalla, logoCDMXB64, logoCiudadInnovadoraB64) => {

    function promediame(array) {
      var suma = 0;
      for (var i = 0; i < array.length; i++) {
        suma += array[i];

      }
      return suma / array.length;
    }

    let dataConsolidation = '', solved = 0, in_process = 0, register = 0, contador = 0, average_solution_time = '', reasons = '',reasons_desc='',resume_reasons='';

    if (resumenacumuladogeneralencharcamientos != '') {
      let resume_metrics = resumenacumuladogeneralencharcamientos.map((value) => {
        solved = 0, in_process = 0, contador = 0, average_solution_time = '';

        value.incidents.forEach((incident) => {
          if (incident.status_id == 9 && incident.finished == true) { solved++; }
          if (incident.status_id != 0 && incident.finished == false) { in_process++; }
        });

        average_solution_time = value.incidents.map((incident) => {
          if (incident.finished_date != 'En proceso' && incident.arrive != 'En proceso') {
            if (incident.finished_date >= incident.arrive) {
              datetime1 = Date.parse(incident.finished_date) / 1000;
              datetime2 = Date.parse(incident.arrive) / 1000;
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
              <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">SUBTOTAL
              </td>
      
              <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ${total_resume_metrics.total_incidents}</td>
              <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ${total_resume_metrics.total_in_process}</td>
              <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ${total_resume_metrics.total_solved}</td>
              <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ${total_resume_metrics.total_average_solution_time}</td>
              `;

      let countReasons = [];
      getAllFloodingReasons.forEach((value) => {
        reasons_desc = `
        ${reasons_desc}
        <th style="background-color: #E5E8EA; font-size: 4pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);" >${value.name}</th>`;
        countReasons[value.name] = 0;
        resumenacumuladogeneralencharcamientos.forEach((flooding) => {
          flooding.incidents.forEach((incident) => {
            if (value.name == incident.reason) {
              countReasons[value.name]++;
            }
          });
        });
      });
  
      encharcamientosxalcaldiaxtipofalla.forEach((value)=>{
        
        resume_reasons=`
        ${resume_reasons}
        <tr>
            <td style=" font-size: 5.5pt; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.municipality}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.a}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.b}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.c}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.d}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.e}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.f}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.g}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.h}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.i}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.j}
            </td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            ${value.k}
            </td>
        </tr>
        `;
      });
     resume_reasons = `${resume_reasons}
            <tr>
                      <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">SUBTOTAL
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
                  </tbody>
                </table>  
            `;

      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{dataConsolidation}}", dataConsolidation)
        .replace("{{footer_resume_metrics}}", footer_resume_metrics)
        .replace("{{resume_reasons}}", resume_reasons)
        .replace("{{reasons}}", reasons)
        .replace("{{reasons_desc}}", reasons_desc);
    } else {
      let footer_resume_metrics = `
        <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">SUBTOTAL
        </td>

        <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            0</td>
        <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            0</td>
        <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
           0</td>
        <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
           0</td>
        `;
      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{dataConsolidation}}", '')
        .replace("{{footer_resume_metrics}}", footer_resume_metrics)
        .replace("{{resume_reasons}}", '')
        .replace("{{reasons}}", reasons)
        .replace("{{reasons_desc}}", reasons_desc);
    }
    return html;

  },
};
