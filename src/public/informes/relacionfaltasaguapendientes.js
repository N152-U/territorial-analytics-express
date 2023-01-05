module.exports = {
    relacionfaltaspendientes: (startDate, finalDate, today, relacionfaltasaguapendientes, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
   
        let grand_total = 0, incidents = "";
        let solved = 0, in_process = 0, register = 0, contador = 0, index=0,average_solution_time = '', html;

        if (relacionfaltasaguapendientes != '' ) {
         let pendientes = relacionfaltasaguapendientes.map((value) =>{
            solved = 0, in_process = 0,  contador = 0, average_solution_time = '';
            grand_total += Number(value.subtotal_incidents);         
            incidents = ` ${incidents}
            <table class="table table-bordered">
            <thead>
                      <tr>
                        <td colspan="11"
                        style="background-color: #D9D9D9; font-size: 9pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ALCALDÍA: ${value.municipality}</td>
                      </tr>
                      <tr>
                        <td rowspan="2"
                        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        No.<br>FOLIO <br> FECHA</td>     
                        <td rowspan="2"
                        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        CALLE DE LA FALLA <br> ENTRE CALLES <br> COLONIA <br> NOMBRE DEL USUARIO</td>
                        <td rowspan="2"
                        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ALCALDIA <br> UNIDAD QUE REPARA <br> TIPO DE FALLA <br>TELEFONO <br>REFERENCIA </td>
                        <td rowspan="2"
                        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        DICTAMEN</td>
                      </tr>
                    </thead>
                `;   
                register += 2;
                if (register % 7== 0) {
                    register += 2;
                  incidents = `${incidents} 

                  </table>
                  <div style="page-break-after:always;"></div>
                  <table>
                  <thead>
                  <tr>
                        <td colspan="11"
                        style="background-color: #D9D9D9; font-size: 9pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                        ALCALDÍA: ${value.municipality}</td>
                      </tr>
                      <tr>
                <tr>
                  <td rowspan="2"
                  style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  No.<br>FOLIO <br> FECHA</td>     
                  <td rowspan="2"
                  style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  CALLE DE LA FALLA <br> ENTRE CALLES <br> COLONIA <br> NOMBRE DEL USUARIO</td>
                  <td rowspan="2"
                  style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  ALCALDIA <br> UNIDAD QUE REPARA <br> TIPO DE FALLA <br>TELEFONO <br>REFERENCIA </td>
                  <td rowspan="2"
                  style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                  DICTAMEN</td>
                </tr>
              </thead>
              `
            }
                value.incidents.forEach((incident) => {
                    index++;                 
                    incidents = `${incidents}
                    <tbody>
                    <tr>
                      <td
                      style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${index} 
                      <br>  
                      ${incident.folio} 
                      <br>
                      ${incident.created_at}
                      </td>                     
                      <td
                      style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${incident.address}
                      ${incident.btw_street_first != '' && incident.btw_street_second != '' ? `<br/>${incident.btw_street_first} Y ${incident.btw_street_second}` : ''}
                      ${incident.btw_street_first != '' && incident.btw_street_second == '' ? `<br/>Entre calle: ${incident.btw_street_first}` : ''}
                      ${incident.btw_street_first == '' && incident.btw_street_second != '' ? `<br/>Entre calle: ${incident.btw_street_second}` : ''}
                      <br>
                      Col. ${incident.settlement}
                      <br> 
                      ${incident.citizen_fullname}
                      </td>
                      <td
                      style=" font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${incident.municipality}
                      <br> 
                      ${incident.service_center}
                      <br> 
                      ${incident.codification_type}
                      <br> 
                      ${incident.phone}
                      <br> 
                      ${incident.reference}</td>
                     <td
                      style=" font-size: 6pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                      ${incident.closed_observation}</td>
                    </tr>
                    `;
                    register++;
                    if (register % 7 == 0) {                      
                      incidents = `${incidents}
                      </tbody>
        </table>
        <div style="page-break-after:always;"></div>
        <table>
                      
        <thead>
          <tr>
           <td colspan="11"
            style="background-color: #D9D9D9; font-size: 9pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
             ALCALDÍA: ${value.municipality}</td>
           </tr>
        <tr>
        <td rowspan="2"
        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
        No.<br>FOLIO <br> FECHA</td>     
        <td rowspan="2"
        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
        CALLE DE LA FALLA <br> ENTRE CALLES <br> COLONIA <br> NOMBRE DEL USUARIO</td>
        <td rowspan="2"
        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
        ALCALDIA <br> UNIDAD QUE REPARA <br> TIPO DE FALLA <br>TELEFONO <br>REFERENCIA </td>
        <td rowspan="2"
        style="width:5%; background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
        DICTAMEN</td>
      </tr>
    </thead>
    `
    register += 2;}
                });
                incidents = ` ${incidents}
                  <tr>
                        <td colspan="3"
                        style="text-align:right ; font-size: 8pt; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                        Subtotal:</td>
                        <th colspan="1"
                        style="font-size: 8pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                        ${value.subtotal_incidents}
                        </th>
                      </tr>
                      <tr>
                        <td colspan="4"
                        style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">
                        Espacio</td>
                      </tr>
                  </tbody>`;

        index = 0;
        register+=2;
        if (register % 7 == 0) {
          incidents = ` ${incidents}
          </table>
          <div style="page-break-after:always;"></div>
          
        `
        }
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
