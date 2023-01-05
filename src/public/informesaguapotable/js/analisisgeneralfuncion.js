module.exports = {
  analisisgeneralfuncion: (startDate, finalDate, today, analisisgeneralaguapotable, analisisgeneraldrenaje, analisisgeneralaguatratada, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html, potableWaterData = '', potableWaterHeader = '', drainageHeader = '', drainageData = '', treatedWaterHeader = '', treatedWaterData = '';
    let potableWaterTotal = 0, potableWaterNotReceived = 0, potableWaterInexists = 0, potableWaterWrong = 0, potableWaterDuplicated = 0, potableWaterNeto = 0, potableWaterRepaired = 0, potableWaterProcess = 0;
    let drainageTotal = 0, drainageNotReceived = 0, drainageInexists = 0, drainageWrong = 0, drainageDuplicated = 0, drainageNeto = 0, drainageRepaired = 0, drainageProcess = 0;
    let treatedWaterTotal = 0, treatedWaterNotReceived = 0, treatedWaterInexists = 0, treatedWaterWrong = 0, treatedWaterDuplicated = 0, treatedWaterNeto = 0, treatedWaterRepaired = 0, treatedWaterProcess = 0;
    let grand_total = '', totalProcess = '', toalRepaired = '',processIncidents=0;
    //console.log("analisisgeneralaguapotable",analisisgeneralaguapotable);



    analisisgeneralaguapotable.forEach(element => {
      potableWaterTotal += Number(element.incidents_total);
      potableWaterNotReceived += Number(element.incidents_not_received);
      potableWaterInexists += Number(element.incidents_inexists);
      potableWaterWrong += Number(element.incidents_wrong_location);
      potableWaterDuplicated += Number(element.incidents_duplicated);
      potableWaterNeto += Number(element.incidents_neto);
      potableWaterRepaired += Number(element.incidents_repaired);
      potableWaterProcess += Number(element.incidents_process);


      potableWaterData = `${potableWaterData} 
        <tbody>
          <tr style="padding:0px;">
            <td class="text-left" BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 5pt; padding:0px;">
            ${element.codification_type}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${Number(element.incidents_total)}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_not_received}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_inexists}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_wrong_location}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_duplicated}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_neto} </td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_repaired}</td>
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${element.incidents_process}</td>        
            <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
            ${((element.incidents_repaired) != 0 ? (((Number.parseFloat(element.incidents_repaired) / (Number.parseFloat(element.incidents_repaired) + Number.parseFloat(element.incidents_process))) * 100).toFixed(2)) : 0)} %</td>
           
          `
    });

    analisisgeneraldrenaje.forEach(element => {
      drainageTotal += Number(element.incidents_total);
      drainageNotReceived += Number(element.incidents_not_received);
      drainageInexists += Number(element.incidents_inexists);
      drainageWrong += Number(element.incidents_wrong_location);
      drainageDuplicated += Number(element.incidents_duplicated);
      drainageNeto += Number(element.incidents_neto);
      drainageRepaired += Number(element.incidents_repaired);
      drainageProcess += Number(element.incidents_process);


      drainageData =
        `${drainageData} 
      
      <tbody>
        <tr style="padding:0px;">
          <td class="text-left" BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 5pt; padding:0px;">
          ${element.codification_type}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${Number(element.incidents_total)}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_not_received}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_inexists}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_wrong_location}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_duplicated}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_neto} </td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_repaired}</td>
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${element.incidents_process}</td>        
          <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
          ${(element.incidents_repaired) != 0 ? (((Number.parseFloat(element.incidents_repaired) / (Number.parseFloat(element.incidents_repaired) + Number.parseFloat(element.incidents_process))) * 100).toFixed(2)) : 0} %</td>
        <tr>
        `
    });

    analisisgeneralaguatratada.forEach(element => {
      treatedWaterTotal += Number(element.incidents_total);
      treatedWaterNotReceived += Number(element.incidents_not_received);
      treatedWaterInexists += Number(element.incidents_inexists);
      treatedWaterWrong += Number(element.incidents_wrong_location);
      treatedWaterDuplicated += Number(element.incidents_duplicated);
      treatedWaterNeto += Number((Number(element.incidents_neto)));
      treatedWaterRepaired += Number(element.incidents_repaired);
      treatedWaterProcess += Number(element.incidents_process);


      treatedWaterData =
        `${treatedWaterData} 

    <tbody>
      <tr style="padding:0px;">
        <td class="text-left" BGCOLOR="#E8E7ED" style="width:8%!important; font-size: 5pt; padding:0px;">
        ${element.codification_type}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${Number(element.incidents_total)}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_not_received}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_inexists}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_wrong_location}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_duplicated}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_neto} </td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_repaired}</td>
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${element.incidents_process}</td>        
        <td class="text-center" BGCOLOR="#E8E7ED" style="width:5%!important; font-size: 5pt; padding:0px;">
        ${(element.incidents_repaired) != 0 ? (((Number.parseFloat(element.incidents_repaired) / (Number.parseFloat(element.incidents_repaired) + Number.parseFloat(element.incidents_process))) * 100).toFixed(2)) : 0} %</td>
      <tr>
      `
    });

    potableWaterHeader =
      `${potableWaterHeader}
<table  class="table table-bordered"  style="table-layout:fixed; margin-bottom: 5px;">
  <thead>
  <th class="text-center header" 
  style="background-color:#E8E7ED!important;font-size: 5pt; width:8%!important;padding:0px!important;">Agua Potable</th>
  <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterTotal}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterNotReceived}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterInexists}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterWrong}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterDuplicated}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterNeto}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterRepaired}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterProcess}</th>
  <th class="text-center header" style="background-color:#E8E7ED!important;  width:5%!important;font-size: 5pt;padding:0px!important;">${((Number(potableWaterRepaired) != 0 ? (((Number(potableWaterRepaired) / (Number(potableWaterRepaired) + Number(potableWaterProcess))) * 100).toFixed(2)) : 0))} %</th>

  `;
    drainageHeader =
      `${drainageHeader}
  <table  class="table table-bordered"  style="table-layout:fixed; margin-bottom: 5px;">
    <thead>
    <th class="text-center header" style="background-color:#E8E7ED!important;font-size: 5pt; width:8%!important;padding:0px!important;">Drenaje</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageTotal}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageNotReceived}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageInexists}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageWrong}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageDuplicated}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageNeto}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageRepaired}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${drainageProcess}</th>
    <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${((drainageRepaired) != 0 ? (((Number(drainageRepaired) / (Number(drainageRepaired) + Number(drainageProcess))) * 100).toFixed(2)) : 0)} %</th>

    `;
    treatedWaterHeader =
      `${treatedWaterHeader}
    <table  class="table table-bordered"  style="table-layout:fixed; margin-bottom: 5px;">
      <thead>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:8%!important;font-size: 5pt;padding:0px!important;">Agua Tratada</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterTotal}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterNotReceived}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterInexists}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterWrong}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterDuplicated}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterNeto}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterRepaired}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${treatedWaterProcess}</th>
      <th class="text-center header" style="background-color:#E8E7ED!important; width:5%!important;font-size: 5pt;padding:0px!important;">${(Number(treatedWaterRepaired) != 0 ? (((Number(treatedWaterRepaired) / (Number(treatedWaterRepaired) + Number(treatedWaterProcess))) * 100).toFixed(2)) : 0)} %</th>

      `;

    grand_total =
      `${grand_total}
      <table  class="table table-bordered"  style="table-layout:fixed; margin-bottom: 5px;">
        <thead>
        <th class="text-center header" 
        style="width:8%!important;padding:0px!important;font-size: 5.5pt;">Gran Total</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterTotal + drainageTotal + treatedWaterTotal}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterNotReceived + drainageNotReceived + treatedWaterNotReceived}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterInexists + drainageInexists + treatedWaterInexists}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterWrong + drainageWrong + treatedWaterWrong}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterDuplicated + drainageDuplicated + treatedWaterDuplicated}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${potableWaterNeto + drainageNeto + treatedWaterNeto}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${toalRepaired = (potableWaterRepaired + drainageRepaired + treatedWaterRepaired)}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${totalProcess = (potableWaterProcess + drainageProcess + treatedWaterProcess)}</th>
        <th class="text-center header"; style="width:5%!important;font-size: 5pt;padding:0px!important;">${Number(toalRepaired) != 0 ? (((Number(toalRepaired) / (Number(toalRepaired) + Number(totalProcess))) * 100).toFixed(2)) : 0}%</th>
      `;


    html = tmpl
      .replace("{{logoCDMX}}", logoCDMXB64)
      .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
      .replace("{{startDate}}", startDate)
      .replace("{{finalDate}}", finalDate)
      .replace("{{today}}", today)
      .replace("{{potableWaterHeader}}", potableWaterHeader)
      .replace("{{potableWaterData}}", potableWaterData)
      .replace("{{drainageHeader}}", drainageHeader)
      .replace("{{drainageData}}", drainageData)
      .replace("{{treatedWaterHeader}}", treatedWaterHeader)
      .replace("{{treatedWaterData}}", treatedWaterData)
      .replace("{{grand_total}}", grand_total);

    return html;
  },
};
