module.exports = {
  fugasaguapotablediametrosalcaldiasfuncion: (startDate, finalDate, today, fugasaguapotablediametrosalcaldias, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html = '', leaksPotableWater = '';
    let totalInche = 0, a1 = 0, b1 = 0, c1 = 0, d1 = 0, e1 = 0, f1 = 0, g1 = 0, h1 = 0, i1 = 0, j1 = 0, k1 = 0, l1 = 0, m1 = 0, n1 = 0, ñ1 = 0, o1 = 0, p1 = 0, q1 = 0, r1 = 0, s1 = 0, t1 = 0, u1 = 0, v1 = 0, w1 = 0;

    fugasaguapotablediametrosalcaldias.forEach(element => {
      //console.log("element",element);
      totalInche += Number(element.Total);
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
      k1 += Number(element.k);
      l1 += Number(element.l);
      m1 += Number(element.m);
      n1 += Number(element.n);
      ñ1 += Number(element.ñ);
      o1 += Number(element.o);
      p1 += Number(element.p);
      q1 += Number(element.q);
      r1 += Number(element.r);
      s1 += Number(element.s);
      t1 += Number(element.t);
      u1 += Number(element.u);
      v1 += Number(element.v);
      w1 += Number(element.w);

    });


    leaksPotableWater = `
    ${leaksPotableWater}
    

      <thead>
        <tr>
          <th class="text-center align-middle" rowspan="2" style="background-color:#E8E7ED!important; width:9%; font-size: 8pt!important; padding:20px!important; border: 2px solid rgb(0, 0, 0);">ALCALDÍA</th>
          <th class="text-center align-middle" colspan="24" style="background-color:#E8E7ED!important; font-size: 9pt!important; padding:20px!important; border: 1px solid rgb(0, 0, 0);">DIAMETRO [PULGADAS]</th>
          <th class="text-center align-middle" rowspan="2" style="background-color:#E8E7ED!important; width:4%!important; font-size: 8pt!important; border: 1px solid rgb(0, 0, 0);">TOTAL</th>
        </tr>

        <tr>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;"><br><br>1/2</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">3/8</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">5/8</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">3/4</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1 <br> 1/4</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1 <br> 1/2</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">2</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">2 <br> 1/2</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">3</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">4</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">5</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">6</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">8</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">10</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">12</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">16</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">20</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">24</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">30</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">36</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">42</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">48</th>
          <th class="text-center header" style="font-size: 6pt!important; padding:10px; border: 1px solid rgb(0, 0, 0); width:3%!important;">72</th>
          
        </tr>
      </thead>
    `;

    fugasaguapotablediametrosalcaldias.forEach(element => {

      leaksPotableWater =
        `${leaksPotableWater}
      
      <tbody>
              <tr style="padding:0px;">
                <td class="BGCOLOR=#E8E7ED" style="width:9%!important; font-size: 7pt!important; padding:0px; font-weight: bolder;">
                ${element.municipality}</td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.a}</font>
                </td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.b}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.c}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.d}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.e}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.f}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.g}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.h}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.i}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.j}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.k}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.l}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.m}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.n}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.ñ}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.o}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.p}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.q}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.r}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.s}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.t}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.u}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.v}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                <font color="#0105FF">${element.w}</font></td>
                <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:1px;">
                ${element.Total}</th>
              <tr>
            `;
    });

    leaksPotableWater =
      `${leaksPotableWater} 
    <tr>
        <th class="text-center" style="background-color:#E8E7ED!important; width:5%!important; font-size: 8pt!important; padding:1px;">
        TOTAL </th>
        <th align="center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${a1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${b1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${c1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${d1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${e1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${f1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${g1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${h1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${i1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${j1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${k1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${l1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${m1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${n1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${ñ1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${o1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${p1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${q1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${r1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${s1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${t1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${u1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${v1}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${w1}</th>  
        <th class="text-center" style="background-color:#E8E7ED!important; width:5%!important; font-size: 6pt!important; padding:0px!important;">
        <font color="#FF0000">${totalInche}</font></th>          
        `;

    leaksPotableWater =
      `${leaksPotableWater} 
    <tr>
        <th class="text-center" style="background-color:#E8E7ED!important; width:5%!important; font-size: 8pt!important; padding:1px;">
        % </th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(a1) * 100 / (Number(totalInche))))?((Number(a1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(b1) * 100 / (Number(totalInche))))?((Number(b1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(c1) * 100 / (Number(totalInche))))?((Number(c1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(d1) * 100 / (Number(totalInche))))?((Number(d1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(e1) * 100 / (Number(totalInche))))?((Number(e1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(f1) * 100 / (Number(totalInche))))?((Number(f1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(g1) * 100 / (Number(totalInche))))?((Number(g1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(h1) * 100 / (Number(totalInche))))?((Number(h1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(i1) * 100 / (Number(totalInche))))?((Number(i1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(j1) * 100 / (Number(totalInche))))?((Number(j1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(k1) * 100 / (Number(totalInche))))?((Number(k1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(l1) * 100 / (Number(totalInche))))?((Number(l1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(m1) * 100 / (Number(totalInche))))?((Number(m1) * 100 / (Number(totalInche))).toFixed(2)):0}</td>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(n1) * 100 / (Number(totalInche))))?((Number(n1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(ñ1) * 100 / (Number(totalInche))))?((Number(ñ1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(o1) * 100 / (Number(totalInche))))?((Number(o1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(p1) * 100 / (Number(totalInche))))?((Number(p1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(q1) * 100 / (Number(totalInche))))?((Number(q1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(r1) * 100 / (Number(totalInche))))?((Number(r1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(s1) * 100 / (Number(totalInche))))?((Number(s1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(t1) * 100 / (Number(totalInche))))?((Number(t1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(u1) * 100 / (Number(totalInche))))?((Number(u1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(v1) * 100 / (Number(totalInche))))?((Number(v1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="width:3%!important; font-size: 6pt!important; padding:0px;">
        ${((Number(w1) * 100 / (Number(totalInche))))?((Number(w1) * 100 / (Number(totalInche))).toFixed(2)):0}</th>
        <th class="text-center" style="background-color:#E8E7ED!important; width:5%!important; font-size: 6pt!important; padding:0px;">
        100%</th>
        `;

    html = tmpl
      .replace("{{logoCDMX}}", logoCDMXB64)
      .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
      .replace("{{startDate}}", startDate)
      .replace("{{finalDate}}", finalDate)
      .replace("{{today}}", today)
      .replace("{{leaksPotableWater}}", leaksPotableWater);

    return html;
  },
};
