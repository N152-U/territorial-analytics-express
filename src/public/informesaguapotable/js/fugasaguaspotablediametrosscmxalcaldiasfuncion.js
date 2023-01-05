module.exports = {
  fugasaguaspotablediametrosscmxalcaldiasfuncion: (startDate, finalDate, today, fugasaguaspotablediametrosscmxalcaldias, fugasaguaspotablediametrosscmxcamp, tmpl,logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html='', leaksPotableWater='';
    let totalInche=0, a1=0, b1=0, c1=0, d1=0, e1=0, f1=0, g1=0, h1=0, i1=0, j1=0, k1=0, l1=0, m1=0, n1=0, ñ1=0, o1=0, p1=0, q1=0, r1=0, s1=0, t1=0, u1=0, v1=0, w1=0;
    let totalCamp=0, a2=0, b2=0, c2=0, d2=0, e2=0, f2=0, g2=0, h2=0, i2=0, j2=0, k2=0, l2=0, m2=0, n2=0, ñ2=0, o2=0, p2=0, q2=0, r2=0, s2=0, t2=0, u2=0, v2=0, w2=0;
    

    fugasaguaspotablediametrosscmxalcaldias.forEach(element=>{
      totalInche += Number (element.Total);
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

    fugasaguaspotablediametrosscmxcamp.forEach(element=>{
      totalCamp += Number (element.Total);
      a2 += Number(element.a);
      b2 += Number(element.b);
      c2 += Number(element.c);
      d2 += Number(element.d);
      e2 += Number(element.e);
      f2 += Number(element.f);
      g2 += Number(element.g);
      h2 += Number(element.h);
      i2 += Number(element.i);
      j2 += Number(element.j);
      k2 += Number(element.k);
      l2 += Number(element.l);
      m2 += Number(element.m);
      n2 += Number(element.n);
      ñ2 += Number(element.ñ);
      o2 += Number(element.o);
      p2 += Number(element.p);
      q2 += Number(element.q);
      r2 += Number(element.r);
      s2 += Number(element.s);
      t2 += Number(element.t);
      u2 += Number(element.u);
      v2 += Number(element.v);
      w2 += Number(element.w);
      
    });




    leaksPotableWater = `
    ${leaksPotableWater}
    
    <table  class="table table-bordered"  style="table-layout:fixed;">
      <thead>

        <tr>
          <td class="text-center align-middle" rowspan="2" style="width:4%!important; font-size: 5pt; padding:0px;">DEPENDENCIA</td>
          <th class="text-center align-middle" rowspan="2" style="background-color:#E8E7ED!important; width:13%!important; font-size: 5pt;!important; padding:20px!important; border: 2px solid rgb(0, 0, 0);">CAMPAMENTO</th>
          <th class="text-center align-middle" colspan="24" style="background-color:#E8E7ED!important; font-size: 10pt!important; padding:0px!important; border: 1px solid rgb(0, 0, 0);">DIAMETRO [PULGADAS]</th>
          <th class="text-center align-middle" rowspan="2" style="background-color:#E8E7ED!important; width:4%!important; font-size: 5pt;!important; border: 1px solid rgb(0, 0, 0);">TOTAL</th>
        </tr>

        <tr>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1/2</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">3/8</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">5/8</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">3/4</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1 1/4</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">1 1/2</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">2</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">2 1/2</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">3</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">4</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">5</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">6</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">8</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">10</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">12</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">16</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">20</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">24</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">30</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">36</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">42</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">48</th>
          <th class="text-center header" style="font-size: 5pt;!important; padding:0px; border: 1px solid rgb(0, 0, 0); width:3%!important;">72</th>           
          </tr>          
        </thead>
    `;
    leaksPotableWater =
    `${leaksPotableWater}
        <tr>
          <td class="text-center align-middle" rowspan="18" style="width:4%!important; font-size: 5pt; padding:0px;">Alcaldía</td>
        </tr>     
      `

    fugasaguaspotablediametrosscmxalcaldias.forEach(element => {
      leaksPotableWater = 
      `${leaksPotableWater}       
       
      <tr>  
                <td class="BGCOLOR=#E8E7ED" style="width:9%!important; font-size: 5pt; padding:0px;">
                ${element.municipality}</td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:1px;">
                <font color="#0105FF">${element.a}</font>
                </td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.b}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.c}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.d}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.e}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.f}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.g}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.h}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.i}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.j}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.k}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.l}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.m}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.n}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.ñ}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.o}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.p}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.q}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.r}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.s}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.t}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.u}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.v}</font></td>
                <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                <font color="#0105FF">${element.w}</font></td>
                <th class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                ${element.Total}</th>
                </tr>    
            `;              
    });
    leaksPotableWater = 
    `${leaksPotableWater} 
    <tr>
        <th class="text-center" style="background-color:#E8E7ED!important; width:5%!important; font-size: 5pt;!important; padding:1px;">
        SUBTOTAL</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${a1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${b1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${c1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${d1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${e1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${f1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${g1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${h1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${i1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${j1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${k1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${l1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${m1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${n1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${ñ1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${o1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${p1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${q1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${r1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${s1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${t1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${u1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${v1}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${w1}</th>  
        <th class="text-center" style="width:5%!important; font-size: 5pt!important; padding:0px!important;">
        <font color="#FF0000">${totalInche}</font></th>
        </tr>          
        `;

        leaksPotableWater =
        `${leaksPotableWater}
            <tr>
              <td class="text-center align-middle" rowspan="18" style="width:4%!important; font-size: 5pt; padding:0px;">Agua <br> Potable</td>
            </tr>      
          `;
  
        fugasaguaspotablediametrosscmxcamp.forEach(element => {
          leaksPotableWater = 
          `${leaksPotableWater}       
           
          <tr>  
                    <td class="BGCOLOR=#E8E7ED" style="width:9%!important; font-size: 5pt; padding:0px;">
                    ${element.name}</td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:1px;">
                    <font color="#0105FF">${element.a}</font>
                    </td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.b}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.c}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.d}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.e}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.f}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.g}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.h}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.i}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.j}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.k}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.l}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.m}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.n}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.ñ}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.o}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.p}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.q}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.r}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.s}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.t}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.u}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.v}</font></td>
                    <td class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    <font color="#0105FF">${element.w}</font></td>
                    <th class="text-center" style="width:3%!important; font-size: 5pt; padding:0px;">
                    ${element.Total}</th>
                    </tr>    
                `;              
        });

        leaksPotableWater = 
    `${leaksPotableWater} 
    <tr>
        <th class="text-center" style="background-color:#E8E7ED!important; width:5%!important; font-size: 5pt;!important; padding:1px;">
        SUBTOTAL</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${a2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${b2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${c2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${d2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${e2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${f2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${g2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${h2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${i2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${j2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${k2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${l2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${m2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${n2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${ñ2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${o2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${p2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${q2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${r2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${s2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${t2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${u2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${v2}</th>
        <th class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px;">
        ${w2}</th>  
        <th class="text-center" style="width:5%!important; font-size: 5pt!important; padding:0px!important;">
        <font color="#FF0000">${totalCamp}</font></th>
        </tr> 
        </table>         
        `;

        
        leaksPotableWater = `
        ${leaksPotableWater}
          
        <table  class="table table-bordered"  style="table-layout:fixed;">
          <tr>
            <td class="text-center" style="width:15%!important; font-size: 5pt;!important; padding:2px; font-weight: bolder;">TOTAL</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${a1+a2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${b1+b2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${c1+c2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${d1+d2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${e1+e2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${f1+f2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${g1+g2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${h1+h2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${i1+i2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${j1+j2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${k1+k2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${l1+l2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${m1+m2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${n1+n2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${ñ1+ñ2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${o1+o2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${p1+p2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${q1+q2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${r1+r2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${s1+s2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${t1+t2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${u1+u2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${v1+v2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${w1+w2}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            <font color="#FF0000">${totalInche+totalCamp}</font></td>
          </tr>
          
          <tr>
            <td class="text-center" style="width:15%!important; font-size: 5pt;!important; padding:2px; font-weight: bolder;">
            %</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((a1+a2) * 100 / (Number(totalInche + totalCamp))))?(((a1+a2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((b1+b2) * 100 / (Number(totalInche + totalCamp))))?(((b1+b2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((c1+c2) * 100 / (Number(totalInche + totalCamp))))?(((c1+c2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((d1+d2) * 100 / (Number(totalInche + totalCamp))))?(((d1+d2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((e1+e2) * 100 / (Number(totalInche + totalCamp))))?(((e1+e2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((f1+f2) * 100 / (Number(totalInche + totalCamp))))?(((f1+f2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((g1+g2) * 100 / (Number(totalInche + totalCamp))))?(((g1+g2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((h1+h2) * 100 / (Number(totalInche + totalCamp))))?(((h1+h2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((i1+i2) * 100 / (Number(totalInche + totalCamp))))?(((i1+i2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((j1+j2) * 100 / (Number(totalInche + totalCamp))))?(((j1+j2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((k1+k2) * 100 / (Number(totalInche + totalCamp))))? (((k1+k2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((l1+l2) * 100 / (Number(totalInche + totalCamp))))?(((l1+l2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((m1+m2) * 100 / (Number(totalInche + totalCamp))))? (((m1+m2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((n1+n2) * 100 / (Number(totalInche + totalCamp))))? (((n1+n2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((ñ1+ñ2) * 100 / (Number(totalInche + totalCamp))))?(((ñ1+ñ2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((o1+o2) * 100 / (Number(totalInche + totalCamp))))?(((o1+o2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((p1+p2) * 100 / (Number(totalInche + totalCamp))))? (((p1+p2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((q1+q2) * 100 / (Number(totalInche + totalCamp))))? (((q1+q2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((r1+r2) * 100 / (Number(totalInche + totalCamp))))? (((r1+r2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((s1+s2) * 100 / (Number(totalInche + totalCamp))))?(((s1+s2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((t1+t2) * 100 / (Number(totalInche + totalCamp))))? (((t1+t2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((u1+u2) * 100 / (Number(totalInche + totalCamp))))?(((u1+u2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)) :0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((v1+v2) * 100 / (Number(totalInche + totalCamp))))? (((v1+v2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            ${(((w1+w2) * 100 / (Number(totalInche + totalCamp))))? (((w1+w2) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</td>
            <td class="text-center" style="width:3%!important; font-size: 5pt!important; padding:0px; font-weight: bolder;">
            <font color="#FF0000">${(((totalInche+totalCamp) * 100 / (Number(totalInche + totalCamp))))?(((totalInche+totalCamp) * 100 / (Number(totalInche + totalCamp))).toFixed(2)):0}</font></td>
          </tr>

          `
      
    
        
        

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
