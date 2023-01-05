const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>nombreinforme</title>
    <style>
         table {
            border-collapse:collapse;
            border: none;
            width: 100%;
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
    <table style="width:90%;" align="center">
        <thead></thead>
        <tbody>
            <tr>
                <td>
                    <table style="padding: 0px 0px 0px 20px; margin-top: -3px">
                        <tr>
                        <td  style="width:20%;"></td>
                        
                            <td colspan="5"
                                style="font-size: 9pt; background-color: #ffffff; text-align:center; font-weight: bold; border: 2px solid rgb(0, 0, 0);">
                                REPORTES EN PROCESO DE REPARACIÓN (PENDIENTES) POR ALCALDIAS Y NÚMERO <br>DE DÍAS DE ATRASO
                            </td> 
                            <td  style="width:25%;"></td> 
                             
                                                 
                                                
                        </tr>
                        <tr>
                            <td colspan="4"
                                style="font-size: 5pt; background-color: #ffffff; text-align:left; font-weight: bold;">
                                FECHA GENERACI&Oacute;N: <u>{{today}} </u></td>                                
                            <td colspan="3"
                                style="font-size: 5pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                CORRESPONDIENTES AL PERIODO: <u> {{startDate}} A {{finalDate}} </u></td>
                        </tr>
                    </table>
                    <br />
                    <table>
                    {{reportsMunicipality}}
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`

module.exports = {html}