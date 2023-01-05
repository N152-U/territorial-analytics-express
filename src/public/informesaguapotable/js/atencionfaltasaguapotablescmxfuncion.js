module.exports = {
  atencionfaltasaguapotablescmxfuncion: (startDate, finalDate, today, atencionfaltasaguapotablescmx, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html = '', dataPotableWater = '';
    let reapirsTotal = 0, repairsNotReceived = 0, repairsProcess = 0, repairsInexistsWrongLocationDup = 0, repairsRepaired = 0, repairsPending = 0;

    atencionfaltasaguapotablescmx.forEach(element => {
      reapirsTotal += Number(element.incidents_total_camp);
      repairsNotReceived += Number(element.incidents_not_received_camp);
      repairsProcess += Number(element.incidents_process_camp);
      repairsInexistsWrongLocationDup += Number(element.incidents_inexists_wrong_location_dup_camp);
      repairsRepaired += Number(element.incidents_repaired_camp);
      repairsPending += Number(element.incidents_pending_camp);
    });

    dataPotableWater = `${dataPotableWater}
        <table  class="table table-bordered"  style="padding:0px!important;margin-top:-3px;">
          <thead>
            
            <tr style="padding:0px!important;">
              <th  rowspan="2" class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:2%; font-size: 6pt!important;">
               <br><br> CAMPAMENTO DE AGUA
               POTABLE DEL SACMEX</th>
            <th class="text-center header" style=" background-color:#E8E7ED!important;width:5%; font-size: 6pt!important;">1</th>
            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">2</th>
            <th  class="text-center header" style=" background-color:#E8E7ED!important;width:5%; font-size: 6pt!important;">3</th>
            <th  class="text-center header" style=" background-color:#E8E7ED!important;width:5%; font-size: 6pt!important;">4</th>
            <th  class="text-center header" style=" background-color:#E8E7ED!important;width:5%; font-size: 6pt!important;">5</th>
            <th  class="text-center header" style=" background-color:#E8E7ED!important;width:5%; font-size: 6pt!important;">6 (2+3)</th>
  
               
                              
            </tr>
            <tr style="padding:0px!important;">
            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
            REPORTES <br> RECIBIDOS EN LA UD <br> DE SEGUIMIENTO</th>
          <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
            REPORTES SIN <br> RECIBIR EN <br> CAMPAMENTOS Y <br> ALCALDÍAS</th>
          <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
          EN PROCESO DE<br>
          REPARACIÓN</th>
          <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
            REPORTES <br> INEXISTENTES, <br> DUPLICADOS Y <br> MALAS UBICACIONES </th>
          <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
          REPARADOS</th>
          <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 6pt!important;">
          REPORTES <br>
          PENDIENTES</th> 
          </tr>
           
          </thead>
  <tbody>`


    atencionfaltasaguapotablescmx.forEach(element => {
      dataPotableWater = `${dataPotableWater}
          <tr style="padding:0px!important;">
            <td class=BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 6.5pt; padding:0px;">
            ${element.name}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
            ${element.incidents_total_camp}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
            ${element.incidents_not_received_camp}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
            ${element.incidents_process_camp}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
            ${element.incidents_inexists_wrong_location_dup_camp}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
            ${element.incidents_repaired_camp}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 6.5pt; padding:2px;">
            ${element.incidents_pending_camp}</td>
          <tr>
        `;
    });
    dataPotableWater =
      `${dataPotableWater}
  </tbody>
          <tfoot>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
            Total</th>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
            ${reapirsTotal}</th>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
            ${repairsNotReceived}</th>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
            ${repairsProcess}</th>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
            ${repairsInexistsWrongLocationDup}</th>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
            ${repairsRepaired}</th>
            <th class="text-center header" style="width:8%!important; font-size: 7pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important;">
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
      .replace("{{dataPotableWater}}", dataPotableWater);

    return html;

  },
};
