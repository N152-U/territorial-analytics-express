module.exports = {
    relaciondereportescapturadosderedessocialesfuncion: (startDate, finalDate, today, relaciondereportescapturadosderedessociales, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
        let grand_total = 0, reports = "";
        let register = 0, solved = 0, in_process = 0, contador = 0, index = 0, average_solution_time = '', html, grandTotalTmpl, headColumns = '';
        headColumns = ` <table>
        <thead>               
        <tr>
            <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:5%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Folio</td> 

                <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:6%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Nombre Ciudadano </td>

                <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:4%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Red Social </td>

                <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:4%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Tipo de reporte</td>
                <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:5%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Alcaldia </td>
                <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:6%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Colonia </td>
                <td rowspan="2"
                style="color:#ffffff; background-color: #4aa714; width:3%; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                Telefono </td>
        </tr>
</thead>
        `;
        if (relaciondereportescapturadosderedessociales != '') {
            relaciondereportescapturadosderedessociales.forEach((value) => {
                grand_total += Number(value.subtotal_reports);
            })

            grandTotalTmpl = `<table>
            <tr>
            <th colspan="3"   style="font-size: 7pt; color:#ffa600; background-color: #ffffff; text-align:center;">TOTAL</th>
            <th colspan="4"   style="font-size: 7pt; color:#ffa600; background-color: #ffffff; text-align:center; border-bottom:1px;"> ${grand_total}</th>
            </tr>
            </table>`;

            relaciondereportescapturadosderedessociales.forEach((value) => {
                solved = 0, in_process = 0, contador = 0, average_solution_time = '';


                reports = ` ${reports}
                ${headColumns}
                `

                register++;

                if (register % 30 == 0) {
                    register += 2;
                    reports = ` ${reports}
                </table>
                <div style="page-break-after:always;"></div> 
                ${grandTotalTmpl}
                ${headColumns}
              `
                }

                reports = ` ${reports}
                
                <tbody>
                <tr>
                <th colspan="7"
                style="color:#ffa600; background-color: #dadada; font-size: 9pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${value.users}</th>
                </tr>
                
                `
                register++;

                if (register % 30 == 0) {
                    register += 2;
                    reports = `
                ${reports}
                
                </table>
                <div style="page-break-after:always;"></div>
                ${headColumns}
                
                <tr>
                <td colspan="11"
                style="color:#ffa600; background-color: #dadada; font-size: 9pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                ${value.users}</td>
                </tr>
                
            `}

                value.reports.forEach((report) => {
                    index++;
                    reports = ` ${reports} 
  
                <tbody>
                    <tr>
                        <td
                        style=" font-size: 6pt; width:5%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.sequence} 
                        </td>
                        <td
                        style=" font-size: 6pt; width:6%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.fullname} 
                        </td>
                        <td
                        style=" font-size: 6pt; width:4%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.receipt} 
                        </td>
                        <td
                        style=" font-size: 6pt; width:4%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.codification_type} 
                        </td>
                        <td
                        style=" font-size: 6pt; width:5%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.municipality} 
                        </td>
                        <td
                        style=" font-size: 6pt; width:6%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.settlement} 
                        </td>
                        <td
                        style=" font-size: 6pt; width:3%; text-align:left; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                            ${report.phone1} 
                        </td>
                    </tr>
                
                
                `;
                    register++;
                    if (register % 30 == 0) {
                        reports = ` ${reports} 
                        </tbody>
                        </table>
                <div style="page-break-after:always;"></div>
                <table>
                    <tr>
                    <th colspan="3"   style="font-size: 7pt; color:#ffa600; background-color: #ffffff; text-align:center;">TOTAL</th>
                    <th colspan="4"   style="font-size: 7pt; color:#ffa600; background-color: #ffffff; text-align:center; border-bottom:1px;"> ${grand_total}</th>
                    </tr>
                    </table> 
                    ${headColumns}  
                    
                    <tbody>
                    <tr>
                 
                    <th colspan="7"
                    style="color:#ffa600; background-color: #dadada; font-size: 9pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                    ${value.users}</th>
                    </tr>
               `;
                        register += 2;
                    }


                })



            });
            html = tmpl
                .replace("{{logoCDMX}}", logoCDMXB64)
                .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
                .replace("{{startDate}}", startDate)
                .replace("{{finalDate}}", finalDate)
                .replace("{{today}}", today)
                .replace("{{grand_total}}", grandTotalTmpl)
                .replace("{{reports}}", reports);
        } else {
            reports = `
              ${reports}
              ${headColumns}`;
            grandTotalTmpl = `<table>
            <tr>
            <th colspan="3"   style="font-size: 7pt; color:#ffa600; background-color: #ffffff; text-align:center;">TOTAL</th>
            <th colspan="4"   style="font-size: 7pt; color:#ffa600; background-color: #ffffff; text-align:center; border-bottom:1px;">0</th>
            </tr>
            </table>`;
            html = tmpl
                .replace("{{logoCDMX}}", logoCDMXB64)
                .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
                .replace("{{startDate}}", startDate)
                .replace("{{finalDate}}", finalDate)
                .replace("{{today}}", today)
                .replace("{{reports}}", reports)
                .replace("{{grand_total}}", grandTotalTmpl);
        }
        return html;
    },
};
