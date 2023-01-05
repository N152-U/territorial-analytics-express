module.exports = {
  atencionfugasaguapotableanualfuncion: (startDate, finalDate, today, atencionfugasaguapotableanual, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html, incidents = '', index = 0, register = 0, grand_total = 0, headMunicipality = '', headColumns = '';

    if (atencionfugasaguapotableanual != '') {
      atencionfugasaguapotableanual.forEach(value => {
        grand_total += Number(value.subtotal);

        headMunicipality = `<table  class="table table-bordered">
          <thead>
            <tr>
              <td colspan="11"
              style="background-color: #BEC6D4!important; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              ALCALDÍA: ${value.municipality}</td>
            </tr>`;
        headColumns = `
            <tr style="padding:0px!important;">
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              Folio
              </th>
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              CALLE DE LA FALLA
              <th colspan="2"  class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              ENTRE CALLES
              </th>
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              COLONIA
              </th>
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              SOLUCI&Oacute;N
              </th>
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              SUPERFICIE
              </th>
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              DIAMETRO
              </th>
              <th class="align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:2px;">
              MATERIAL
              </th>
            </tr>
          </thead>`

        incidents = ` ${incidents}
            ${headMunicipality}
            `;
        register++;
        if (register % 12 == 0) {
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

        if (register % 12 == 0) {
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
                  <tr>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    <span><b>${incident.folio}</b></span>
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.address}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.report_btw_street_first}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.report_btw_street_second}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.report_settlement}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.repair_description}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.repair_surface}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.repair_diameter}
                    </td>
                    <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0); padding:5px;">
                    ${incident.repair_material}
                    </td>
                </tr>
            `;
          register++;
          if (register % 12 == 0) {
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
        <td colspan="8"
        style="text-align:right ; font-size: 6pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
        Subtotal:</td>
        <th colspan="1"
        style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
        ${value.subtotal}
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
        if (register % 12 == 0) {
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
        .replace("{{incidents}}", '')
        .replace("{{grand_total}}", 0);

    }
    return html;
  },
};    
