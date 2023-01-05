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
        .header {
            width:5% !important;
            max-width: 5% !important;
            font-size: 6pt !important;
            background-color: #E8E7ED !important;
        }
        .detail{
            width:10% !important;
            max-width: 10% !important;
            font-size: 5pt !important;
            margin: 0px !important;
            background-color: #E8E7ED !important;
        }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>

<body>
    <div id="pageHeader" style="padding: 0px; margin:0px;">
    <img style="width: 80%; height:50px;display: block;
    margin-left: auto;
    margin-right: auto;" src="{{logoCDMX}}" />
    </div>
    <div id="pageFooter" style="padding-bottom: 100px;">
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
                    <table style="padding: 0px 0px 0px 20px; margin-top: -20px">
                        <tr>
                            <td colspan="12"
                                style="font-size: 8pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                <strong>
                                <br>
                                <p>FUGAS REPARADAS POR DIAMETRO DE TUBERIA 
                                <br>[POR CAMPAMENTOS DEL SACMEX Y ALCALDÍAS]
                                </p>
                                </strong>
                               
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4"
                            style="font-size: 5.5pt; background-color: #ffffff; text-align:left; font-weight: bold;">
                            FECHA GENERACI&Oacute;N: <u>{{today}} </u></td>
                            <td colspan="2"
                            style="font-size: 5.5pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                            PERIODO: <u> {{startDate}} A {{finalDate}} </u></td> 
                        </tr>
                    </table>
                    <table>
                    {{leaksPotableWater}}
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html> `

module.exports = { html };