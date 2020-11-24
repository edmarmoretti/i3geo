<?php header("Content-type: text/css"); ?>/*
para nao selecionar
*/
* {
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: -moz-none;
-o-user-select: none;
user-select: none;
}
.bd input, .bd textarea, #escala input, .copyToMemory {
-webkit-user-select: text;
-khtml-user-select: text;
-moz-user-select: text;
-o-user-select: text;
user-select: text;
}
#i3GEOlogoMarca {
display: block;
top: 4em;
zIndex: 5000;
}
#i3GEOlogoMarca > table {
width: 100%;
}
.i3GEOlogoMarca {
font-size:14pt;
padding:5px;
font-family: Verdana, Arial, Helvetica, sans-serif;
background-color: white;
}
#i3GEOlogoMarca > img {
width:inherit;
padding:5px;
}
/*
Banner inicial
*/
#i3GEOlogoMarca {
width:95%;
max-width:600px;
text-align:center;
margin: auto auto;
box-shadow: 0 1px 13px gray;
border-radius: 5px;
}
/*
Para nao marcar links
*/
a:active {
outline: none;
}
/*
Popup do identifica no openlayers 3
*/
.ol-popup {
position: absolute;
background-color: white;
-webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
padding: 8px;
border-radius: 10px;
border: 1px solid #cccccc;
bottom: 12px;
left: -50px;
z-Index: 2;
}
.ol-popup:after, .ol-popup:before {
top: 100%;
border: solid transparent;
content: " ";
height: 0;
width: 0;
position: absolute;
pointer-events: none;
}
.ol-popup:after {
border-top-color: white;
border-width: 10px;
left: 48px;
margin-left: -10px;
}
.ol-popup:before {
border-top-color: #cccccc;
border-width: 11px;
left: 48px;
margin-left: -11px;
}
.ol-popup-closer {
text-decoration: none;
position: absolute;
top: 2px;
right: 1px;
cursor:pointer;
}
.ol-popup-closer:after {
content: "\2716";
color: red;
font-size: 16px;
}
/*
Ajusta altura dos controles do googlemaps
*/
div.gmnoprint {
padding-top: 10px;
}
/*
Utilizado na janela do buscador INDE
*/
.meta-param, .meta-value{
text-align: left;
font-size: 12px;
padding: 5px;
}
.mensagemAjuda {
width:95%;
padding:2;
vertical-align:top;
}
.mensagemAjuda th {
font-family:Verdana, Arial, Helvetica, sans-serif;
font-size: 8pt;
border: 1px solid #B1CDEB;
text-align: left;
padding-left: 7px;
padding-right: 11px;
}
.botoesLegendaFlutuante {
font-size: 10px;
}
.i3GEOconteudoLegendaClass{
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.olPopupCloseBox {
margin-top: -2px;
}
.i3GEOarvCat input[type=radio], .i3GEOarvCat input[type=checkbox] {
display: none;
}
/*
.i3GEOarvCat input[type=checkbox]+label:before {
color: white;
content: "";
content: url("../imagens/checkbox-unchecked.png");
line-height: 15px;
text-align: center;
top: -1px;
position: absolute;
left: -25px;
cursor : pointer;
}
.i3GEOarvCat input[type=checkbox]:checked+label:before {
color: white;
content: "";
content: url("../imagens/checkbox-checked.png");
line-height: 15px;
text-align: center;
top: -1px;
position: absolute;
left: -25px;
cursor : pointer;
}
*/
.i3GEOarvCat label {
left:12px;
}
.i3GEOarvCam .ygtvitem {
text-align: left;
margin-top: 3px;
margin-bottom: 10px;
}
.i3GEOarvCam input[type=radio], .i3GEOarvCam input[type=checkbox] {
display: none;
}
/*
.i3GEOarvCam input[type=checkbox]+label:before {
color: white;
content: "";
content: url("../imagens/gisicons/hide.png");
line-height: 15px;
text-align: center;
top: -1px;
position: absolute;
left: 1px;
cursor : pointer;
}
.i3GEOarvCam input[type=checkbox]:checked+label:before {
color: white;
content: "";
content: url("../imagens/gisicons/show.png");
line-height: 15px;
text-align: center;
top: -1px;
position: absolute;
left: 1px;
cursor : pointer;
}
.i3GEOarvCam label {
margin-left: 0px;
cursor: move;
}
*/
.i3GEOarvCamGrupo {
font-size: 12pt;
margin: auto;
text-align: left;
cursor: pointer;
top: -1px;
font-weight : bold;
}
.i3GEOarvCamTema {
font-size: 12pt;
margin: auto;
text-align: left;
cursor: pointer;
top: -2px;
font-weight : bold;
}
.i3GEOarvCamTemaIE {
text-align: left;
font-size: 12pt;
vertical-align: middle;
display: table-cell;
font-weight : bold;
}
.i3GEOarvCam .ygtvdepthcell {
background : none;
display: none;
}
.i3GEOarvCamTema input, .i3GEOarvCamTemaIE input {
cursor: pointer;
}
.i3GEOarvCamTema span, .i3GEOarvCamTemaIE span {
vertical-align: top;
cursor: move;
}
.i3GEOarvCamTema img, .i3GEOarvCamTemaIE img {
width: 15px;
height: 15px;
background-size: 15px;
position: relative;
top: 1px;
margin-left: 2px;
}
.i3GEOarvCamTemaIco img, .i3GEOarvCamTemaIcoIE img {
width: 15px;
height: 15px;
background-size: 15px;
position: relative;
top: -1px;
margin-left: 3px;
}
.i3GEOarvCamTemaIco .arvCamFarol, .i3GEOarvCamTemaIcoIE .Farol {
width: 11px;
height: 11px;
}
/*
.i3GEOarvCamTemaIco .arvCamFerramentas, .i3GEOarvCamTemaIcoIE .Ferramentas {
background-image: url("../imagens/oxygen/16x16/configure-shortcuts.png");
}
.i3GEOarvCamTemaIco .arvCamDownload, .i3GEOarvCamTemaIcoIE .Download {
background-image: url("../imagens/oxygen/16x16/download.png");
}
.i3GEOarvCamTemaIco .arvCamOgc, .i3GEOarvCamTemaIcoIE .Ogc {
background-image: url("../imagens/oxygen/16x16/application-x-smb-workgroup.png");
}
.i3GEOarvCamTemaIco .arvCamFonte, .i3GEOarvCamTemaIcoIE .Fonte {
background-image: url("../imagens/oxygen/16x16/help-about.png");
}
.i3GEOarvCamTemaIco .arvCamSelecionado, .i3GEOarvCamTemaIcoIE .Selecionado {
background-image: url("../imagens/gisicons/select-cancel.png");
}
.i3GEOarvCamTemaIco .arvCamZoomSelecionado, .i3GEOarvCamTemaIE .ZoomSelecionado {
background-image: url("../imagens/gisicons/zoom-selection.png");
}
.i3GEOarvCamTemaIco .arvCamDependeEscala, .i3GEOarvCamTemaIcoIE .DependeEscala {
background-image: url("../imagens/oxygen/16x16/task-attempt.png");
top: 0px;
}
.i3GEOarvCamTemaIco .arvCamRemoveLayer, .i3GEOarvCamTemaIcoIE .RemoveLayer {
background-image: url("../imagens/oxygen/16x16/draw-x.png");
}
.i3GEOarvCamTemaIco .arvCamSobeLayer, .i3GEOarvCamTemaIcoIE .SobeLayer {
background-image: url("../imagens/oxygen/16x16/draw-triangle3.png");
}
.i3GEOarvCamTemaIco .arvCamDesceLayer, .i3GEOarvCamTemaIcoIE .DesceLayer {
background-image: url("../imagens/oxygen/16x16/draw-triangle4.png");
}
.i3GEOarvCamTemaIco .arvCamZoomLayer, .i3GEOarvCamTemaIcoIE .ZoomLayer {
background-image: url("../imagens/gisicons/zoom-layer.png");
}
.i3GEOarvCamTemaIco .pluginParametrossql, .i3GEOarvCamTemaIcoIE .pluginParametrossql {
background-image: url("../imagens/gisicons/settings.png");
}
*/
.i3GEObalaoInfo {
position : absolute;
textAlign : left;
background : white;
-moz-opacity: 0.9;
opacity:.90;
filter: alpha(opacity=90);
filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=90);
-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=90)";
}
.subbloco {
background-color: rgb(248, 248, 248);
width: 90%;
padding: 5px;
margin: 7px;
}
.i3GeoExemploImg{
margin:6px;
cursor:text;
border: 0px solid gray;
box-shadow: 1px 1px 1px 1px #D3D3D3;
border-radius: 5px;
float: left;
width: 40px;
}
.i3GeoMascaraCoord {
width: 100%;
}
.i3GeoMascaraCoord td {
background: white;
color: black;
}
.i3GeoMascaraCoord input {
background: white;
color: black;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 10px;
margin: 0;
border: 0px solid white;
box-shadow: none;
}
.i3GeoMascaraCoord span {
border: 0px solid white;
}
.i3GeoMascaraCoord select {
border: 1px solid #B4B4B4;
font-size: 10px;
height: 16px;
left: 1px;
position: relative;
top: 1px;
width: 40px;
}
.i3GeoMascaraCoord tr {
border: 0px solid white;
}
.toolTipBalaoTexto1 {
text-align: left;
font-size: 8pt;
background-color: #e5e5e5;
color: black;
padding: 3px;
-webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
border-radius: 6px;
}
fieldset {
text-align: left;
padding: 10px;
border: 0px solid gray;
border-radius: 5px 5px 5px 5px;
box-shadow: 0 1px 3px gray;
background: transparent;
margin: 15px;
}
legend {
font-weight: bold;
cursor: pointer;
background: transparent;
color: navy;
text-align: left;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.paragrafo {
font-size: 12px;
line-height: 15px;
margin-bottom: 9px;
text-align: left;
}
.paragrafo input[type=checkbox] {
position: relative;
top: 2px;
border: 0px solid white;
cursor: pointer;
}
.paragrafo input[type=radio] {
position: relative;
top: 3px;
border: 0px solid white;
cursor: pointer;
}
.lista td {
border: 0px solid rgb(240, 240, 240);
border-left: 0px;
border-right: 0px;
border-top: 0px;
padding: 0px;
color: #2F4632;
margin: 0px;
text-align: left;
font-size: 11px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista2 td {
border: 0px solid rgb(240, 240, 240);
border-left: 0px;
border-right: 0px;
border-top: 0px;
padding: 2px;
color: #2F4632;
margin: 0px;
text-align: left;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista2 td input {
border: 1px solid gray;
}
.lista3 td {
border: 0px solid rgb(240, 240, 240);
border-left: 0px;
border-right: 0px;
border-top: 0px;
padding: 1px;
color: #2F4632;
background-color: #F2F2F2;
margin: 0px;
text-align: left;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista4 td {
border: 1px solid rgb(240, 240, 240);
padding: 2px;
color: #2F4632;
margin: 0px;
text-align: left;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista4 td input {
border: 0px solid gray;
}
.lista5 td {
border: 0px solid rgb(240, 240, 240);
border-left: 0px;
border-right: 0px;
border-top: 0px;
padding: 2px;
color: #2F4632;
margin: 0px;
text-align: right;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista5 td input {
border: 1px solid gray;
}
.lista6 td {
border: 0px solid rgb(240, 240, 240);
border-left: 0px;
border-right: 0px;
border-top: 0px;
padding: 1px;
color: #2F4632;
background-color: white;
margin: 0px;
text-align: left;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista7 td {
border: 0px solid rgb(240, 240, 240);
border-left: 0px;
border-right: 0px;
border-top: 0px;
padding: 1px;
color: #2F4632;
background-color: #F2F2F2;
margin: 0px;
text-align: left;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista8 td {
border-top: 1px solid rgb(240, 240, 240);
padding: 2px;
color: #2F4632;
margin: 0px;
text-align: left;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.lista8 td input {
border: 0px solid gray;
}
.geralFerramentas {
position: relative;
background-color: white;
text-align: left;
text-decoration: none;
border-top: 2px solid rgb(230, 230, 230);
font-family: Verdana, Arial, Helvetica, sans-serif;
display: block;
font-size: 12px;
padding: 5px;
font-weight: normal;
top: 8px;
left: 0px;
overflow: auto;
width: 100%;
}
.alerta {
color: red;
font-size: 11px;
}
label {
margin-left: 5px;
margin-right: 2px;
}
caption {
font-size: 8px;
padding-top: 0px;
border-top: 0px solid #FFFFFF;
z-index: 1000;
position: relative;
}
span {
font-family: Verdana, Arial, Helvetica, sans-serif;
}
/*
body {
background-color: black;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 12px;
margin: 0px;
z-index: 1000;
}
*/
A {
text-align: left;
font-size: 11pt;
font-family: Verdana, Arial, Helvetica, sans-serif;
color: #26298D;
outline : none;
}
A:hover {
color: #4142ff;
font-family: Verdana, Arial, Helvetica, sans-serif;
outline : none;
}
img {
border: 0px solid #FFFFFF;
border-width: 0;
}
table {
text-align: center;
border: 0px solid #FFFFFF;
padding: 0px;
margin: 0px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
td {
background-color: white;
border: 0px solid gray;
padding: 0px;
color: #2F4632;
margin: 0px;
text-align: center;
font-size: 10pt !Important;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
H1 {
COLOR: #2F4632;
text-align: left;
text-decoration: none;
font-weight: normal;
font-style: normal;
font-size: 14px;
font-family: Verdana, Arial, Helvetica, sans-serif;
color: #004080;
}
/*
.ajuda_usuario {
background-image: url(../imagens/oxygen/16x16/dialog-information.png);
background-position: 0px 0px;
background-repeat: no-repeat;
margin-left: 0;
text-decoration: none;
cursor: help;
position: relative;
font-size: 14px;
background-size: 14px 14px;
vertical-align: middle;
}
*/
#buscaRapida .ajuda_usuario {
top: 1px;
display: inline-block;
height: 14px;
width: 14px;
left: 2px;
}
/*
.executar {
cursor: pointer;
color: white;
text-align: left;
background-color: gray;
background-image: URL('../imagens/tic.png');
background-repeat: no-repeat;
border-style: outset;
background-position: right;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 10px;
}
*/
.legendatemas {
cursor: pointer;
text-align: left;
background-color: transparent;
vertical-align: top;
border: 0px solid gray;
margin: 0;
padding: 0;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.legendatemas td {
text-align: left;
background-color: #ffffff;
vertical-align: top;
padding: 0;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
position: relative;
}
.legendatemas input {
cursor: pointer;
vertical-align: top;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.legendadiv {
left: 0px;
top: 100px;
overflow: auto;
position: absolute;
float: left;
visibility: hidden;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.filme {
cursor: pointer;
text-align: center;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 8px;
color: #000000;
background: #ebf8e9;
border-style: solid;
border-top-width: 1px;
border-right-width: 0px;
border-bottom-width: 1px;
border-left-width: 0px;
}
.direcao {
cursor: pointer;
font-size: 0px;
text-align: center;
color: #ebf8e9;
background-color: #d5e9c1;
border: 0px solid #d5e9c1;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.pcenter10 {
COLOR: #2F4632;
text-align: center;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
}
.tablefilme {
text-align: center;
border: 0px solid #FFFFFF;
padding: 0px;
margin: 0px;
border-collapse: collapse;
background: #ebf8e9;
cursor: pointer;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
position: relative;
}
.tablefilme td {
background-color: white;
border: 0px solid #FFFFFF;
padding: 0px;
cursor: pointer;
border-collapse: collapse;
margin: 0px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.tdclara {
color: #2F4632;
border: 0px solid #DFDFDF;
padding: 0px;
background-color: #DFDFDF;
margin: 0px;
text-align: center;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
position: relative;
}
.tdbranca {
border-collapse: collapse;
color: #2F4632;
border: 0px solid #DFDFDF;
padding: 0px;
background-color: #FFFFFF;
margin: 0px;
text-align: center;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
position: relative;
}
.tdtxtleft {
color: #2F4632;
border: 0px solid #DFDFDF;
padding: 0px;
background-color: #FFFFFF;
margin: 0px;
text-align: left;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.tdtxtjust {
color: #2F4632;
border: 0px solid #DFDFDF;
padding: 0px;
background-color: #FFFFFF;
margin: 0px;
text-align: justify;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.verdeescuro {
color: orange;
border: 0px solid #6699FF;
padding: 0px;
background-color: #667B67;
margin: 0px;
text-align: left;
font-size: 8px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.verdeclaro {
/*background-image: url(../imagens/i3geo1bw.jpg);*/
padding: 0px;
background-color: #d5e9c1;
margin: 0px;
border: 0px solid #d5e9c1;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
}
.verdemedio {
padding: 0px;
background-color: #d5e9c1;
margin: 0px;
border: 0px solid #d5e9c1;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
position: relative;
}
.aplicar {
visibility: visible;
color: #2F4632;
background: rgb(240, 240, 240);
text-align: center;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 12px;
border-style: outset;
border-width: 2px;
border-color: #cc0000;
cursor: pointer;
z-index: 1000;
}
.digitar {
box-shadow: 1px 1px 3px 0px lightgray;
margin: 0px;
color: #426252;
background-color: white;
height: 17px;
font-size: 12px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.digitar input {
border: 1px solid rgb(180, 180, 180);
}
.digitarOver {
margin: 0px;
color: #426252;
background-color: #F6F6F6;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
box-shadow: 1px 1px 3px 0px #3CA5EB;
}
.digitarMouseclick {
margin: 0px;
color: #426252;
background-color: beige;
border: none;
border-bottom: 1px solid gray;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.digitarMouseover {
margin: 0px;
color: #426252;
background-color: rgb(195, 226, 226);
border: 0px solid #CBCBCB;
font-size: 10px;
font-family: Verdana, Arial, Helvetica, sans-serif;
}
.legendaTema {
font-size: 12px;
text-align: left;
}
#corpoMapa,#corpoMapaL,#corpoMapaO,#corpoMapaN,#corpoMapaS {
position: absolute;
left: 0px;
top: 0px;
z-index: 0;
}
#div_d {
position: absolute;
left: 0px;
top: 0px;
z-index: 0;
}
#executa {
visibility: visible;
color: #2F4632;
background: rgb(240, 240, 240);
text-align: center;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 12px;
border-style: outset;
border-width: 2px;
border-color: #cc0000;
cursor: pointer;
}
#imgh {
z-index: 1000;
}
#ferramentas1 {
display: block;
}
#ferramentas2 {
display: none;
}
#ferramentas3 {
display: none;
}
#ferramentas {
vertical-align: top;
font-family: Verdana, Arial, Helvetica, sans-serif;
text-align: center;
background-color: white;
z-index: 1000;
position: relative;
}
#ferramentas input {
font-size: 10px;
color: #2F4632;
border-style: solid;
border-top-width: 1px;
border-right-width: 2px;
border-bottom-width: 2px;
border-left-width: 1px;
cursor: pointer;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
}
#ferramentas table {
padding: 0px;
border-spacing: 0px;
width: 100%;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
position: relative;
}
#ferramentas table td {
border: 0px solid #ebf8e9;
font-size: 12px;
background-color: white;
font-family: Verdana, Arial, Helvetica, sans-serif;
z-index: 1000;
}
#legenda,#legendai,#corpoLegi,#listaPropriedades {
overflow: auto;
background-color: white;
text-align: left;
}
#listaTemas{
background-color: white;
text-align: left;
overflow: none;
}
#ferr1 {
background-color: rgb(255, 255, 255);
}
#janelaMenu {
opacity: .80;
background-color: #667B67;
position: absolute;
top: 0px;
width: 150px;
height: 200px;
border: 0px solid #667B67;
text-align: center;
z-index: 0;
}
#janelaMenu div {
position: relative;
width: 150px;
z-index: 10;
cursor: pointer;
background-color: orange;
color: white;
}
#areaRealce {
opacity: .20;
background-color: white;
position: absolute;
top: 0px;
width: 50px;
height: 50px;
border: 0px solid #667B67;
z-index: 1000;
}
#tip {
border: 0px solid yellow;
opacity: .90;
}
.clique {
cursor: pointer;
color: blue;
}
.guiaobj {
text-align: left;
text-decoration: none;
border: 0px solid #ffffff;
font-family: Verdana, Arial, Helvetica, sans-serif;
position: relative;
display: block;
font-size: 8px;
padding: 1px 5px;
font-weight: normal;
top: 0px;
width: 95%;
}
#mostradistancia {
z-index: 2600;
color: red;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 10px;
}
div.yui-b p {
margin: 0 0 .5em 0;
color: #999;
}
div.yui-b p strong {
font-weight: bold;
color: #000;
}
div.yui-b p em {
color: #000;
}
h1 {
padding: .25em .5em;
background-color: #ccc;
}
#vertHandleDiv {
cursor: pointer;
width: 20px;
height: 18px;
position: absolute;
left: -1;
top: 0px
}
/*
#vertBGDiv {
position: relative;
top: 0px;
width: 18px;
left: 0px;
background: url(../imagens/zoombar.png) no-repeat;
height: 78px;
}
*/
#googlemapsdiv {
-moz-user-select: -moz-none;
-khtml-user-select: none;
-webkit-user-select: none;
/*
Introduced in IE 10.
See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
*/
-ms-user-select: none;
user-select: none;
}
/* utilizado pela ferramenta de cartogramas */
.var_div_relatorio h1 {
font-size: 16px;
text-align: left;
}
.var_div_relatorio h2 {
font-size: 14px;
text-align: left;
}
.var_div_relatorio p {
font-size: 12px;
line-height: 15px;
margin-bottom: 9px;
text-align: left;
}
.var_div_relatorio i {
font-size: 12px;
line-height: 15px;
margin-bottom: 9px;
text-align: left;
background-color: white;
}
.var_cor1 {
background-color: rgb(250, 250, 250);
width: 95%;
padding: 5px;
}
.var_cor2 {
background-color: rgb(220, 220, 220);
width: 95%;
padding: 5px;
}
/*
#editor_bd p {
margin-top: 15px;
}
#editor_bd input {
background-color: #F6F6F6;
border: 1px solid #FAFAFA;
box-shadow: 0 1px 3px lightgray;
color: #426252;
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 10px;
}
*/
/* usado pelos graficos interativos (CCC2)*/
.tipsy {
pointer-events: none;
padding: 5px;
font-size: 10px;
font-family: Arial, Helvetica, sans-serif;
position: absolute;
z-index: 100000;
}
.tipsy-inner {
padding: 5px 8px 4px 8px;
background-color: black;
color: white;
max-width: 200px;
text-align: center;
}
.tipsy-inner {
border-radius: 3px;
-moz-border-radius: 3px;
-webkit-border-radius: 3px;
}
/* Uncomment for shadow */
/*.tipsy-inner { box-shadow: 0 0 5px #000000; -webkit-box-shadow: 0 0 5px #000000; -moz-box-shadow: 0 0 5px #000000; }*/
.tipsy-arrow {
position: absolute;
width: 0;
height: 0;
line-height: 0;
border: 5px dashed #000;
}
.tipsy-n .tipsy-arrow {
top: 0px;
left: 50%;
margin-left: -5px;
border-bottom-style: solid;
border-top: none;
border-left-color: transparent;
border-right-color: transparent;
}
.tipsy-nw .tipsy-arrow {
top: 0;
left: 10px;
border-bottom-style: solid;
border-top: none;
border-left-color: transparent;
border-right-color: transparent;
}
.tipsy-ne .tipsy-arrow {
top: 0;
right: 10px;
border-bottom-style: solid;
border-top: none;
border-left-color: transparent;
border-right-color: transparent;
}
.tipsy-s .tipsy-arrow {
bottom: 0;
left: 50%;
margin-left: -5px;
border-top-style: solid;
border-bottom: none;
border-left-color: transparent;
border-right-color: transparent;
}
.tipsy-sw .tipsy-arrow {
bottom: 0;
left: 10px;
border-top-style: solid;
border-bottom: none;
border-left-color: transparent;
border-right-color: transparent;
}
.tipsy-se .tipsy-arrow {
bottom: 0;
right: 10px;
border-top-style: solid;
border-bottom: none;
border-left-color: transparent;
border-right-color: transparent;
}
.tipsy-e .tipsy-arrow {
right: 0;
top: 50%;
margin-top: -5px;
border-left-style: solid;
border-right: none;
border-top-color: transparent;
border-bottom-color: transparent;
}
.tipsy-w .tipsy-arrow {
left: 0;
top: 50%;
margin-top: -5px;
border-right-style: solid;
border-left: none;
border-top-color: transparent;
border-bottom-color: transparent;
}
.cabecalhoTemas {
display: inline-block;
line-height: 9px;
overflow: hidden;
text-align: left;
text-overflow: ellipsis;
white-space: nowrap;
width: 10em;
}
.styled-select {
width: 252px;
overflow: hidden;
background: #F8F8F8;
border: 1px solid #DDDDDD;
height: 22px;
border-radius: 2px;
text-overflow: ellipsis;
}
.styled-select150 {
width: 150px;
overflow: hidden;
background: #F8F8F8;
border: 1px solid #DDDDDD;
height: 22px;
border-radius: 2px;
}
.styled-select select, .styled-select150 select {
width: 100%;
height: 22px;
border: 0;
box-shadow: none;
line-height: 1.5;
-webkit-appearance: none;
-moz-appearance: none;
text-indent: 0.01px;
white-space: nowrap;
text-overflow: ellipsis;
font-size: 12px;
appearance: none;
/*
background: transparent url("../imagens/menuarodwn8_nrm_1.gif") no-repeat scroll 99% 0px;
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
background: transparent url("../imagens/menuarodwn8_nrm_1.gif") no-repeat scroll 99% 0px;
background-size: 16px 144px;
}
*/
}
/* esconde na impressao */
@media print {
.noprint {
display: none !important;
}
.yui-skin-sam .yui-panel .hd {
display: none !important;
}
.yui-skin-sam .yui-panel .ft {
display: none !important;
}
.yui-navset {
display: none !important;
}
.yui-skin-sam .yui-button {
display: none !important;
}
.yuimenubar {
display: none !important;
}
.eudockImagemBottom {
display: none !important;
}
.eudockImagemTop {
display: none !important;
}
#i3GEOcompartilhar {
display: none !important;
}
.iconesGuiaMovel {
display: none !important;
}
.localizarxy {
display: none !important;
}
.i3GEOfechaGuia {
display: none !important;
}
input[type="radio"] {
display: none !important;
}
input[type="checkbox"] {
display: none !important;
}
.legenda > label + input[type="checkbox"]:disabled {
display: none !important;
}
}
/*! jQuery UI - v1.11.4 - 2016-07-10
* http://jqueryui.com
* Includes: core.css, draggable.css, resizable.css, selectable.css, sortable.css, accordion.css, autocomplete.css, button.css, datepicker.css, dialog.css, menu.css, progressbar.css, selectmenu.css, slider.css, spinner.css, tabs.css, tooltip.css, theme.css
* To view and modify this theme, visit http://jqueryui.com/themeroller/?ffDefault=Arial%2CHelvetica%2Csans-serif&fsDefault=1em&fwDefault=normal&cornerRadius=3px&bgColorHeader=e9e9e9&bgTextureHeader=flat&borderColorHeader=dddddd&fcHeader=333333&iconColorHeader=444444&bgColorContent=ffffff&bgTextureContent=flat&borderColorContent=dddddd&fcContent=333333&iconColorContent=444444&bgColorDefault=f6f6f6&bgTextureDefault=flat&borderColorDefault=c5c5c5&fcDefault=454545&iconColorDefault=777777&bgColorHover=ededed&bgTextureHover=flat&borderColorHover=cccccc&fcHover=2b2b2b&iconColorHover=555555&bgColorActive=007fff&bgTextureActive=flat&borderColorActive=003eff&fcActive=ffffff&iconColorActive=ffffff&bgColorHighlight=fffa90&bgTextureHighlight=flat&borderColorHighlight=dad55e&fcHighlight=777620&iconColorHighlight=777620&bgColorError=fddfdf&bgTextureError=flat&borderColorError=f1a899&fcError=5f3f3f&iconColorError=cc0000&bgColorOverlay=aaaaaa&bgTextureOverlay=flat&bgImgOpacityOverlay=0&opacityOverlay=30&bgColorShadow=666666&bgTextureShadow=flat&bgImgOpacityShadow=0&opacityShadow=30&thicknessShadow=5px&offsetTopShadow=0px&offsetLeftShadow=0px&cornerRadiusShadow=8px
* Copyright jQuery Foundation and other contributors; Licensed MIT */
.ui-helper-hidden{display:none}.ui-helper-hidden-accessible{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.ui-helper-reset{margin:0;padding:0;border:0;outline:0;line-height:1.3;text-decoration:none;font-size:100%;list-style:none}.ui-helper-clearfix:before,.ui-helper-clearfix:after{content:"";display:table;border-collapse:collapse}.ui-helper-clearfix:after{clear:both}.ui-helper-clearfix{min-height:0}.ui-helper-zfix{width:100%;height:100%;top:0;left:0;position:absolute;opacity:0;filter:Alpha(Opacity=0)}.ui-front{z-index:100}.ui-state-disabled{cursor:default!important}.ui-icon{display:block;text-indent:-99999px;overflow:hidden;background-repeat:no-repeat}.ui-widget-overlay{position:fixed;top:0;left:0;width:100%;height:100%}.ui-draggable-handle{-ms-touch-action:none;touch-action:none}.ui-resizable{position:relative}.ui-resizable-handle{position:absolute;font-size:0.1px;display:block;-ms-touch-action:none;touch-action:none}.ui-resizable-disabled .ui-resizable-handle,.ui-resizable-autohide .ui-resizable-handle{display:none}.ui-resizable-n{cursor:n-resize;height:7px;width:100%;top:-5px;left:0}.ui-resizable-s{cursor:s-resize;height:7px;width:100%;bottom:-5px;left:0}.ui-resizable-e{cursor:e-resize;width:7px;right:-5px;top:0;height:100%}.ui-resizable-w{cursor:w-resize;width:7px;left:-5px;top:0;height:100%}.ui-resizable-se{cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.ui-resizable-sw{cursor:sw-resize;width:9px;height:9px;left:-5px;bottom:-5px}.ui-resizable-nw{cursor:nw-resize;width:9px;height:9px;left:-5px;top:-5px}.ui-resizable-ne{cursor:ne-resize;width:9px;height:9px;right:-5px;top:-5px}.ui-selectable{-ms-touch-action:none;touch-action:none}.ui-selectable-helper{position:absolute;z-index:100;border:1px dotted black}.ui-sortable-handle{-ms-touch-action:none;touch-action:none}.ui-accordion .ui-accordion-header{display:block;cursor:pointer;position:relative;margin:2px 0 0 0;padding:.5em .5em .5em .7em;min-height:0;font-size:100%}.ui-accordion .ui-accordion-icons{padding-left:2.2em}.ui-accordion .ui-accordion-icons .ui-accordion-icons{padding-left:2.2em}.ui-accordion .ui-accordion-header .ui-accordion-header-icon{position:absolute;left:.5em;top:50%;margin-top:-8px}.ui-accordion .ui-accordion-content{padding:1em 2.2em;border-top:0;overflow:auto}.ui-autocomplete{position:absolute;top:0;left:0;cursor:default}.ui-button{display:inline-block;position:relative;padding:0;line-height:normal;margin-right:.1em;cursor:pointer;vertical-align:middle;text-align:center;overflow:visible}.ui-button,.ui-button:link,.ui-button:visited,.ui-button:hover,.ui-button:active{text-decoration:none}.ui-button-icon-only{width:2.2em}button.ui-button-icon-only{width:2.4em}.ui-button-icons-only{width:3.4em}button.ui-button-icons-only{width:3.7em}.ui-button .ui-button-text{display:block;line-height:normal}.ui-button-text-only .ui-button-text{padding:.4em 1em}.ui-button-icon-only .ui-button-text,.ui-button-icons-only .ui-button-text{padding:.4em;text-indent:-9999999px}.ui-button-text-icon-primary .ui-button-text,.ui-button-text-icons .ui-button-text{padding:.4em 1em .4em 2.1em}.ui-button-text-icon-secondary .ui-button-text,.ui-button-text-icons .ui-button-text{padding:.4em 2.1em .4em 1em}.ui-button-text-icons .ui-button-text{padding-left:2.1em;padding-right:2.1em}input.ui-button{padding:.4em 1em}.ui-button-icon-only .ui-icon,.ui-button-text-icon-primary .ui-icon,.ui-button-text-icon-secondary .ui-icon,.ui-button-text-icons .ui-icon,.ui-button-icons-only .ui-icon{position:absolute;top:50%;margin-top:-8px}.ui-button-icon-only .ui-icon{left:50%;margin-left:-8px}.ui-button-text-icon-primary .ui-button-icon-primary,.ui-button-text-icons .ui-button-icon-primary,.ui-button-icons-only .ui-button-icon-primary{left:.5em}.ui-button-text-icon-secondary .ui-button-icon-secondary,.ui-button-text-icons .ui-button-icon-secondary,.ui-button-icons-only .ui-button-icon-secondary{right:.5em}.ui-buttonset{margin-right:7px}.ui-buttonset .ui-button{margin-left:0;margin-right:-.3em}input.ui-button::-moz-focus-inner,button.ui-button::-moz-focus-inner{border:0;padding:0}.ui-datepicker{width:17em;padding:.2em .2em 0;display:none}.ui-datepicker .ui-datepicker-header{position:relative;padding:.2em 0}.ui-datepicker .ui-datepicker-prev,.ui-datepicker .ui-datepicker-next{position:absolute;top:2px;width:1.8em;height:1.8em}.ui-datepicker .ui-datepicker-prev-hover,.ui-datepicker .ui-datepicker-next-hover{top:1px}.ui-datepicker .ui-datepicker-prev{left:2px}.ui-datepicker .ui-datepicker-next{right:2px}.ui-datepicker .ui-datepicker-prev-hover{left:1px}.ui-datepicker .ui-datepicker-next-hover{right:1px}.ui-datepicker .ui-datepicker-prev span,.ui-datepicker .ui-datepicker-next span{display:block;position:absolute;left:50%;margin-left:-8px;top:50%;margin-top:-8px}.ui-datepicker .ui-datepicker-title{margin:0 2.3em;line-height:1.8em;text-align:center}.ui-datepicker .ui-datepicker-title select{font-size:1em;margin:1px 0}.ui-datepicker select.ui-datepicker-month,.ui-datepicker select.ui-datepicker-year{width:45%}.ui-datepicker table{width:100%;font-size:.9em;border-collapse:collapse;margin:0 0 .4em}.ui-datepicker th{padding:.7em .3em;text-align:center;font-weight:bold;border:0}.ui-datepicker td{border:0;padding:1px}.ui-datepicker td span,.ui-datepicker td a{display:block;padding:.2em;text-align:right;text-decoration:none}.ui-datepicker .ui-datepicker-buttonpane{background-image:none;margin:.7em 0 0 0;padding:0 .2em;border-left:0;border-right:0;border-bottom:0}.ui-datepicker .ui-datepicker-buttonpane button{float:right;margin:.5em .2em .4em;cursor:pointer;padding:.2em .6em .3em .6em;width:auto;overflow:visible}.ui-datepicker .ui-datepicker-buttonpane button.ui-datepicker-current{float:left}.ui-datepicker.ui-datepicker-multi{width:auto}.ui-datepicker-multi .ui-datepicker-group{float:left}.ui-datepicker-multi .ui-datepicker-group table{width:95%;margin:0 auto .4em}.ui-datepicker-multi-2 .ui-datepicker-group{width:50%}.ui-datepicker-multi-3 .ui-datepicker-group{width:33.3%}.ui-datepicker-multi-4 .ui-datepicker-group{width:25%}.ui-datepicker-multi .ui-datepicker-group-last .ui-datepicker-header,.ui-datepicker-multi .ui-datepicker-group-middle .ui-datepicker-header{border-left-width:0}.ui-datepicker-multi .ui-datepicker-buttonpane{clear:left}.ui-datepicker-row-break{clear:both;width:100%;font-size:0}.ui-datepicker-rtl{direction:rtl}.ui-datepicker-rtl .ui-datepicker-prev{right:2px;left:auto}.ui-datepicker-rtl .ui-datepicker-next{left:2px;right:auto}.ui-datepicker-rtl .ui-datepicker-prev:hover{right:1px;left:auto}.ui-datepicker-rtl .ui-datepicker-next:hover{left:1px;right:auto}.ui-datepicker-rtl .ui-datepicker-buttonpane{clear:right}.ui-datepicker-rtl .ui-datepicker-buttonpane button{float:left}.ui-datepicker-rtl .ui-datepicker-buttonpane button.ui-datepicker-current,.ui-datepicker-rtl .ui-datepicker-group{float:right}.ui-datepicker-rtl .ui-datepicker-group-last .ui-datepicker-header,.ui-datepicker-rtl .ui-datepicker-group-middle .ui-datepicker-header{border-right-width:0;border-left-width:1px}.ui-dialog{overflow:hidden;position:absolute;top:0;left:0;padding:.2em;outline:0}.ui-dialog .ui-dialog-titlebar{padding:.4em 1em;position:relative}.ui-dialog .ui-dialog-title{float:left;margin:.1em 0;white-space:nowrap;width:90%;overflow:hidden;text-overflow:ellipsis}.ui-dialog .ui-dialog-titlebar-close{position:absolute;right:.3em;top:50%;width:20px;margin:-10px 0 0 0;padding:1px;height:20px}.ui-dialog .ui-dialog-content{position:relative;border:0;padding:.5em 1em;background:none;overflow:auto}.ui-dialog .ui-dialog-buttonpane{text-align:left;border-width:1px 0 0 0;background-image:none;margin-top:.5em;padding:.3em 1em .5em .4em}.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset{float:right}.ui-dialog .ui-dialog-buttonpane button{margin:.5em .4em .5em 0;cursor:pointer}.ui-dialog .ui-resizable-se{width:12px;height:12px;right:-5px;bottom:-5px;background-position:16px 16px}.ui-draggable .ui-dialog-titlebar{cursor:move}.ui-menu{list-style:none;padding:0;margin:0;display:block;outline:none}.ui-menu .ui-menu{position:absolute}.ui-menu .ui-menu-item{position:relative;margin:0;padding:3px 1em 3px .4em;cursor:pointer;min-height:0;list-style-image:url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")}.ui-menu .ui-menu-divider{margin:5px 0;height:0;font-size:0;line-height:0;border-width:1px 0 0 0}.ui-menu .ui-state-focus,.ui-menu .ui-state-active{margin:-1px}.ui-menu-icons{position:relative}.ui-menu-icons .ui-menu-item{padding-left:2em}.ui-menu .ui-icon{position:absolute;top:0;bottom:0;left:.2em;margin:auto 0}.ui-menu .ui-menu-icon{left:auto;right:0}.ui-progressbar{height:2em;text-align:left;overflow:hidden}.ui-progressbar .ui-progressbar-value{margin:-1px;height:100%}.ui-progressbar .ui-progressbar-overlay{background:url("data:image/gif;base64,R0lGODlhKAAoAIABAAAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAQABACwAAAAAKAAoAAACkYwNqXrdC52DS06a7MFZI+4FHBCKoDeWKXqymPqGqxvJrXZbMx7Ttc+w9XgU2FB3lOyQRWET2IFGiU9m1frDVpxZZc6bfHwv4c1YXP6k1Vdy292Fb6UkuvFtXpvWSzA+HycXJHUXiGYIiMg2R6W459gnWGfHNdjIqDWVqemH2ekpObkpOlppWUqZiqr6edqqWQAAIfkECQEAAQAsAAAAACgAKAAAApSMgZnGfaqcg1E2uuzDmmHUBR8Qil95hiPKqWn3aqtLsS18y7G1SzNeowWBENtQd+T1JktP05nzPTdJZlR6vUxNWWjV+vUWhWNkWFwxl9VpZRedYcflIOLafaa28XdsH/ynlcc1uPVDZxQIR0K25+cICCmoqCe5mGhZOfeYSUh5yJcJyrkZWWpaR8doJ2o4NYq62lAAACH5BAkBAAEALAAAAAAoACgAAAKVDI4Yy22ZnINRNqosw0Bv7i1gyHUkFj7oSaWlu3ovC8GxNso5fluz3qLVhBVeT/Lz7ZTHyxL5dDalQWPVOsQWtRnuwXaFTj9jVVh8pma9JjZ4zYSj5ZOyma7uuolffh+IR5aW97cHuBUXKGKXlKjn+DiHWMcYJah4N0lYCMlJOXipGRr5qdgoSTrqWSq6WFl2ypoaUAAAIfkECQEAAQAsAAAAACgAKAAAApaEb6HLgd/iO7FNWtcFWe+ufODGjRfoiJ2akShbueb0wtI50zm02pbvwfWEMWBQ1zKGlLIhskiEPm9R6vRXxV4ZzWT2yHOGpWMyorblKlNp8HmHEb/lCXjcW7bmtXP8Xt229OVWR1fod2eWqNfHuMjXCPkIGNileOiImVmCOEmoSfn3yXlJWmoHGhqp6ilYuWYpmTqKUgAAIfkECQEAAQAsAAAAACgAKAAAApiEH6kb58biQ3FNWtMFWW3eNVcojuFGfqnZqSebuS06w5V80/X02pKe8zFwP6EFWOT1lDFk8rGERh1TTNOocQ61Hm4Xm2VexUHpzjymViHrFbiELsefVrn6XKfnt2Q9G/+Xdie499XHd2g4h7ioOGhXGJboGAnXSBnoBwKYyfioubZJ2Hn0RuRZaflZOil56Zp6iioKSXpUAAAh+QQJAQABACwAAAAAKAAoAAACkoQRqRvnxuI7kU1a1UU5bd5tnSeOZXhmn5lWK3qNTWvRdQxP8qvaC+/yaYQzXO7BMvaUEmJRd3TsiMAgswmNYrSgZdYrTX6tSHGZO73ezuAw2uxuQ+BbeZfMxsexY35+/Qe4J1inV0g4x3WHuMhIl2jXOKT2Q+VU5fgoSUI52VfZyfkJGkha6jmY+aaYdirq+lQAACH5BAkBAAEALAAAAAAoACgAAAKWBIKpYe0L3YNKToqswUlvznigd4wiR4KhZrKt9Upqip61i9E3vMvxRdHlbEFiEXfk9YARYxOZZD6VQ2pUunBmtRXo1Lf8hMVVcNl8JafV38aM2/Fu5V16Bn63r6xt97j09+MXSFi4BniGFae3hzbH9+hYBzkpuUh5aZmHuanZOZgIuvbGiNeomCnaxxap2upaCZsq+1kAACH5BAkBAAEALAAAAAAoACgAAAKXjI8By5zf4kOxTVrXNVlv1X0d8IGZGKLnNpYtm8Lr9cqVeuOSvfOW79D9aDHizNhDJidFZhNydEahOaDH6nomtJjp1tutKoNWkvA6JqfRVLHU/QUfau9l2x7G54d1fl995xcIGAdXqMfBNadoYrhH+Mg2KBlpVpbluCiXmMnZ2Sh4GBqJ+ckIOqqJ6LmKSllZmsoq6wpQAAAh+QQJAQABACwAAAAAKAAoAAAClYx/oLvoxuJDkU1a1YUZbJ59nSd2ZXhWqbRa2/gF8Gu2DY3iqs7yrq+xBYEkYvFSM8aSSObE+ZgRl1BHFZNr7pRCavZ5BW2142hY3AN/zWtsmf12p9XxxFl2lpLn1rseztfXZjdIWIf2s5dItwjYKBgo9yg5pHgzJXTEeGlZuenpyPmpGQoKOWkYmSpaSnqKileI2FAAACH5BAkBAAEALAAAAAAoACgAAAKVjB+gu+jG4kORTVrVhRlsnn2dJ3ZleFaptFrb+CXmO9OozeL5VfP99HvAWhpiUdcwkpBH3825AwYdU8xTqlLGhtCosArKMpvfa1mMRae9VvWZfeB2XfPkeLmm18lUcBj+p5dnN8jXZ3YIGEhYuOUn45aoCDkp16hl5IjYJvjWKcnoGQpqyPlpOhr3aElaqrq56Bq7VAAAOw==");height:100%;filter:alpha(opacity=25);opacity:0.25}.ui-progressbar-indeterminate .ui-progressbar-value{background-image:none}.ui-selectmenu-menu{padding:0;margin:0;position:absolute;top:0;left:0;display:none}.ui-selectmenu-menu .ui-menu{overflow:auto;overflow-x:hidden;padding-bottom:1px}.ui-selectmenu-menu .ui-menu .ui-selectmenu-optgroup{font-size:1em;font-weight:bold;line-height:1.5;padding:2px 0.4em;margin:0.5em 0 0 0;height:auto;border:0}.ui-selectmenu-open{display:block}.ui-selectmenu-button{display:inline-block;overflow:hidden;position:relative;text-decoration:none;cursor:pointer}.ui-selectmenu-button span.ui-icon{right:0.5em;left:auto;margin-top:-8px;position:absolute;top:50%}.ui-selectmenu-button span.ui-selectmenu-text{text-align:left;padding:0.4em 2.1em 0.4em 1em;display:block;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ui-slider{position:relative;text-align:left}.ui-slider .ui-slider-handle{position:absolute;z-index:2;width:1.2em;height:1.2em;cursor:default;-ms-touch-action:none;touch-action:none}.ui-slider .ui-slider-range{position:absolute;z-index:1;font-size:.7em;display:block;border:0;background-position:0 0}.ui-slider.ui-state-disabled .ui-slider-handle,.ui-slider.ui-state-disabled .ui-slider-range{filter:inherit}.ui-slider-horizontal{height:.8em}.ui-slider-horizontal .ui-slider-handle{top:-.3em;margin-left:-.6em}.ui-slider-horizontal .ui-slider-range{top:0;height:100%}.ui-slider-horizontal .ui-slider-range-min{left:0}.ui-slider-horizontal .ui-slider-range-max{right:0}.ui-slider-vertical{width:.8em;height:100px}.ui-slider-vertical .ui-slider-handle{left:-.3em;margin-left:0;margin-bottom:-.6em}.ui-slider-vertical .ui-slider-range{left:0;width:100%}.ui-slider-vertical .ui-slider-range-min{bottom:0}.ui-slider-vertical .ui-slider-range-max{top:0}.ui-spinner{position:relative;display:inline-block;overflow:hidden;padding:0;vertical-align:middle}.ui-spinner-input{border:none;background:none;color:inherit;padding:0;margin:.2em 0;vertical-align:middle;margin-left:.4em;margin-right:22px}.ui-spinner-button{width:16px;height:50%;font-size:.5em;padding:0;margin:0;text-align:center;position:absolute;cursor:default;display:block;overflow:hidden;right:0}.ui-spinner a.ui-spinner-button{border-top:none;border-bottom:none;border-right:none}.ui-spinner .ui-icon{position:absolute;margin-top:-8px;top:50%;left:0}.ui-spinner-up{top:0}.ui-spinner-down{bottom:0}.ui-spinner .ui-icon-triangle-1-s{background-position:-65px -16px}.ui-tabs{position:relative;padding:.2em}.ui-tabs .ui-tabs-nav{margin:0;padding:.2em .2em 0}.ui-tabs .ui-tabs-nav li{list-style:none;float:left;position:relative;top:0;margin:1px .2em 0 0;border-bottom-width:0;padding:0;white-space:nowrap}.ui-tabs .ui-tabs-nav .ui-tabs-anchor{float:left;padding:.5em 1em;text-decoration:none}.ui-tabs .ui-tabs-nav li.ui-tabs-active{margin-bottom:-1px;padding-bottom:1px}.ui-tabs .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor,.ui-tabs .ui-tabs-nav li.ui-state-disabled .ui-tabs-anchor,.ui-tabs .ui-tabs-nav li.ui-tabs-loading .ui-tabs-anchor{cursor:text}.ui-tabs-collapsible .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor{cursor:pointer}.ui-tabs .ui-tabs-panel{display:block;border-width:0;padding:1em 1.4em;background:none}.ui-tooltip{padding:8px;position:absolute;z-index:9999;max-width:300px;-webkit-box-shadow:0 0 5px #aaa;box-shadow:0 0 5px #aaa}body .ui-tooltip{border-width:2px}.ui-widget{font-family:Arial,Helvetica,sans-serif;font-size:1em}.ui-widget .ui-widget{font-size:1em}.ui-widget input,.ui-widget select,.ui-widget textarea,.ui-widget button{font-family:Arial,Helvetica,sans-serif;font-size:1em}.ui-widget-content{border:1px solid #ddd;background:#fff;color:#333}.ui-widget-content a{color:#333}.ui-widget-header{border:1px solid #ddd;background:#e9e9e9;color:#333;font-weight:bold}.ui-widget-header a{color:#333}.ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default{border:1px solid #c5c5c5;background:#f6f6f6;font-weight:normal;color:#454545}.ui-state-default a,.ui-state-default a:link,.ui-state-default a:visited{color:#454545;text-decoration:none}.ui-state-hover,.ui-widget-content .ui-state-hover,.ui-widget-header .ui-state-hover,.ui-state-focus,.ui-widget-content .ui-state-focus,.ui-widget-header .ui-state-focus{border:1px solid #ccc;background:#ededed;font-weight:normal;color:#2b2b2b}.ui-state-hover a,.ui-state-hover a:hover,.ui-state-hover a:link,.ui-state-hover a:visited,.ui-state-focus a,.ui-state-focus a:hover,.ui-state-focus a:link,.ui-state-focus a:visited{color:#2b2b2b;text-decoration:none}.ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active{border:1px solid #003eff;background:#007fff;font-weight:normal;color:#fff}.ui-state-active a,.ui-state-active a:link,.ui-state-active a:visited{color:#fff;text-decoration:none}.ui-state-highlight,.ui-widget-content .ui-state-highlight,.ui-widget-header .ui-state-highlight{border:1px solid #dad55e;background:#fffa90;color:#777620}.ui-state-highlight a,.ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a{color:#777620}.ui-state-error,.ui-widget-content .ui-state-error,.ui-widget-header .ui-state-error{border:1px solid #f1a899;background:#fddfdf;color:#5f3f3f}.ui-state-error a,.ui-widget-content .ui-state-error a,.ui-widget-header .ui-state-error a{color:#5f3f3f}.ui-state-error-text,.ui-widget-content .ui-state-error-text,.ui-widget-header .ui-state-error-text{color:#5f3f3f}.ui-priority-primary,.ui-widget-content .ui-priority-primary,.ui-widget-header .ui-priority-primary{font-weight:bold}.ui-priority-secondary,.ui-widget-content .ui-priority-secondary,.ui-widget-header .ui-priority-secondary{opacity:.7;filter:Alpha(Opacity=70);font-weight:normal}.ui-state-disabled,.ui-widget-content .ui-state-disabled,.ui-widget-header .ui-state-disabled{opacity:.35;filter:Alpha(Opacity=35);background-image:none}.ui-state-disabled .ui-icon{filter:Alpha(Opacity=35)}.ui-icon{width:16px;height:16px}.ui-icon,.ui-widget-content .ui-icon{background-image:url("images/ui-icons_444444_256x240.png")}.ui-widget-header .ui-icon{background-image:url("images/ui-icons_444444_256x240.png")}.ui-state-default .ui-icon{background-image:url("images/ui-icons_777777_256x240.png")}.ui-state-hover .ui-icon,.ui-state-focus .ui-icon{background-image:url("images/ui-icons_555555_256x240.png")}.ui-state-active .ui-icon{background-image:url("images/ui-icons_ffffff_256x240.png")}.ui-state-highlight .ui-icon{background-image:url("images/ui-icons_777620_256x240.png")}.ui-state-error .ui-icon,.ui-state-error-text .ui-icon{background-image:url("images/ui-icons_cc0000_256x240.png")}.ui-icon-blank{background-position:16px 16px}.ui-icon-carat-1-n{background-position:0 0}.ui-icon-carat-1-ne{background-position:-16px 0}.ui-icon-carat-1-e{background-position:-32px 0}.ui-icon-carat-1-se{background-position:-48px 0}.ui-icon-carat-1-s{background-position:-64px 0}.ui-icon-carat-1-sw{background-position:-80px 0}.ui-icon-carat-1-w{background-position:-96px 0}.ui-icon-carat-1-nw{background-position:-112px 0}.ui-icon-carat-2-n-s{background-position:-128px 0}.ui-icon-carat-2-e-w{background-position:-144px 0}.ui-icon-triangle-1-n{background-position:0 -16px}.ui-icon-triangle-1-ne{background-position:-16px -16px}.ui-icon-triangle-1-e{background-position:-32px -16px}.ui-icon-triangle-1-se{background-position:-48px -16px}.ui-icon-triangle-1-s{background-position:-64px -16px}.ui-icon-triangle-1-sw{background-position:-80px -16px}.ui-icon-triangle-1-w{background-position:-96px -16px}.ui-icon-triangle-1-nw{background-position:-112px -16px}.ui-icon-triangle-2-n-s{background-position:-128px -16px}.ui-icon-triangle-2-e-w{background-position:-144px -16px}.ui-icon-arrow-1-n{background-position:0 -32px}.ui-icon-arrow-1-ne{background-position:-16px -32px}.ui-icon-arrow-1-e{background-position:-32px -32px}.ui-icon-arrow-1-se{background-position:-48px -32px}.ui-icon-arrow-1-s{background-position:-64px -32px}.ui-icon-arrow-1-sw{background-position:-80px -32px}.ui-icon-arrow-1-w{background-position:-96px -32px}.ui-icon-arrow-1-nw{background-position:-112px -32px}.ui-icon-arrow-2-n-s{background-position:-128px -32px}.ui-icon-arrow-2-ne-sw{background-position:-144px -32px}.ui-icon-arrow-2-e-w{background-position:-160px -32px}.ui-icon-arrow-2-se-nw{background-position:-176px -32px}.ui-icon-arrowstop-1-n{background-position:-192px -32px}.ui-icon-arrowstop-1-e{background-position:-208px -32px}.ui-icon-arrowstop-1-s{background-position:-224px -32px}.ui-icon-arrowstop-1-w{background-position:-240px -32px}.ui-icon-arrowthick-1-n{background-position:0 -48px}.ui-icon-arrowthick-1-ne{background-position:-16px -48px}.ui-icon-arrowthick-1-e{background-position:-32px -48px}.ui-icon-arrowthick-1-se{background-position:-48px -48px}.ui-icon-arrowthick-1-s{background-position:-64px -48px}.ui-icon-arrowthick-1-sw{background-position:-80px -48px}.ui-icon-arrowthick-1-w{background-position:-96px -48px}.ui-icon-arrowthick-1-nw{background-position:-112px -48px}.ui-icon-arrowthick-2-n-s{background-position:-128px -48px}.ui-icon-arrowthick-2-ne-sw{background-position:-144px -48px}.ui-icon-arrowthick-2-e-w{background-position:-160px -48px}.ui-icon-arrowthick-2-se-nw{background-position:-176px -48px}.ui-icon-arrowthickstop-1-n{background-position:-192px -48px}.ui-icon-arrowthickstop-1-e{background-position:-208px -48px}.ui-icon-arrowthickstop-1-s{background-position:-224px -48px}.ui-icon-arrowthickstop-1-w{background-position:-240px -48px}.ui-icon-arrowreturnthick-1-w{background-position:0 -64px}.ui-icon-arrowreturnthick-1-n{background-position:-16px -64px}.ui-icon-arrowreturnthick-1-e{background-position:-32px -64px}.ui-icon-arrowreturnthick-1-s{background-position:-48px -64px}.ui-icon-arrowreturn-1-w{background-position:-64px -64px}.ui-icon-arrowreturn-1-n{background-position:-80px -64px}.ui-icon-arrowreturn-1-e{background-position:-96px -64px}.ui-icon-arrowreturn-1-s{background-position:-112px -64px}.ui-icon-arrowrefresh-1-w{background-position:-128px -64px}.ui-icon-arrowrefresh-1-n{background-position:-144px -64px}.ui-icon-arrowrefresh-1-e{background-position:-160px -64px}.ui-icon-arrowrefresh-1-s{background-position:-176px -64px}.ui-icon-arrow-4{background-position:0 -80px}.ui-icon-arrow-4-diag{background-position:-16px -80px}.ui-icon-extlink{background-position:-32px -80px}.ui-icon-newwin{background-position:-48px -80px}.ui-icon-refresh{background-position:-64px -80px}.ui-icon-shuffle{background-position:-80px -80px}.ui-icon-transfer-e-w{background-position:-96px -80px}.ui-icon-transferthick-e-w{background-position:-112px -80px}.ui-icon-folder-collapsed{background-position:0 -96px}.ui-icon-folder-open{background-position:-16px -96px}.ui-icon-document{background-position:-32px -96px}.ui-icon-document-b{background-position:-48px -96px}.ui-icon-note{background-position:-64px -96px}.ui-icon-mail-closed{background-position:-80px -96px}.ui-icon-mail-open{background-position:-96px -96px}.ui-icon-suitcase{background-position:-112px -96px}.ui-icon-comment{background-position:-128px -96px}.ui-icon-person{background-position:-144px -96px}.ui-icon-print{background-position:-160px -96px}.ui-icon-trash{background-position:-176px -96px}.ui-icon-locked{background-position:-192px -96px}.ui-icon-unlocked{background-position:-208px -96px}.ui-icon-bookmark{background-position:-224px -96px}.ui-icon-tag{background-position:-240px -96px}.ui-icon-home{background-position:0 -112px}.ui-icon-flag{background-position:-16px -112px}.ui-icon-calendar{background-position:-32px -112px}.ui-icon-cart{background-position:-48px -112px}.ui-icon-pencil{background-position:-64px -112px}.ui-icon-clock{background-position:-80px -112px}.ui-icon-disk{background-position:-96px -112px}.ui-icon-calculator{background-position:-112px -112px}.ui-icon-zoomin{background-position:-128px -112px}.ui-icon-zoomout{background-position:-144px -112px}.ui-icon-search{background-position:-160px -112px}.ui-icon-wrench{background-position:-176px -112px}.ui-icon-gear{background-position:-192px -112px}.ui-icon-heart{background-position:-208px -112px}.ui-icon-star{background-position:-224px -112px}.ui-icon-link{background-position:-240px -112px}.ui-icon-cancel{background-position:0 -128px}.ui-icon-plus{background-position:-16px -128px}.ui-icon-plusthick{background-position:-32px -128px}.ui-icon-minus{background-position:-48px -128px}.ui-icon-minusthick{background-position:-64px -128px}.ui-icon-close{background-position:-80px -128px}.ui-icon-closethick{background-position:-96px -128px}.ui-icon-key{background-position:-112px -128px}.ui-icon-lightbulb{background-position:-128px -128px}.ui-icon-scissors{background-position:-144px -128px}.ui-icon-clipboard{background-position:-160px -128px}.ui-icon-copy{background-position:-176px -128px}.ui-icon-contact{background-position:-192px -128px}.ui-icon-image{background-position:-208px -128px}.ui-icon-video{background-position:-224px -128px}.ui-icon-script{background-position:-240px -128px}.ui-icon-alert{background-position:0 -144px}.ui-icon-info{background-position:-16px -144px}.ui-icon-notice{background-position:-32px -144px}.ui-icon-help{background-position:-48px -144px}.ui-icon-check{background-position:-64px -144px}.ui-icon-bullet{background-position:-80px -144px}.ui-icon-radio-on{background-position:-96px -144px}.ui-icon-radio-off{background-position:-112px -144px}.ui-icon-pin-w{background-position:-128px -144px}.ui-icon-pin-s{background-position:-144px -144px}.ui-icon-play{background-position:0 -160px}.ui-icon-pause{background-position:-16px -160px}.ui-icon-seek-next{background-position:-32px -160px}.ui-icon-seek-prev{background-position:-48px -160px}.ui-icon-seek-end{background-position:-64px -160px}.ui-icon-seek-start{background-position:-80px -160px}.ui-icon-seek-first{background-position:-80px -160px}.ui-icon-stop{background-position:-96px -160px}.ui-icon-eject{background-position:-112px -160px}.ui-icon-volume-off{background-position:-128px -160px}.ui-icon-volume-on{background-position:-144px -160px}.ui-icon-power{background-position:0 -176px}.ui-icon-signal-diag{background-position:-16px -176px}.ui-icon-signal{background-position:-32px -176px}.ui-icon-battery-0{background-position:-48px -176px}.ui-icon-battery-1{background-position:-64px -176px}.ui-icon-battery-2{background-position:-80px -176px}.ui-icon-battery-3{background-position:-96px -176px}.ui-icon-circle-plus{background-position:0 -192px}.ui-icon-circle-minus{background-position:-16px -192px}.ui-icon-circle-close{background-position:-32px -192px}.ui-icon-circle-triangle-e{background-position:-48px -192px}.ui-icon-circle-triangle-s{background-position:-64px -192px}.ui-icon-circle-triangle-w{background-position:-80px -192px}.ui-icon-circle-triangle-n{background-position:-96px -192px}.ui-icon-circle-arrow-e{background-position:-112px -192px}.ui-icon-circle-arrow-s{background-position:-128px -192px}.ui-icon-circle-arrow-w{background-position:-144px -192px}.ui-icon-circle-arrow-n{background-position:-160px -192px}.ui-icon-circle-zoomin{background-position:-176px -192px}.ui-icon-circle-zoomout{background-position:-192px -192px}.ui-icon-circle-check{background-position:-208px -192px}.ui-icon-circlesmall-plus{background-position:0 -208px}.ui-icon-circlesmall-minus{background-position:-16px -208px}.ui-icon-circlesmall-close{background-position:-32px -208px}.ui-icon-squaresmall-plus{background-position:-48px -208px}.ui-icon-squaresmall-minus{background-position:-64px -208px}.ui-icon-squaresmall-close{background-position:-80px -208px}.ui-icon-grip-dotted-vertical{background-position:0 -224px}.ui-icon-grip-dotted-horizontal{background-position:-16px -224px}.ui-icon-grip-solid-vertical{background-position:-32px -224px}.ui-icon-grip-solid-horizontal{background-position:-48px -224px}.ui-icon-gripsmall-diagonal-se{background-position:-64px -224px}.ui-icon-grip-diagonal-se{background-position:-80px -224px}.ui-corner-all,.ui-corner-top,.ui-corner-left,.ui-corner-tl{border-top-left-radius:3px}.ui-corner-all,.ui-corner-top,.ui-corner-right,.ui-corner-tr{border-top-right-radius:3px}.ui-corner-all,.ui-corner-bottom,.ui-corner-left,.ui-corner-bl{border-bottom-left-radius:3px}.ui-corner-all,.ui-corner-bottom,.ui-corner-right,.ui-corner-br{border-bottom-right-radius:3px}.ui-widget-overlay{background:#aaa;opacity:.3;filter:Alpha(Opacity=30)}.ui-widget-shadow{margin:0 0 0 0;padding:5px;background:#666;opacity:.3;filter:Alpha(Opacity=30);border-radius:8px}
/*! Pickr 1.7.4 MIT | https://github.com/Simonwep/pickr */.pickr{position:relative;overflow:visible;transform:translateY(0)}.pickr *{box-sizing:border-box;outline:none;border:none;-webkit-appearance:none}.pickr .pcr-button{position:relative;height:2em;width:2em;padding:.5em;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;border-radius:.15em;background:url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" stroke="%2342445A" stroke-width="5px" stroke-linecap="round"><path d="M45,45L5,5"></path><path d="M45,5L5,45"></path></svg>') no-repeat 50%;background-size:0;transition:all .3s}.pickr .pcr-button:before{background:url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');background-size:.5em;z-index:-1;z-index:auto}.pickr .pcr-button:after,.pickr .pcr-button:before{position:absolute;content:"";top:0;left:0;width:100%;height:100%;border-radius:.15em}.pickr .pcr-button:after{transition:background .3s;background:currentColor}.pickr .pcr-button.clear{background-size:70%}.pickr .pcr-button.clear:before{opacity:0}.pickr .pcr-button.clear:focus{box-shadow:0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px currentColor}.pickr .pcr-button.disabled{cursor:not-allowed}.pcr-app *,.pickr *{box-sizing:border-box;outline:none;border:none;-webkit-appearance:none}.pcr-app button.pcr-active,.pcr-app button:focus,.pcr-app input.pcr-active,.pcr-app input:focus,.pickr button.pcr-active,.pickr button:focus,.pickr input.pcr-active,.pickr input:focus{box-shadow:0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px currentColor}.pcr-app .pcr-palette,.pcr-app .pcr-slider,.pickr .pcr-palette,.pickr .pcr-slider{transition:box-shadow .3s}.pcr-app .pcr-palette:focus,.pcr-app .pcr-slider:focus,.pickr .pcr-palette:focus,.pickr .pcr-slider:focus{box-shadow:0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px rgba(0,0,0,.25)}.pcr-app{position:fixed;display:flex;flex-direction:column;z-index:10000;border-radius:.1em;background:#fff;opacity:0;visibility:hidden;transition:opacity .3s,visibility 0s .3s;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;box-shadow:0 .15em 1.5em 0 rgba(0,0,0,.1),0 0 1em 0 rgba(0,0,0,.03);left:0;top:0}.pcr-app.visible{transition:opacity .3s;visibility:visible;opacity:1}.pcr-app .pcr-swatches{display:flex;flex-wrap:wrap;margin-top:.75em}.pcr-app .pcr-swatches.pcr-last{margin:0}@supports (display:grid){.pcr-app .pcr-swatches{display:grid;align-items:center;grid-template-columns:repeat(auto-fit,1.75em)}}.pcr-app .pcr-swatches>button{font-size:1em;position:relative;width:calc(1.75em - 5px);height:calc(1.75em - 5px);border-radius:.15em;cursor:pointer;margin:2.5px;flex-shrink:0;justify-self:center;transition:all .15s;overflow:hidden;background:transparent;z-index:1}.pcr-app .pcr-swatches>button:before{position:absolute;content:"";top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');background-size:6px;border-radius:.15em;z-index:-1}.pcr-app .pcr-swatches>button:after{content:"";position:absolute;top:0;left:0;width:100%;height:100%;background:currentColor;border:1px solid rgba(0,0,0,.05);border-radius:.15em;box-sizing:border-box}.pcr-app .pcr-swatches>button:hover{filter:brightness(1.05)}.pcr-app .pcr-swatches>button:not(.pcr-active){box-shadow:none}.pcr-app .pcr-interaction{display:flex;flex-wrap:wrap;align-items:center;margin:0 -.2em}.pcr-app .pcr-interaction>*{margin:0 .2em}.pcr-app .pcr-interaction input{letter-spacing:.07em;font-size:.75em;text-align:center;cursor:pointer;color:#75797e;background:#f1f3f4;border-radius:.15em;transition:all .15s;padding:.45em .5em;margin-top:.75em}.pcr-app .pcr-interaction input:hover{filter:brightness(.975)}.pcr-app .pcr-interaction input:focus{box-shadow:0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px rgba(66,133,244,.75)}.pcr-app .pcr-interaction .pcr-result{color:#75797e;text-align:left;flex:1 1 8em;min-width:8em;transition:all .2s;border-radius:.15em;background:#f1f3f4;cursor:text}.pcr-app .pcr-interaction .pcr-result::-moz-selection{background:#4285f4;color:#fff}.pcr-app .pcr-interaction .pcr-result::selection{background:#4285f4;color:#fff}.pcr-app .pcr-interaction .pcr-type.active{color:#fff;background:#4285f4}.pcr-app .pcr-interaction .pcr-cancel,.pcr-app .pcr-interaction .pcr-clear,.pcr-app .pcr-interaction .pcr-save{width:auto;color:#fff}.pcr-app .pcr-interaction .pcr-cancel:hover,.pcr-app .pcr-interaction .pcr-clear:hover,.pcr-app .pcr-interaction .pcr-save:hover{filter:brightness(.925)}.pcr-app .pcr-interaction .pcr-save{background:#4285f4}.pcr-app .pcr-interaction .pcr-cancel,.pcr-app .pcr-interaction .pcr-clear{background:#f44250}.pcr-app .pcr-interaction .pcr-cancel:focus,.pcr-app .pcr-interaction .pcr-clear:focus{box-shadow:0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px rgba(244,66,80,.75)}.pcr-app .pcr-selection .pcr-picker{position:absolute;height:18px;width:18px;border:2px solid #fff;border-radius:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pcr-app .pcr-selection .pcr-color-chooser,.pcr-app .pcr-selection .pcr-color-opacity,.pcr-app .pcr-selection .pcr-color-palette{position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:flex;flex-direction:column;cursor:grab;cursor:-webkit-grab}.pcr-app .pcr-selection .pcr-color-chooser:active,.pcr-app .pcr-selection .pcr-color-opacity:active,.pcr-app .pcr-selection .pcr-color-palette:active{cursor:grabbing;cursor:-webkit-grabbing}.pcr-app[data-theme=classic]{width:28.5em;max-width:95vw;padding:.8em}.pcr-app[data-theme=classic] .pcr-selection{display:flex;justify-content:space-between;flex-grow:1}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-preview{position:relative;z-index:1;width:2em;display:flex;flex-direction:column;justify-content:space-between;margin-right:.75em}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-preview:before{position:absolute;content:"";top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');background-size:.5em;border-radius:.15em;z-index:-1}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-preview .pcr-last-color{cursor:pointer;transition:background-color .3s,box-shadow .3s;border-radius:.15em .15em 0 0;z-index:2}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-preview .pcr-current-color{border-radius:0 0 .15em .15em}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-preview .pcr-current-color,.pcr-app[data-theme=classic] .pcr-selection .pcr-color-preview .pcr-last-color{background:currentColor;width:100%;height:50%}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-palette{width:100%;height:8em;z-index:1}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-palette .pcr-palette{flex-grow:1;border-radius:.15em}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-palette .pcr-palette:before{position:absolute;content:"";top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');background-size:.5em;border-radius:.15em;z-index:-1}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-chooser,.pcr-app[data-theme=classic] .pcr-selection .pcr-color-opacity{margin-left:.75em}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-chooser .pcr-picker,.pcr-app[data-theme=classic] .pcr-selection .pcr-color-opacity .pcr-picker{left:50%;transform:translateX(-50%)}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-chooser .pcr-slider,.pcr-app[data-theme=classic] .pcr-selection .pcr-color-opacity .pcr-slider{width:8px;flex-grow:1;border-radius:50em}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-chooser .pcr-slider{background:linear-gradient(180deg,red,#ff0,#0f0,#0ff,#00f,#f0f,red)}.pcr-app[data-theme=classic] .pcr-selection .pcr-color-opacity .pcr-slider{background:linear-gradient(180deg,transparent,#000),url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');background-size:100%,50%}

<?php if(extension_loaded('zlib')){ob_end_flush();}?>