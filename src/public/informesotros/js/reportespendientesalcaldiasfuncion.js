module.exports = {
  reportespendientesalcaldiasfuncion: (startDate, finalDate, today, reportespendientesalcaldias, reportespendientesacmex, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html = '', index = 0, reportsMunicipality = '';
    let a1 = 0, b1 = 0, c1 = 0, d1 = 0, e1 = 0, f1 = 0, g1 = 0, h1 = 0, i1 = 0, j1 = 0, subM = 0, k1 = 0, l1 = 0, m1 = 0, n1 = 0, o1 = 0, p1 = 0, q1 = 0, r1 = 0, s1 = 0, t1 = 0, subS = 0;

    reportespendientesalcaldias.forEach(element => {
      a1 += Number(element.a);
      b1 += Number(element.b);
      c1 += Number(element.c);
      d1 += Number(element.d);
      e1 += Number(element.e);
      f1 += Number(element.f);
      g1 += Number(element.g);
      h1 += Number(element.h);
      i1 += Number(element.i);
      j1 += Number(element.j);
      subM += Number(element.total)
    });

    reportespendientesacmex.forEach(element => {
      k1 += Number(element.k);
      l1 += Number(element.l);
      m1 += Number(element.m);
      n1 += Number(element.n);
      o1 += Number(element.o);
      p1 += Number(element.p);
      q1 += Number(element.q);
      r1 += Number(element.r);
      s1 += Number(element.s);
      t1 += Number(element.t);
      subS += Number(element.total)
    });


    reportsMunicipality = `
    ${reportsMunicipality}
    <table>
      <thead>
        <tr>
          <th class="text-center align-middle" rowspan="2" style="background-color:#BBBBBB!important; width:1%!important; font-size: 6pt!important; padding:15px!important; border: 2px solid rgb(0, 0, 0);">N° Prog</th>  
          <th class="text-center align-middle" rowspan="2" style="background-color:#BBBBBB!important; width:3%!important; font-size: 6pt!important; padding:15px!important; border: 2px solid rgb(0, 0, 0);">Alcaldia</th>  
          <th class="text-center align-middle" colspan="24" style="background-color:#BBBBBB!important; font-size: 8pt!important; padding:15px!important; border: 2px solid rgb(0, 0, 0);">FUGAS DE AGUA POTABLE</th>  
        </tr>
        <tr>
          <th class="text-center align-middle" colspan="11" style="background-color:#EEEEEE!important; width:9%; font-size: 6pt!important; padding:15px!important; border: 2px solid rgb(0, 0, 0);">ASIGNADAS A LAS ALCALDÍAS </th>  
          <th class="text-center align-middle" colspan="11" style="background-color:#EEEEEE!important; width:9%; font-size: 6pt!important; padding:15px!important; border: 2px solid rgb(0, 0, 0);">ASIGNADAS A S.A.C.M.E.X.</th>  
        </tr>
        <tr>
          <th class="text-center align-middle" style="width:1%; font-size: 6pt!important; padding:5px!important;"><br></td>  
          <th class="text-center align-middle" style="width:3%; font-size: 6pt!important; padding:5px!important;"><br></td>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>0</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>1 a 2</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>3 a 4</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>5 a 7</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>8-10</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>11-20</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>21-30</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>31-60</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>61-90</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>>90</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>total</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>0</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>1 a 2</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>3 a 4</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>5 a 7</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>8-10</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>11-20</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>21-30</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>31-60</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>61-90</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>>90</th>  
          <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);"><br>total</th>

        </tr>
      </thead>
      <tbody>
    `;


    reportespendientesalcaldias.forEach(element => {
      index++;
      reportsMunicipality =
        `${reportsMunicipality}

        <tr>
        <td class="text-center header"  style="font-size: 5pt!important; width:1%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${index}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.municipality}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.a}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.b}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.c}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.d}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.e}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.f}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.g}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.h}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.i}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.j}</td>
        <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
        ${element.total}</td> 
        `
      reportespendientesacmex.forEach(elementSacmex => {
        if (element.municipality == elementSacmex.municipality) {
          reportsMunicipality =
            `${reportsMunicipality}
            <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.k}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.l}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.m}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.n}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.o}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.p}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.q}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.r}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.s}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.t}</td>
              <td class="text-center header" style="font-size: 5pt!important; width:3%!important; font-size: 8pt; padding:0px; border: 1px solid rgb(0, 0, 0);">
              ${elementSacmex.total}</td>
            </tr>            
              `
        }
      });
    });

    reportsMunicipality =
      `${reportsMunicipality}
    <tr>
      <th class="text-center align-middle" colspan="2" style="width:3%; font-size: 6pt!important; padding:5px!important; border-top: 2px solid rgb(0, 0, 0);">
      Subtotales</th> 
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${a1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${b1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${c1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${d1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${e1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${f1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${g1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${h1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${i1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${j1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${subM}</th>
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${k1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${l1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${m1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${n1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${o1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${p1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${q1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${r1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${s1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${t1}</th>  
      <th class="text-center align-middle" style="background-color:#DDDDDD!important; width:3%; font-size: 6pt!important; padding:5px!important; border: 2px solid rgb(0, 0, 0);">
      ${subS}</th>  
    </tr>
    <tr>
      <th class="text-center align-middle" colspan="2" style="width:3%; font-size: 6pt!important; padding:10px!important; border-top: 2px solid rgb(0, 0, 0);">
      Total <br><br></th>
      <th class="text-center align-middle" colspan="24" style="width:3%; font-size: 6pt!important; padding:10px!important; border: 2px solid rgb(0, 0, 0);">
      ${subM + subS} <br><br></th>
     
    </tr>
    <tr>
    <th class="text-center align-middle" colspan="25" style="width:3%; font-size: 6pt!important; padding:10px!important; border-top: 2px solid rgb(0, 0, 0);">
    Elaboró: Unidad Departamental De Seguimiento Y Apoyo<br><br></th>
    
    `;


    reportsMunicipality =
      `${reportsMunicipality}
    </tbody>`;


    html = tmpl
      .replace("{{logoCDMX}}", logoCDMXB64)
      .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
      .replace("{{startDate}}", startDate)
      .replace("{{finalDate}}", finalDate)
      .replace("{{today}}", today)
      .replace("{{reportsMunicipality}}", reportsMunicipality);
    return html;
  },
};
