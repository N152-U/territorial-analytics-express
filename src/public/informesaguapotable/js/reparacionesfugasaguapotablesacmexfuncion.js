module.exports = {
  reparacionesfugasaguapotablesacmexfuncion: (startDate, finalDate, today, reparacionesfugasaguapotablesacmex, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html = '', repairsPotableWater = '';
    let reapirsTotal = 0, repairsNotReceived = 0, repairsProcess = 0, repairsInexistsWrongLocationDup = 0, repairsRepaired = 0, repairsPending = 0;

    reparacionesfugasaguapotablesacmex.forEach(element => {
      reapirsTotal += Number(element.incidents_total);
      repairsNotReceived += Number(element.incidents_not_received);
      repairsProcess += Number(element.incidents_process);
      repairsInexistsWrongLocationDup += Number(element.incidents_inexists_wrong_location_dup);
      repairsRepaired += Number(element.incidents_repaired);
      repairsPending += Number(element.incidents_pending);
    });

    repairsPotableWater = `${repairsPotableWater}
      <table  class="table table-bordered"  style="padding:0px!important;margin-top:-3px;">
        <thead>
          <tr style="padding:0px!important;">
            <th class="text-center align-middle" rowspan="2" style="width:2%; max-width: 8%; font-size: 7pt!important; border: 2px solid rgb(0, 0, 0)!important;">ANEXO</th>
            <th class="text-center align-middle" colspan="6" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 7pt!important; border: 2px solid rgb(0, 0, 0)!important;">VIALIDAD PRIMARIA Y PUESTO DE MANDO</th>
            </tr>
            <tr style="padding:0px!important;">
            <th class="text-center header" style=" width:5%; font-size: 6pt!important;">1</th>
            <th  class="text-center header" style=" width:5%; font-size: 6pt!important;">2</th>
            <th  class="text-center header" style=" width:5%; font-size: 6pt!important;">3</th>
            <th  class="text-center header" style=" width:5%; font-size: 6pt!important;">4</th>
            <th  class="text-center header" style=" width:5%; font-size: 6pt!important;">5</th>
            <th  class="text-center header" style=" width:5%; font-size: 6pt!important;">6</th>
          </tr>
          <tr style="padding:0px!important;">
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:2%; font-size: 6pt!important;">
             <br><br> DISTRIBUIDO POR ALCALDIA </th>
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
              REPORTES <br> RECIBIDOS EN LA UD <br> DE SEGUIMIENTO</th>
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
              REPORTES SIN <br> RECIBIR EN <br> CAMPAMENTOS Y <br> ALCALDÍAS</th>
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
              FUGAS RECIBIDAS <br> EN PROCESO</th>
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
              REPORTES <br> INEXISTENTES, <br> DUPLICADOS Y <br> MALAS UBICACIONES </th>
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
              FUGAS <br> SOLUCIONADAS</th>
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
              FUGAS PENDIENTES <br> (2+3)</th>                        
          </tr>
        </thead>
<tbody>`


    reparacionesfugasaguapotablesacmex.forEach(element => {
      repairsPotableWater = `${repairsPotableWater}
        <tr style="padding:0px!important;">
          <td class=BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 6.5pt; padding:0px;">
          ${element.municipality}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
          ${element.incidents_total}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
          ${element.incidents_not_received}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
          ${element.incidents_process}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
          ${element.incidents_inexists_wrong_location_dup}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
          ${element.incidents_repaired}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
          ${element.incidents_pending}</td>
        <tr>
      `;
    });
    repairsPotableWater =
      `${repairsPotableWater}
</tbody>
        <tfoot>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          Total</th>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          ${reapirsTotal}</th>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          ${repairsNotReceived}</th>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          ${repairsProcess}</th>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          ${repairsInexistsWrongLocationDup}</th>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          ${repairsRepaired}</th>
          <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 1px solid!important;">
          ${repairsPending}</th>
</tfoot>
	</table>
      `

    html = tmpl
      .replace("{{logoCDMX}}", logoCDMXB64)
      .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
      .replace("{{startDate}}", startDate)
      .replace("{{finalDate}}", finalDate)
      .replace("{{today}}", today)
      .replace("{{repairsPotableWater}}", repairsPotableWater);

    return html;
  },
};
