module.exports = {
  sustitucionaccesorioshidraulicosfuncion: (startDate, finalDate, today, sustitucionaccesorioshidraulicos, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {

    let resumeReport = "", headerMunicipality = "", grand_total_received = 0, grand_total_solved = 0, grand_total_process = 0, index = 0;
    let solved = 0, in_process = 0, register = 0, contador = 0, html, header = '', dataConsolidation = '';

    if (sustitucionaccesorioshidraulicos != '') {
      header = `<table>
        <thead>
          <tr>
            <th rowspan="2"
            style="background-color: #bdbdbd; width:2%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            No. Prog.</th>
            <th rowspan="2"
            style="background-color: #bdbdbd; width:8%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            Colonia</th>
            <th colspan="3" 
            style="background-color: #bdbdbd; width:8%;  font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            Reportes</th>
          </tr>
  
          <tr>
          <th style="background-color:  #FFFFFF;  font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          Captados</th>
          <th style="background-color:  #FFFFFF;  font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          Solucionados</th>
          <th style="background-color:  #FFFFFF;  font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          Pendientes</th>
          </tr>`;

      sustitucionaccesorioshidraulicos.forEach((value) => {
        solved = 0, in_process = 0, contador = 0, average_solution_time = '';
        headerMunicipality = `
          <tr>
          <th colspan="11"
          style="background-color: #D9D9D9; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          ${value.coalesce}</th>
          </tr>
          `;
        dataConsolidation = ` ${dataConsolidation}
          <tr>
            <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">${value.coalesce}
            </td>
  
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${Number(value.subtotal_received)}</td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${Number(value.total_process)}</td>
            <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${Number(value.subtotal_solved)}</td>
          </tr>
          `;
        grand_total_received += Number(value.subtotal_received);
        grand_total_solved += Number(value.subtotal_solved);
        grand_total_process += Number(value.total_process);


        resumeReport = `
        ${resumeReport}
        ${header} 
        `;

        register++;
        if (register % 30 == 0) {
          register += 2;
          resumeReport = `${resumeReport}
        </thead>
        </table>
        <div style="page-break-after:always;"></div> 
        ${header} 
        `
        }
        resumeReport = `
      ${resumeReport}
      ${headerMunicipality}
      </thead>
      <tbody>
      `;
        register++;

        if (register % 30 == 0) {
          register += 2;
          resumeReport = `
      ${resumeReport}
      </tbody>  
      </table>
      <div style="page-break-after:always;"></div>
      ${header}
     ${headerMunicipality}
    </thead> 
    <tbody>       
  `}


        value.count_reports.forEach((report) => {
          index++;
          resumeReport = `
          ${resumeReport}
         
            <tr> 
              <td 
              style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${index}</td>
              <td 
              style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.settlement} (${report.d_tipo_asenta ? report.d_tipo_asenta : 'Sin tipo de asentamiento'})</td>
              <td 
              style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.total_received}</td>
              <td 
              style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.total_solved}</td>
              <td 
              style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.total_received - report.total_solved}</td>
            </tr>
            `;

          register++;
          if (register % 30 == 0) {
            resumeReport = `
                ${resumeReport}
                </tbody>
                </table>
                <div style="page-break-after:always;"></div>
                ${header}
                ${headerMunicipality}
                </thead> 
                <tbody>
                `
            register += 2;
          }
          if (report.total_boca_de_tormenta != 0) {
            resumeReport = `
            ${resumeReport}
              <tr>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  </td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:right; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  Boca de tormenta</td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  ${report.total_boca_de_tormenta}</td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  ${report.solved_boca_de_tormenta}</td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  ${report.total_boca_de_tormenta - report.solved_boca_de_tormenta}</td>
              </tr>`;
            register++;
            if (register % 30 == 0) {
              resumeReport = `
                  ${resumeReport}
                  </tbody>
                  </table>
                  <div style="page-break-after:always;"></div>
                  ${header}
                  ${headerMunicipality}
            </thead> 
            <tbody>
                  `
              register += 2;
            }
          }

          if (report.total_coladera_sin_tapa != 0) {
            resumeReport = `
            ${resumeReport}
              <tr>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  </td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:right; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  Coladera sin tapa</td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  ${report.total_coladera_sin_tapa}</td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  ${report.solved_coladera_sin_tapa}</td>
                  <td 
                  style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
                  ${report.total_coladera_sin_tapa - report.solved_coladera_sin_tapa}</td>
              </tr>`;
            register++;
            if (register % 30 == 0) {
              resumeReport = `
                ${resumeReport}
                </tbody>
                </table>
                <div style="page-break-after:always;"></div>
                ${header}
                ${headerMunicipality}
          </thead> 
          <tbody>
                `
              register += 2;
            }
          }

          if (report.total_pozo_de_visita != 0) {
            resumeReport = `
            ${resumeReport}
              <tr>
              <td 
              style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              </td>
              <td 
              style="background-color: #E5E8EA!important;font-size: 6pt; text-align:right; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              Pozo de visita</td>
              <td 
              style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.total_pozo_de_visita}</td>
              <td 
              style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.solved_pozo_de_visita}</td>
              <td 
              style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
              ${report.total_pozo_de_visita - report.solved_pozo_de_visita}</td>
          </tr>`;
            register++;
            if (register % 30 == 0) {
              resumeReport = `
              ${resumeReport}
              </tbody>
              </table>
              <div style="page-break-after:always;"></div>
              ${header}
              ${headerMunicipality}
        </thead> 
        <tbody>
              `
              register += 2;
            }
          }

          if (report.total_rejilla_de_piso != 0) {
            resumeReport = `
              ${resumeReport}
            <tr>
            <td 
            style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
            </td>
            <td 
            style="background-color: #E5E8EA!important;font-size: 6pt; text-align:right; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
            Rejilla de piso</td>
            <td 
            style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
            ${report.total_rejilla_de_piso}</td>
            <td 
            style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
            ${report.solved_rejilla_de_piso}</td>
            <td 
            style="background-color: #E5E8EA!important;font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">      
            ${report.total_rejilla_de_piso - report.solved_rejilla_de_piso}</td>
        </tr> 
                `;

            register++;
            if (register % 30 == 0) {
              resumeReport = `
              ${resumeReport}
              </tbody>
              </table>
              <div style="page-break-after:always;"></div>
              ${header}
              ${headerMunicipality}
        </thead> 
        <tbody>
              `
              register += 2;
            }
          }


        });

        resumeReport = `
        ${resumeReport}
        
      <tr>
        <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-left: 1px solid; border-bottom: 1px solid;"></th>
        <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px solid; border-left: 0px solid; border-right: 1px solid; ">Subtotal:</th>
        <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${Number(value.subtotal_received)}</th>
        <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${Number(value.subtotal_solved)}</th>
        <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${Number(value.total_process)}</th>
        </tr>
        <tr>
        <td colspan="11"
        style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">
        Espacio</td>
      </tr>
        `
        index = 0;
        register++;
        if (register % 30 == 0) {
          resumeReport = `
          ${resumeReport}
          </table>
          <div style="page-break-after:always;"></div>
          <table>
          <tbody>
      `}

      });



      resumeReport = `
        ${resumeReport}
          <tr>
            <td colspan="11"
            style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">
            Espacio</td>
          </tr>
          <tr>
          <tr>
          <th style="font-size: 7pt; color:#0000; background-color: #E5E8EA; text-align:center; border-left: 1px solid; border-bottom: 1px solid; border-top: 1px solid;"></th>
          <th style="font-size: 7pt; color:#0000; background-color: #E5E8EA; text-align:center; border-bottom: 1px solid; border-left: 0px solid; border-right: 1px solid; border-top: 1px solid; ">Total:</th>
          <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${grand_total_received}</th>
          <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${grand_total_solved}</th>
          <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${grand_total_process}</th>
          </tr>
          </tr>
          </tbody>
          </table>
          `
      let footer_resume_metrics = `
          <td style=" font-size: 5.5pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">Subtotal
          </td>
  
          <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${grand_total_received}</td>
          <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${grand_total_process}</td>
          <td style=" font-size: 5.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ${grand_total_solved}</td>
          `;

      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{reports}}", resumeReport)
        .replace("{{grand_total_received}}", grand_total_received)
        .replace("{{grand_total_solved}}", grand_total_solved)
        .replace("{{grand_total_process}}", grand_total_process)
        .replace("{{dataConsolidation}}", dataConsolidation)
        .replace("{{footer_resume_metrics}}", footer_resume_metrics);
    } else {
      let grand_total = '';
      grand_total = `
        ${grand_total}
        <table>
        <tbody>
          <tr>
            <td colspan="11"
            style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">
            Espacio</td>
          </tr>
          <tr>
          <tr>
          <th style="font-size: 7pt; color:#0000; background-color: #E5E8EA; text-align:center; border-left: 1px solid; border-bottom: 1px solid; border-top: 1px solid;"></th>
          <th style="font-size: 7pt; color:#0000; background-color: #E5E8EA; text-align:center; border-bottom: 1px solid; border-left: 0px solid; border-right: 1px solid; border-top: 1px solid; ">Total:</th>
          <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${grand_total_received}</th>
          <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${grand_total_solved}</th>
          <th style="font-size: 7pt; color:#0000; background-color: #ffffff; text-align:center; border-bottom: 1px; border: 1px solid rgb(0, 0, 0);"> ${grand_total_process}</th>
          </tr>
          </tr>
          </tbody>
          </table>
          `


      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{reports}}", grand_total)
        .replace("{{grand_total_received}}", 0)
        .replace("{{grand_total_solved}}", 0)
        .replace("{{grand_total_process}}", 0)
        .replace("{{dataConsolidation}}", '')
        .replace("{{footer_resume_metrics}}", '');

    }
    return html;
  },
};
