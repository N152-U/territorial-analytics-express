module.exports = {
    solicitudpipas: (startDate, finalDate, today, solicitudespipas, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
        let html, incidents = '', index = 0, register = 0, grand_total = 0,headMunicipality = '', headColumns = '';

        if (solicitudespipas != '') {

            solicitudespipas.forEach(value => {
               
                grand_total += Number(value.subtotal_incidents);

                headMunicipality = `
                <table class="table table-bordered">
                <thead>
                <tr>
                <td colspan="11"
                style="background-color: #D9D9D9; font-size: 6.5pt;text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ALCALDÍA: ${value.municipality}</td>
               </tr>`;
                headColumns=`
                <tr style="padding:0px;">
                <th class="
                align-middle;" style="width:10%; background-color: #E5E8EA!important; font-size: 6pt;text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                No. Prog.
                <br>
                Folio
                <br>
                Fecha
                </th>
                <th class="
                align-middle;" style="width:10%; background-color: #E5E8EA!important; font-size: 6pt;text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                CALLE DE LA FALLA
                <br>
                ENTRE CALLES
                <br>
                COLONIA
                <br>
                NOMBRE DEL USUARIO
                </th>

                <th class="
                align-middle;" style="width:10%; background-color: #E5E8EA!important; font-size: 6pt;text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ALCALDIA
                <br>
                UNIDAD QUE REPARA
                <br>
                TIPO DE FALLA
                <br>
                TELEFONO
                <br>
                REFERENCIA &nbsp;
                </th>
                <th class="
                align-middle;" style="
                margin: 0;
                padding: 3px;
                width:8%;
                max-width: 8%;
                text-align: center;
                font-size: 6.5pt;
                font-weight: bold;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1; background-color: #E5E8EA!important;
                border: 1px solid black" BGCOLOR="#EEE">
                No. DE PIPAS Y CAPACIDAD DE LA CISTERNA(LITROS)
                <br>
                <hr color="#DDD8D7" size=1>
                <br>
                DISTANCIA EN METROS DE LA CALLE A CISTERNA(METROS)
                </th>
                </tr>
                </thead>  
                `;

                incidents = ` ${incidents}
               ${headMunicipality}`;
               register++;
               if (register % 7== 0) {
                register += 2;
                incidents = `
                ${incidents}
                </table>
                <div style="page-break-after:always;"></div>
                ${headMunicipality}
            `}

               incidents = ` ${incidents}
               ${headColumns}`;

               register ++;

        if (register % 7== 0) {
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
                <td   style=" font-size: 5.5pt;text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
                ">
                ${index}
                <br>
                <span><b>${incident.folio}</b></span>
                <br>
                ${incident.created_at}
                </td>
                <td   style=" font-size: 5.5pt;text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${incident.address} ${incident.manzana} ${incident.lote} ${incident.internal_number} ${incident.external_number}
                <br>
                <span >
                ${incident.btw_street_first} y
                ${incident.btw_street_second}</span>
                <br>
                ${incident.settlement}
                <br>
                ${incident.citizen_fullname}
                </td>
                <td   style=" font-size: 5.5pt;text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
                ">
                ${incident.municipality}
                <br>
                <b>${incident.service_center}</b>
                <br>
                <b>${incident.codification_type} (SOLICITUD DE PIPA) </b>
                <br>
                ${incident.phone}
                <br>
                ${incident.reference}
                </td>
                <td style="
                margin: 0;
                padding: 3px;
                width:8%;
                max-width: 8%;
                text-align: center;
                font-size: 6.5pt;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.2;
                border: 1px solid black;">
                ${incident.stores} - ${incident.capacity} lts
                <br>
                <hr color="#DDD8D7" size=1>
                <br>
                ${incident.meters} mts
                </td>
                </tr>
                `;
                register++;
                if (register % 7== 0) {
                    incidents = `
                    ${incidents}
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
                incidents = `
                ${incidents}
                <tr>
                    <td colspan="3"
                    style="text-align:right ; font-size: 5.5pt;font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                    Subtotal:</td>
                    <th colspan="1"
                    style="font-size: 5.5pt;text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">
                    ${value.subtotal_incidents}
                    </th>
                    </tr>
                    <tr>
                    <td colspan="4"
                    style="height: 40px;font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);  border-style : hidden!important; border-top: thick green !important;">
                    Espacio</td>
                    </tr>
                    </tbody>
                    </table>
                `
                index = 0;
                register++;
                if (register % 7== 0) {
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
