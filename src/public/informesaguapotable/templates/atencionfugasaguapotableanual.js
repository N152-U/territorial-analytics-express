const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
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
  <div id="pageFooter" style="padding-top: 100px">
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
                    <table style="padding: 0px 0px 0px 20px; margin-top: -8px">
                        <tr>
                            <td colspan="6"
                                style="font-size: 13pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                Atención De Fugas De Agua Potable, Año [Por Alcaldía]
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4"
                                style="font-size: 6.5pt; background-color: #ffffff; text-align:left; font-weight: bold;">
                                CORRESPONDIENTES AL PERIODO: <u> {{startDate}} A {{finalDate}} </u></td>
                            <td colspan="2"
                                style="font-size: 6.5pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                FECHA GENERACI&Oacute;N: <u>{{today}} </u></td>
                        </tr>
                    </table>
                    <br>
                    <table>
                    {{incidents}} 
                    </table>
                        <table class="table table-bordered" style="width:95%;" align="center">
                        <tr>
                            <th colspan="3" style=" font-size: 9pt;  background-color: #D9D9D9 !important; text-align:center; font-weight: bold; padding:5px!important;">      
                            TOTAL</th>
                            <th  style=" font-size: 9pt;  text-align:center; background-color: #D9D9D9 !important; font-weight: bold; padding:5px!important;">
                            {{grand_total}}</th>
                            </tr>
                     </table>
                 </td>
             </tr>
        </tbody>
    </table>    
</body>

</html> `
module.exports = { html };