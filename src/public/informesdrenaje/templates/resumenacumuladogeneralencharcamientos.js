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
                    <table style="padding: 0px 0px 0px 20px; margin-top: -10px">
                        <tr>
                            <td colspan="6"
                                style="font-size: 12pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                RESUMEN ACUMULADO GENERAL DE ENCHARCAMIENTOS
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4"
                                style="font-size: 7pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                CORRESPONDIENTES AL PERIODO: <u> {{startDate}} A {{finalDate}} </u></td>
                            <td colspan="2"
                                style="font-size: 7pt; background-color: #ffffff; text-align:right; font-weight: bold;">
                                FECHA GENERACI&Oacute;N: <u>{{today}} </u></td>
                        </tr>
                    </table>
                    <br />
                    <table align="center" style="width: 70%;">
                    <thead>
                        <tr>
                            <th style="background-color: #BED1D4; font-size: 10pt; font-weight: bold; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
                                colspan="5">
                                Resumen Por Alcaldía
                            </th>
                        </tr>
                        <tr>
                            <th
                                style="background-color: #E5E8EA; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                Alcaldias</th>
                            <th
                                style="background-color: #E5E8EA; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                Captados</th>
                            <th
                                style="background-color: #E5E8EA; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                En proceso</th>
                            <th
                                style="background-color: #E5E8EA; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                Solucionados</th>
                            <th
                                style="background-color: #E5E8EA; font-size: 7pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                Tiempo Estimado (minutos)</th>
                        </tr>
                        </thead>
            
                        <tbody>
                           {{dataConsolidation}}
                            <tr>
                                {{footer_resume_metrics}}
                            </tr>
                        </tbody>
                </table>
                <br>
                <table align="center" style="width: 70%;">
                    <thead>
                        <tr>
                            <th style="background-color: #BED1D4; font-size: 10pt; font-weight: bold; text-align:center; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"
                                colspan="12">Resumen Por Causas</th>
                        </tr>
                        <tr>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                Alcaldias</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [A]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [B]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [C]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [D]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [E]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [F]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [G]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [H]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [I]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [J]</th>
                                <th
                                style="background-color: #E5E8EA; font-size: 6pt; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">
                                [K]</th>
                                
                            
                        </tr>
                        </thead>
                        <tbody>
                            {{resume_reasons}}
                        </tbody>
                
                </table>
             <br>
             <table align="center" style="width: 66.5%!important;">
                    <thead>
                        <tr>
                               {{reasons_desc}}
                        </tr>
                    </thead>
                </table>
                
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>`
module.exports = { html }