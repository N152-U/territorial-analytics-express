const html = `<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>relacionfaltasaguapendientes</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <style>
        table {
            border-collapse: collapse;
            border: none;
            width: 95%;
            padding:0px!important;
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
                    <table style="padding: 0px 0px 0px 20px;  margin-top: -5px">
                        <tr>
                            <td colspan="6"
                                style="font-size: 10pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                RELACION DE REPORTES PENDIENTES
                            </td>
                        </tr>
                        <tr>
                        <td colspan="4"
                            style="font-size: 6pt; background-color: #ffffff; text-align:left;">
                            FECHA GENERACIÓN:{{today}}</td>
                        <td colspan="2"
                            style="font-size: 6pt; background-color: #ffffff; text-align:right;">
                            PERIODO: {{startDate}} A {{finalDate}}</td>
                    </tr>
                    </table>
                    <br />
                    <div id="container">
                      
                            {{incidents}}
                      
                        <br>
                    </div>
                    <table  style="padding:0px;">
                        <tr>
                            <th colspan="3"
                                style=" font-size: 8pt;  background-color: #D9D9D9; text-align:center; font-weight: bold; ">
                                TOTAL</th>
                            <th
                                style=" font-size: 8pt;  text-align:center; background-color: #D9D9D9; font-weight: bold;">
                                {{grand_total}}</th>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>


</body>

</html>`

module.exports = { html }
