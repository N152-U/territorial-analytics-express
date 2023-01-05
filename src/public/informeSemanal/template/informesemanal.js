const html = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0,
    width=device-width" />
    <meta charset="utf-8" />
    <title>Informe Semanal</title>
    <style>
     
      #table-ranking {
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        border-collapse: collapse;
        width: 50%;
      }

      #table-ranking td,
      #table-ranking th {
        border: 1px solid #ddd;
        padding: 8px;
        color: #5d6569;
        text-align: center;
      }

      #table-ranking tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      #table-ranking tr:hover {
        background-color: #ddd;
      }

      #table-ranking th {
        padding-top: 0px;
        padding-bottom: 0px;
        text-align: center;
        background-color: #1bb600;
        color: white;
      }

      #table_recurrence {
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        border-collapse: collapse;
        width: 720px;
      }

      #table_recurrence td,
      #table_recurrence th {
        border: 1px solid #ddd;
        padding: 8px;
        color: #5d6569;
        text-align: center;
      }

      #table_recurrence tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      #table_recurrence tr:hover {
        background-color: #ddd;
      }

      #table_recurrence th {
        padding-top: 0px;
        padding-bottom: 0px;
        text-align: center;
        background-color: #1bb600;
        color: white;
      }
      .circle_gray {
        width: 10px;
        height: 10px;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        background: #adadad;
        margin-left: 5px;
      }

      .circle_yellow {
        width: 10px;
        height: 10px;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        background: #e3f11b;
        margin-left: 5px;
      }

      .circle_red {
        width: 10px;
        height: 10px;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        background: #db1b1b;
        margin-left: 5px;
      }
    </style>
  </head>
  <body>
    <div id="pageHeader" style="padding-bottom: 5px">
      <img style="width: 730px; margin-left: 20px" src="{{logoCDMX}}" />
    </div>
    <div id="pageFooter" style="padding-top: 5px">
      <img style="width: 170px" src="{{logoCiudadInnovadora}}" />
      <p
        style="
          color: rgb(77, 75, 75);
          margin: 0;
          margin: -35px 35px 0px 0px;
          text-align: right;
          font-family: sans-serif;
          font-size: 7pt;
        "
      >
        Página {{page}} de {{pages}}
      </p>
    </div>
    <table>
      <thead></thead>
      <tbody>
        <tr>
          <td>
            <table style="padding: 0px 0px 0px 20px; margin-top: -20px">
              <tr>
                <td style="font-size: 20px">
                  <strong
                    >Informe semanal sem&aacute;foro (recurrencia o
                    medi&aacute;tico)</strong
                  >
                </td>
              </tr>
              <tr>
                <td id="date" style="color: red; font-size: 13px">{{date}}</td>
              </tr>
              <tr>
              <!-- Contenedor para página principal -->
              <td>
                <div>
                  <table style="padding-top: 20px">
                    <tr>
                      <td style="width: 150px; font-size: 10pt; height: 250px">
                        <div style="margin-top: -120px; padding-right: 10px">
                          <div>Total de la semana</div>
                          <div
                            style="font-size: 40px; color: grey"
                            id="incidentsCountWeek"
                          >
                            <strong>{{incidentsCountWeek}}</strong>
                          </div>
                          <div>Incidentes</div>
                        </div>
                      </td>
                      <td>
                        <div style="margin-top: -130px">
                          <img
                            style="padding: 0px; width: 300px; height: 300px"
                            src="{{chartMunicipalities}}"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="margin-top: -230px">
                          <img
                            style="width: 350px; height: 250px; padding: 0px"
                            src="{{chartCodification}}"
                          />
                        </div>
                        <div style="font-size: 10px; margin-top: -100px">
                          <div>Con m&aacute;s incidentes:</div>
                          <div
                            style="padding-right: 30px; padding-left: 30px"
                          >
                            <div style="margin-left: -30px; overflow-x: auto">
                              <table id="table-ranking">
                                <thead id="container_settlements">
                                  {{container_settlements}}
                                </thead>
                                <tbody id="ranking_settlements">
                                  {{ranking_settlements}}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <!-- Tabla incidentes recurrentes -->
            <tr>
              <td>
                <div style="margin-top: -116px">
                  <table>
                    <tr>
                      <td style="font-size: 15px">
                        <strong>Informe de recurrencia semanal</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px">
                        <p>
                          En esta secci&oacute;n se muestra unicamente los
                          incidentes que fueron recurrentes por dos o
                          m&aacute;s d&iacute;as durante la semana.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 8.4px">
                        <div style="overflow-x: auto">
                          <table id="table_recurrence" >
                        
                            <thead id="container_recurrencia_incidentes">
                              {{container_recurrencia_incidentes}}
                            </thead>
                           
                           
                          </table>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
          <br />
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`

module.exports = { html };