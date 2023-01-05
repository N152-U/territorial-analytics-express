const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nombreinforme</title>
    <style>
         table {
            border-collapse:collapse;
            border: none;
            width: 100%;
        }
    </style>
</head>

<body>
    <div id="pageHeader" style="padding: 0px; margin:0px;">
        <img style="width: 80%; height:50px;display: block;
        margin-left: auto;
        margin-right: auto;" src="{{logoCDMX}}" />
    </div>
    <div id="pageFooter" style="padding-top: 5px">
        <img style="width: 170px" src="{{logoCiudadInnovadora}}" />
        <p style="
            color: rgb(77, 75, 75);
            margin: 0;
            margin: -35px 35px 0px 0px;
            text-align: right;
            font-family: sans-serif;
            font-size: 7pt;
          ">
            Página {{page}} de {{pages}}
        </p>
    </div>
    <table style="width:95%;" align="center">
    <thead></thead>
        <tbody>
            <tr>
                <td>
                    <table style=" margin-top: -10px;width:95%;" align="center">
                        <tr>
                            <td colspan="12"
                                style="font-size: 12pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                POR ALCALDIA Y TIPO DE FALLA
                            </td>
                        </tr>
                        <tr>
                            <td colspan="8"
                                style="font-size: 7pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                CORRESPONDIENTES AL PERIODO: <u> {{startDate}} A {{finalDate}} </u></td>
                            <td colspan="4"
                                style="font-size: 7pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                FECHA GENERACI&Oacute;N: <u>{{today}} </u></td>
                        </tr>
                    </table>
                    <br />
                   {{incidents}}
                    <table style="width:95%;" align="center">
                    <tr>
                    <th colspan="2" style=" font-size: 9pt;  background-color: #D9D9D9!important; text-align:center; " >Gran Total</th>
                    <th colspan="2" style=" font-size: 9pt;  background-color: #D9D9D9!important;" >{{grand_total}}</th>
                    </tr>
                </table>
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>`

module.exports = {html}