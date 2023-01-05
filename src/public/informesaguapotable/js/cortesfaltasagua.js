module.exports = {
    cortesfaltaagua: (startDate, finalDate, today, cortesfaltasagua, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
        let html, incidents = '', index = 0, register = 0, grand_total = 0;
        if (cortesfaltasagua != '') {

            incidents = `     
     
                <tbody>
                    <tr>
                        <td style="background-color: #D9D9D9; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)"><strong>&nbsp;Alcald&iacute;a</strong></td>
                        <td style="background-color: #D9D9D9; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)"  ><strong>Cantidad</strong></td>
                    </tr>
            `;
            cortesfaltasagua.forEach(element => {
                grand_total+=Number(element.incidentscount);
                incidents = `${incidents}   
                <tr  style="font-size: 6.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0) ">
                    <td style="font-size: 6.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0) " >
                    <b>${element.municipality}</b>
                    </td>
                    <td  style=" font-size: 6.5pt; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">${element.incidentscount}</td>
                </tr>
                `;
            });
            incidents = `${incidents}
            <tr >
                  <td style=" background-color: #D9D9D9; font-size: 6.5pt; text-align:right; line-height: 1.2; border: 1px solid rgb(2, 0, 0) "><strong>&nbsp;Total:</strong></td>
                  <td style="background-color: #D9D9D9; font-size: 6.5pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)">${grand_total}</td>
              </tr>
            </tbody>
            `
            html = tmpl
                .replace("{{logoCDMX}}", logoCDMXB64)
                .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
                .replace("{{startDate}}", startDate)
                .replace("{{finalDate}}", finalDate)
                .replace("{{today}}", today)
                .replace("{{incidents}}", incidents);

        } else {
            html = tmpl
                .replace("{{logoCDMX}}", logoCDMXB64)
                .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
                .replace("{{startDate}}", startDate)
                .replace("{{finalDate}}", finalDate)
                .replace("{{today}}", today)
                .replace("{{incidents}}", '');
        }

        return html;
    },
};
