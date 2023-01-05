module.exports = {
  encharcamientosxalcaldiaxtipofallafuncion: (startDate, finalDate, today, encharcamientosxalcaldiaxtipofalla, tmpl, logoCDMXB64, logoCiudadInnovadoraB64) => {
    let html, floodings = '', headMunicipality = '', headColumns = '';
    let grand_total = 0, register = 0;
    if (encharcamientosxalcaldiaxtipofalla != '') {

      encharcamientosxalcaldiaxtipofalla.forEach(flooding => {
        headMunicipality = `<table style="width:95%;" align="center" >
        <tbody>
          <tr>
              <td colspan="4" style="font-size: 10pt; background-color: #D9D9D9!important; text-align:center; font-weight: bold; ">${flooding.municipality}</td>
          </tr>`
        headColumns = ` <tr>
          <td colspan="4" style=""></td>
      </tr>
      <tr>
          <th colspan="2" style="background-color: #D9D9D9!important; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);width: 50%;">CAUSA</th>
          <th colspan="2" style="background-color: #D9D9D9!important; font-size: 8pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);width: 50%;">TOTAL DE PREDIOS</th>
      </tr>`;
        floodings = `
        ${floodings}
        ${headMunicipality}`;
        register++;

        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
        </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
    `}

        floodings = ` ${floodings}
      ${headColumns}`;
        register++;

        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
        </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}

        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [A] Coladera Obstruida
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.a}
              </td>
          </tr> 
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}

        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [B] Atarjea Obstruida
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.b}
              </td>
          </tr> 
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [C] Insuficiencia de Atarjea y Colector
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.c}
              </td>
          </tr> 
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [D] Insuficiencia de Grieta
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.d}
             
              </td>
          </tr>
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [E] Hundimiento de la Carpeta Asfáltica
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.e}
             
              </td>
          </tr>
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [F] Falta de Infraestructura
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.f}
              
              </td>
          </tr>
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [G] Inexistente al Momento de la Inspección [No se Aprecian Dimensiones]
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.g}
              
              </td>
          </tr> 
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%; ">
              [H] En Revisión
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%;  ">
              ${flooding.h}
             
              </td>
          </tr> 
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%; ">
              [I] No se Operó Cárcamo de Bombeo
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%;  ">
              ${flooding.i}
             
              </td>
          </tr>
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%; ">
              [J] Ruptura de Tubo de Agua Potable
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%;  ">
              ${flooding.j}
             
              </td>
          </tr>
        `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
          </tbody>
          </table>
        <div style="page-break-after:always;"></div>
        ${headMunicipality}
        ${headColumns}
    `}
        floodings = `
        ${floodings}
          <tr>
              <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%;">
              [K] Bajada de Aguas Broncas
              </td>
              <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%; ">
              ${flooding.k}
             
              </td>
          </tr> `;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
            </tbody>
            </table>
          <div style="page-break-after:always;"></div>
          ${headMunicipality}
          ${headColumns}
      `}
        floodings = `${floodings}
          <tr>
          <td  colspan="2" style="font-size: 7pt; line-height: 1.2; border: 1px solid rgb(2, 0, 0); font-weight: bold;width: 50%; ">
          Subtotal
          </td>
          <td  colspan="2" style="font-size: 7pt; text-align:center; line-height: 1.2; border: 1px solid rgb(2, 0, 0);width: 50%;  ">
          ${flooding.subtotal}
          </td>
        </tr>
        <tr>
            <td colspan="4" style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold; color:rgba(255, 0, 0, 0);">Espacio</td>
        </tr>
     </tbody>
    </table>`;
        register++;
        if (register % 26 == 0) {
          register += 2;
          floodings = ` ${floodings}
    <div style="page-break-after:always;"></div>
`}
        grand_total += flooding.subtotal;
      });
      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{incidents}}", floodings)
        .replace("{{grand_total}}", grand_total)
    } else {

      html = tmpl
        .replace("{{logoCDMX}}", logoCDMXB64)
        .replace("{{logoCiudadInnovadora}}", logoCiudadInnovadoraB64)
        .replace("{{startDate}}", startDate)
        .replace("{{finalDate}}", finalDate)
        .replace("{{today}}", today)
        .replace("{{incidents}}", '')
        .replace("{{grand_total}}", 0)
    }
    return html;

  },
};
