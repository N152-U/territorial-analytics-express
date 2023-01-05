module.exports = {
  reparacionesfugasaguapotablescmxalcaldiasfuncion: (startDate, finalDate, today, reparacionesfugasaguapotablescmxalcaldias, reparacionesfugasaguapotablecamp, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html = '', repairsPotableWaterMunicipality = '', repairsPotableWaterCamp = '', grandTotal = '';
    let reapirsTotal = 0, repairsNotReceived = 0, repairsProcess = 0, repairsInexistsWrongLocationDup = 0, repairsRepaired = 0, repairsPending = 0;
    let reapirsTotal_camp = 0, repairsNotReceived_camp = 0, repairsProcess_camp = 0, repairsInexistsWrongLocationDup_camp = 0, repairsRepaired_camp = 0, repairsPending_camp = 0;

    reparacionesfugasaguapotablescmxalcaldias.forEach(element => {
      reapirsTotal += Number(element.incidents_total);
      repairsNotReceived += Number(element.incidents_not_received);
      repairsProcess += Number(element.incidents_process);
      repairsInexistsWrongLocationDup += Number(element.incidents_inexists_wrong_location_dup);
      repairsRepaired += Number(element.incidents_repaired);
      repairsPending += Number(element.incidents_pending);
    });

    reparacionesfugasaguapotablecamp.forEach(element => {
      reapirsTotal_camp += Number(element.incidents_total_camp);
      repairsNotReceived_camp += Number(element.incidents_not_received_camp);
      repairsProcess_camp += Number(element.incidents_process_camp);
      repairsInexistsWrongLocationDup_camp += Number(element.incidents_inexists_wrong_location_dup_camp);
      repairsRepaired_camp += Number(element.incidents_repaired_camp);
      repairsPending_camp += Number(element.incidents_pending_camp);
    });

    repairsPotableWaterMunicipality =
      `${repairsPotableWaterMunicipality}
    <table  class="table table-bordered"  style="table-layout:fixed;">
    <thead>
      <tr style="padding:0px;">
        <th class="text-center align-middle" rowspan="2" style="width:2%; max-width: 8%; font-size: 6pt!important; border: 2px solid rgb(0, 0, 0)!important; padding:0px;">ANEXO</th>
        <th class="text-center align-middle" colspan="6" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 6pt!important; border: 2px solid rgb(0, 0, 0)!important; padding:0px;">VIALIDAD</th>
      </tr>

      <tr>
        <th class="text-center header" style=" width:5%; font-size: 5pt!important; padding:1px;">1</th>
        <th  class="text-center header" style=" width:5%; font-size: 5pt!important; padding:1px;">2</th>
        <th  class="text-center header" style=" width:5%; font-size: 5pt!important; padding:1px;">3</th>
        <th  class="text-center header" style=" width:5%; font-size: 5pt!important; padding:1px;">4</th>
        <th  class="text-center header" style=" width:5%; font-size: 5pt!important; padding:1px;">5</th>
        <th  class="text-center header" style=" width:5%; font-size: 5pt!important; padding:1px;">6</th>
      </tr>

      <tr style="padding:0px;">
         <th class="text-center header" style=" width:5%; font-size: 4.5pt!important; padding:0px;"></th>
        <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 4.5pt!important; padding:0px;">
          REPORTES RECIBIDOS EN LA UD  DE <br> SEGUIMIENTO</th>
        <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 4.5pt!important; padding:0px;">
          REPORTES SIN  RECIBIR EN <br> CAMPAMENTOS Y ALCALDÍAS</th>
        <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 4.5pt!important; padding:0px;">
          FUGAS RECIBIDAS  EN PROCESO</th>
        <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 4.5pt!important; padding:0px;">
          REPORTES  INEXISTENTES, DUPLICADOS <br> Y  MALAS UBICACIONES </th>
        <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 4.5pt!important; padding:0px;">
          FUGAS SOLUCIONADAS</th>
        <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%; font-size: 4.5pt!important; padding:0px;">
          FUGAS PENDIENTES  (2+3)</th>                        
      </tr>
      <tr>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:1px;">
        Alcaldía</th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:0px;"></th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:0px;"></th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:0px;"></th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:0px;"></th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:0px;"></th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; padding:0px;"></th>
    </tr>
    </thead>
    `

    reparacionesfugasaguapotablescmxalcaldias.forEach(element => {
      repairsPotableWaterMunicipality = `${repairsPotableWaterMunicipality}
            <tbody>
              <tr style="padding:0px;">
                <td class=BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 4.5pt!important; padding:0px;">
                ${element.municipality}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_total}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_not_received}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_process}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_inexists_wrong_location_dup}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_repaired}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_pending}</td>
              <tr>
            `;
    });
    repairsPotableWaterMunicipality =
      `${repairsPotableWaterMunicipality}
        <thead>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          SUBTOTAL:</th>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          ${reapirsTotal}</th>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          ${repairsNotReceived}</th>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          ${repairsProcess}</th>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          ${repairsInexistsWrongLocationDup}</th>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          ${repairsRepaired}</th>
          <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
          ${repairsPending}</th>
          <tr>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:1px;">
          Agua Potable</th>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:0px;"></th>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:0px;"></th>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:0px;"></th>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:0px;"></th>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:0px;"></th>
          <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5.5pt!important; padding:0px;"></th>
        </tr>
    `;

    reparacionesfugasaguapotablecamp.forEach(element => {
      repairsPotableWaterCamp = `${repairsPotableWaterCamp}
            <tbody>
            
              <tr style="padding:0px;">
                <td class=BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.name}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_total_camp}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_not_received_camp}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_process_camp}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_inexists_wrong_location_dup_camp}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_repaired_camp}</td>
                <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 4.5pt!important; padding:1px;">
                ${element.incidents_pending_camp}</td>
              </tr>
            `;
    });

    repairsPotableWaterCamp =
      `${repairsPotableWaterCamp}

        <tr>
        <thead>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        SUBTOTAL:</th>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        ${reapirsTotal_camp}</th>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        ${repairsNotReceived_camp}</th>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        ${repairsProcess_camp}</th>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        ${repairsInexistsWrongLocationDup_camp}</th>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        ${repairsRepaired_camp}</th>
        <th class="text-center header" style="width:8%!important; font-size: 4.5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:5px;">
        ${repairsPending_camp}</th>
        </tr>    
    `;

    grandTotal = `
    ${grandTotal}
    <tr>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:1px;">
        TOTAL </th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:0px;">
        ${reapirsTotal + reapirsTotal_camp}</th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:0px;">
        ${repairsNotReceived + repairsNotReceived_camp}</th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:0px;">
        ${repairsProcess + repairsProcess_camp}</th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:0px;">
        ${repairsInexistsWrongLocationDup + repairsInexistsWrongLocationDup_camp}</th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:0px;">
        ${repairsRepaired + repairsRepaired_camp}</th>
        <th class="text-center align-middle" style="background-color:#E8E7ED!important; width:8%; max-width: 8%; font-size: 5pt!important; border-top: 2px solid!important; border-bottom: 2px solid!important; padding:0px;">
        ${repairsPending + repairsPending_camp}</th>
    </tr>`





    html = tmpl
      .replace("{{logoCDMX}}", logoCDMXB64)
      .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
      .replace("{{startDate}}", startDate)
      .replace("{{finalDate}}", finalDate)
      .replace("{{today}}", today)
      .replace("{{repairsPotableWaterMunicipality}}", repairsPotableWaterMunicipality)
      .replace("{{repairsPotableWaterCamp}}", repairsPotableWaterCamp)
      .replace("{{grandTotal}}", grandTotal);

    return html;
  },
};
