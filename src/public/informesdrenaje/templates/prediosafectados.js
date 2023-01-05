const html = `<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>relacionfaltasaguapendientes</title>
    <script src="{{asset('js/jquery.min.js')}}"></script>
    <script src="{{asset('js/bootstrap.min.js')}}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <style>
        table {
            border-collapse: collapse;
            border: none;
            width: 95%;
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
                                style="font-size: 11pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                Informe Predios Afectados

                            </td>
                        </tr>
                    <tr>
                    <td colspan="4" style="font-size: 7pt; background-color: #ffffff; text-align:right; font-weight: bold;">CORRESPONDIENTES AL PERIODO: <u> {{startDate}} A {{finalDate}} </u></td>
                    <td colspan="2" style="font-size: 7pt; background-color: #ffffff; text-align:right; font-weight: bold;">FECHA GENERACI&Oacute;N: <u>{{today}} </u></td>
                </tr>
                    </table>
                    <br />
                    <div id="container">
                        
                            {{incidents}}
                       
                        <br>
                        <table align="center">
                            <tr >
                                <th colspan="3" style=" font-size: 9pt;  background-color: #C7768C; text-align:center; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0) " >TOTAL</th>
                                <th style=" font-size: 9pt;  text-align:center; background-color: #C7768C; font-weight: bold; line-height: 1.2; border: 1px solid rgb(0, 0, 0)"  > {{grand_total}}</th>
                            </tr>
                        </table>
                        <br>
                        <div style="page-break-after: always"></div>
                        <table  style="width: 95%;" align="center">
                            <tr>
                                <td style="width:50%; font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(A) Coladera Obstruida</td>
                                <td style="width:50%; font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(G) Inexistente al Momento de la Inspección (No se aprecian dimensiones)</td>
                            </tr>
                            <tr>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(B) Atarjea Obstruida
                                </td>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(H) En Revisión
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(C) Insuficiencia de Atarjea y Colector
                                </td>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(I) No se Operó Cárcamo de Bombeo
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(D) Insuficiencia de Grieta
                                </td>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(J) Ruptura de Tubo de Agua Potable
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(E) Hundimiento de la Carpeta Asfáltica
                                </td>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(K) Bajada de Aguas Broncas
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);">(F) Falta de Infraestructura
                                </td>
                                <td style="font-size: 8pt; line-height: 1.2; border: 1px solid rgb(0, 0, 0);"></td>
                            </tr>
                           </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>


</body>

</html>`

module.exports = {html};