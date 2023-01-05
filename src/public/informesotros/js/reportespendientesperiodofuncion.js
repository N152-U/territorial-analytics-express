module.exports = {
  reportespendientesperiodofuncion: (startDate, finalDate, today, reportespendientesperiodo, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {

    let html, incidents = '', index = 0, register = 0, grand_total = 0, headMunicipality = '', headColumns = '';

    if (reportespendientesperiodo != '') {

      reportespendientesperiodo.forEach(value => {

        grand_total += Number(value.subtotal_incidents);

        headMunicipality = `<table   style="padding:0px!important;">
              <thead style="padding:0px!important;">
              <tr style="padding:0px!important;">
              <td colspan="11"
              style="background-color: #D9D9D9; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              SISTEMA: ${value.service_centers_name}</td>
              </tr>`;
        headColumns = `
              <tr style="padding:0px!important;">
              <th class="
              align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              No. Prog.
              <br>
              Folio
              <br>
              Fecha
              </th>
              <th class="
              align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              CALLE DE LA FALLA
              <br>
              ENTRE CALLES
              <br>
              ESQUINA
              <br>
              COLONIA
              <br>NOMBRE DEL USUARIO</th>
              <th class="
              align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              ALCALDIA<br>
              UNIDAD QUE REPARA<br>
              TIPO DE FALLA<br>
              TELEFONO<br>
              REFERENCIA &nbsp;
              </th>
              <th class="
              align-middle;" style="width:10%; background-color: #E5E8EA !important; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
              DICTAMEN
              </th>
              </tr>
              </thead>`

        incidents = ` ${incidents}
              ${headMunicipality}
              `;
        register++;
        if (register % 10 == 0) {
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

        if (register % 10 == 0) {
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
                  <br>
                  ${incident.created_at}
                  </td>
                  <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ${incident.address} ${incident.manzana} ${incident.lote} ${incident.internal_number} ${incident.external_number}
                  <br>
                  <span >
                  ${incident.btw_street_first} y
                  ${incident.btw_street_second}</span>
                  <br>
                  ${incident.corner}
                  <br>
                  ${incident.settlement}
                  <br>
                  ${incident.citizen_fullname}
                  </td>
                  <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
                  ">
                  ${incident.municipality}
                  <br>
                  <b>${incident.service_center}</b>
                  <br>
                  <b>${incident.codification_type}</b>
                  <br>
                  ${incident.phone}
                  <br>
                  ${incident.reference}
                  </td>
                  <td   style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ${incident.closed_observation}
                  </td>
                  </tr>
              `;
          register++;
          if (register % 10 == 0) {
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
                  <td colspan="3"
                  style="text-align:right ; font-size: 6pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                  Subtotal:</td>
                  <th colspan="1"
                  style="font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                  ${value.subtotal_incidents}
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
        if (register % 10 == 0) {
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
