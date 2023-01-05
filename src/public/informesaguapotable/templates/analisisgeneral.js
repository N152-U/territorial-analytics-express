const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nombreinforme</title>
    <style>
        table {
            border-collapse: collapse;
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
            width:5% !important;
            max-width: 5% !important;
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
                    <table style="padding: 0px 0px 0px 20px; margin-top: -5px">
                        <tr>
                            <td colspan="12"
                                style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                <strong>
                                    <p>ANALISIS GENERAL DE QUEJAS EN EL SISTEMA HIDRAULICO </p>
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4"
                                style="font-size: 6.5pt; background-color: #ffffff; text-align:left; font-weight: bold;">
                                FECHA GENERACIÓN:{{today}}</td>
                            <td colspan="2"
                                style="font-size: 6.5pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                PERIODO: {{startDate}} A {{finalDate}}</td>
                        </tr>
                    </table>
                    <br />
                    <table  class="table table-bordered"  style="table-layout:fixed;">
                    <thead>
                    <tr style="padding:0px;">
                            <th class="text-center align-middle" rowspan="2" colspan="1"   style="width:8%; max-width: 8%; font-size: 6pt;"padding:0px!important;>TIPO DE QUEJA</th>
                            <th class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">1</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">2</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">3</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">4</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">5</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">6=1-3-4-5</th>
                            <th class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">7</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">8[+2]</th>
                            <th  class="text-center header" style="background-color:#E8E7ED!important; width:5%;font-size: 6pt;padding:0px!important;">9=7/7+8</th>
                        </tr>
                        <tr style="padding:0px;">

                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPORTES RECIBIDOS EN LA UD DE SEGUIMIENTO </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPORTES SIN RECIBIR EN CAMPAMENTOS Y ALCALDÍAS </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPORTES INEXISTENTES </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPORTES MALA UBICACIÓN </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPORTES DUPLICADOS </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPORTES NETOS </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">REPARADOS </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">EN PROCESO DE REPARACIÓN </th>
                            <th  class="text-center align-middle detail" style="background-color:#E8E7ED!important; width:5%;padding:0px!important;">% EFICIENCIA </th>
                           
                        </tr>
                        </thead>
            
                    </table>
                    {{potableWaterHeader}}
                    {{potableWaterData}}
                    {{drainageHeader}}
                    {{drainageData}}
                    {{treatedWaterHeader}}
                    {{treatedWaterData}}
                    {{grand_total}}
                    
                </td>
            </tr>
        </tbody>
    </table>
    <br>
   <span style="font-size:7pt>"> (*)Las fugas en la Red Vial Secundaria se turnan a las Alcaldías (A partir del 5 de Junio de 2011)</span> 

</body>

</html>`

module.exports = { html };
