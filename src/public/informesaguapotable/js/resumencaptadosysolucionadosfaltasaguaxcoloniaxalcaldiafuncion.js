module.exports = {
  resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldiafuncion: (startDate, finalDate, today, resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {

    let resumeReport = "", headerMunicipality = "", grand_total_received = 0, grand_total_solved = 0, grand_total_process = 0, index = 0;
    let solved = 0, in_process = 0, register = 0, contador = 0, html, header = '';

    if (resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia != '') {
      header = `<table>
      <thead>
        <tr>
          <th rowspan="2"
          style="background-color: #E5E8EA; width:2%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          No. Prog.</th>
          <th rowspan="2"
          style="background-color: #E5E8EA; width:8%; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          Colonia</th>
          <th colspan="3" 
          style="background-color: #E5E8EA; width:8%;  font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
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

      resumencaptadosysolucionadosfaltasaguaxcoloniaxalcaldia.forEach((value) => {
        solved = 0, in_process = 0, contador = 0, average_solution_time = '';
        headerMunicipality = `
        <tr>
        <th colspan="11"
        style="background-color: #D9D9D9; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
        ${value.coalesce}</th>
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
        if (register % 35 == 0) {
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
    <tbody>
    `;
        register++;

        if (register % 35 == 0) {
          register += 2;
          resumeReport = `
    ${resumeReport}
    </thead>  
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
          if (register % 35 == 0) {
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
        });

        resumeReport = `
      ${resumeReport}
      
    <tr>
      <th style="font-size: 7pt; color:#0000; background-color: #E5E8EA; text-align:center; border-left: 1px solid; border-bottom: 1px solid;"></th>
      <th style="font-size: 7pt; color:#0000; background-color: #E5E8EA; text-align:center; border-bottom: 1px solid; border-left: 0px solid; border-right: 1px solid; ">Subtotal:</th>
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
        if (register % 35 == 0) {
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


      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{reports}}", resumeReport)
        .replace("{{grand_total_received}}", grand_total_received)
        .replace("{{grand_total_solved}}", grand_total_solved)
        .replace("{{grand_total_process}}", grand_total_process);
    } else {
      let grand_total='';
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
        .replace("{{grand_total_process}}", 0);

    }
    return html;
  },
};
