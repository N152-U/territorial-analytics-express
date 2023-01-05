const html = `<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>cortesfaltasagua</title>
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
        <table style="width:95%; margin-right:7px;" align="center">
        <thead></thead>
        <tbody>
            <tr>
                <td>
                    <table style="margin-top: -5px">
                        <tr>
                            <td colspan="6"
                                style="font-size: 11pt; background-color: #ffffff; text-align:center; font-weight: bold;">
                                FALTAS DE AGUA POTABLE POR ALCALD&Iacute;A
                            </td>
                        </tr>
                        <tr>
                        <td colspan="6" style="font-size: 7pt; background-color: #ffffff; text-align:center!important; font-weight: bold;">CORRESPONDIENTES AL PERIODO: <u> {{startDate}} A {{finalDate}} </u></td>
                    </tr>
                    </table>
                    <br />
                        <table>
                        {{incidents}}
                        </table>
                        <br>
                </td>
            </tr>
            <tr>
            <td colspan="" style="font-size: 7pt;margin-left:100px; background-color: #ffffff; text-align:right; font-weight: bold;">FECHA GENERACI&Oacute;N: {{today}}</td>
         </tr>
        </tbody>
    </table>


</body>

</html>`

module.exports = { html }
