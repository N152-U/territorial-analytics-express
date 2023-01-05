module.exports = {
  reconstruccionpavimentacionfuncion: (startDate, finalDate, today, reconstruccionpavimentacion, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html, headColumns = '', headMunicipality = '', incidents = '',
      register = 0, index = 0,grand_total=0;
    if (reconstruccionpavimentacion != '') {
      reconstruccionpavimentacion.forEach(value => {
        grand_total += Number(value.total_incidents);
        headMunicipality = `<table   style="padding:0px!important;">
        <thead style="padding:0px!important;">
        <tr >
        <td colspan="7"
        style="background-color: #CACEDA!important; font-size: 7pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2!important;">
        ALCALDÍA: ${value.municipality}</td>
        </tr>`;
        headColumns = `
        <tr>
        <th style="font-size: 8pt!important; background-color: #ffffff!important;"></th>
        <th style="font-size: 8pt!important; background-color: #ffffff!important; "></th>
        <th style="font-size: 8pt!important; background-color: #ffffff!important; "></th>
        <th style="font-size: 8pt!important; background-color: #ffffff!important;"></th>
        <th style="font-size: 8pt!important; background-color: #ffffff!important;"></th>
        <th colspan="2" style=" max-width:10px; width:30px; background-color: #CDDAE3; font-size: 6.5pt; text-align:center; font-weight: bold;">SOLICITUD DE:</th>
    </tr>
  
    <tr>
        <th style="width:30px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">FOLIO</th>
        <th style="width:30px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">CALLE DE LA FALLA<br> ENTRE CALLLES</th>
        <th style="width:30px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">ALCALDIA<br>COLONIA </th>
        <th style="width:30px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">GRUPO<br>CAMPAMENTO</th>
        <th style="width:70px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">DESCRIPCION</th>
        <th style="width:5px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">PAVIMENTACION</th>
        <th style="width:5px; background-color: #CDDAE3!important; font-size: 6.5pt!important; text-align:center!important; font-weight: bold!important; line-height: 1.2; border: 1px solid darkred">REPARACION BANQUETA</th>
  
    </tr>
    </thead>`
        incidents = ` ${incidents}
    ${headMunicipality}
    `;
        register++;
        if (register % 16 == 0) {
          register += 2;
          incidents = `
            ${incidents}
            </table>
            <div style="page-break-after:always;"></div>
            ${headMunicipality}
               
        `}
        incidents = ` ${incidents}
        ${headColumns}
        `
        register++;

        if (register % 16 == 0) {
          register += 2;
          incidents = `
      ${incidents}
      </table>
      <div style="page-break-after:always;"></div>
      ${headMunicipality}
      ${headColumns}        
  `}
        value.incidents.forEach((incident) => {
          index++;
          incidents = `
      ${incidents}
          <tbody>
          <tr style="padding:0px;">
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
          ">
          ${index}
          <br>
          <span><b>${incident.folio}</b></span>
          </td>
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          ${incident.address}
          <br>
          ${incident.btw_street_first} y ${incident.btw_street_second}
          </td>
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
          ">
          ${incident.alcaldia}
          <br>
          ${incident.settlement}
          </td>
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          ${incident.grupo}
          <br>
          ${incident.unidad_que_repara}
          </td>
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          ${incident.descripcion}
          </td>
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          ${incident.pavimentacion == 'true' ? 1 : ''}
          </td>
          <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
          ${incident.reparacion_banqueta == 'true' ? 1 : ''}
          </td>
          </tr>
      `;
          register++;
          if (register % 16 == 0) {
            incidents = `
          ${incidents}
          </tbody>
          </table>
          <div style="page-break-after:always;"></div>
          ${headMunicipality}
          ${headColumns}  
          
          `
            register += 2;
          }


        });

        incidents = `
        ${incidents}
        <tr>
        <td colspan="6"
        style="text-align:right ; font-size: 6pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
        Subtotal incidentes:</td>
        <th colspan="1"
        style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
        ${value.total_incidents}
        </th>
        </tr>
        <tr>
        <td colspan="4"
        style="height: 50px;font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);  border-style : hidden!important; border-top: thick green !important;">
        Espacio</td>
        </tr>
        </tbody>
        </table>
    `
        index = 0;
        register++;
        if (register % 16 == 0) {
          incidents = `
    ${incidents}
    <div style="page-break-after:always;"></div>
`}


      });

      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{incidents}}", incidents)
        .replace("{{grand_total}}", grand_total);

    } else {
      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{incidents}}", incidents)
        .replace("{{grand_total}}", grand_total);
    }
    return html;
  },
};
