<?php //error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/css"); ?>#abreJanelaLegenda,#localizar,#barraedicao,#abregoogleearth,#uploadgpx,#metar,#carouselTemas,#identificaBalao,#rota,#buscafotos,#area,#confluence,#scielo,#wiki,#inseregrafico,#realca,#reinicia,#google,#zoomtot,#pan,#zoomli,#zoomlo,#zoomiauto,#zoomoauto,#identifica,#lentei,#reinicia,#exten,#selecao,#inserexy,#textofid,#mede,#perfil,#cruza,#tamanho,#imprimir,#salva,#carrega,#referencia,#pegaimagens,#v3d
{
margin: 2px;
cursor: pointer;
border: 0px solid rgb(50, 50, 50);
border-bottom: 1px solid rgb(50, 50, 50);
border-left: 1px solid rgb(50, 50, 50);
width: 24px;
height: 24px;
z-index: 1000;
position: relative;
}
#box1 {
font-size: 0px;
cursor: crosshair;
opacity: .25;
background-color: gray;
position: absolute;
visibility: hidden;
width: 0px;
height: 0px;
border: 2px solid #ff0000;
}
#boxg {
position: absolute;
visibility: visible;
width: 20px;
height: 20px;
border: 2px solid red;
display: none;
}
#obj {
position: absolute;
z-index: 500;
height: 0;
width: 0
}
#lente {
z-index: 101;
top: 10px;
position: absolute;
}
#boxlente {
display: none;
z-index: 200;
border: 2px solid #ff0000;
top: 10px;
position: absolute;
width: 240px;
height: 240px;
}
#aguarde {
top: 0px;
position: absolute;
visibility: hidden;
}
#mensagem {
background-color: white;
position: absolute;
visibility: hidden
}
.i3geoBotaoAplicar {
display: none;
position: absolute;
cursor: pointer;
z-index: 1000;
background-color: #F6F6F6;
color: #426252;
}
#img,#imgL,#imgO,#imgN,#imgS {
border: 0px solid black;
cursor: crosshair;
top: 0px;
left: 0px;
}
#img_d {
border: 0px solid black;
cursor: crosshair;
}
#carrega {
background-image: URL('../imagens/carrega.gif');
}
#salva {
background-image: URL('../imagens/salva.gif');
}
#tamanho {
background-image: URL('../imagens/amp.gif');
}
#cruza {
background-image: URL('../imagens/cruzapt.png');
}
#pegaimagens {
background-image: URL('../imagens/legend.gif');
}
#realca {
background-image: URL('../imagens/realca.gif');
}
#zoomlo {
background-image: URL('../imagens/zoomlo.gif');
}
#imprimir {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px 0px;
}
#mede {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -24px;
}
#textofid {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -48px;
}
#inserexy {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -72px;
}
#selecao {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -96px;
}
#exten {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -120px;
}
#reinicia {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -144px;
}
#lentei {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -168px;
}
#identificaBalao {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -192px;
cursor: pointer;
}
#zoomtot {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -216px;
}
#pan {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -240px;
}
#google {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -264px;
}
#referencia {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -288px;
}
#inseregrafico {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -312px;
}
#wiki {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -336px;
}
#scielo {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -360px;
}
#confluence {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -384px;
}
#v3d {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -408px;
}
#area {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -432px;
}
#identifica {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -456px;
cursor: pointer;
}
#metar {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -480px;
cursor: pointer;
}
#buscafotos {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -504px;
cursor: pointer;
}
#rota {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -528px;
}
.abregoogleearth {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -576px;
}
.ticPropriedades2 {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: -5px -603px;
height: 15px;
width: 15px;
}
.carregarKml {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -624px;
width: 16px;
border: 1px solid #DCDCDC;
}
.buscaInde {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -700px;
width: 16px;
border: 1px solid #DCDCDC;
}
.iconeMetaestat {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -728px;
width: 16px;
border: 1px solid #DCDCDC;
}
#barraedicao {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -648px;
}
#localizar {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
background-position: 0px -672px;
}
.i3GEOiconeIdentifica {
background-image: URL('../imagens/sprite2.png');
background-repeat: no-repeat;
width: 14px;
background-position: 0px -744px;
}
.ticDownload {
background-image: url("../imagens/sprite.png");
background-position: 0 -1124px;
background-repeat: no-repeat;
height: 15px;
width: 15px;
}
#ondeestou {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -475px;
width: 20px;
height: 10px;
}
#menuinterface {
width: 75px;
height: 15px;
}
#menuajudaMenu {
width: 52px;
height: 15px;
}
#menuanalise {
width: 52px;
height: 15px;
}
#menujanelas {
width: 52px;
height: 15px;
}
#menuferramentas {
width: 75px;
height: 15px;
}
#menuarquivos {
width: 52px;
height: 15px;
}
#menui3GeoMenuMarcador {
height: 15px;
width: 75px;
}
.menuTresLinhas {
float: left;
position: relative;
left : -5px;
top : 2px;
}
.menuTresLinhas b {
background: none repeat scroll 0 0 #fff;
border-radius: 2px;
display: block;
height: 2px;
margin-bottom: 3px;
width: 15px;
}
/*bandeira do brasil*/
#brasil {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -600px;
width: 20px;
height: 10px;
cursor: pointer;
}
/*bandeira inglaterra*/
#uk {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -625px;
width: 20px;
height: 10px;
cursor: pointer;
}
#espanhol {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1400px;
width: 20px;
height: 10px;
cursor: pointer;
}
#italiano {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1725px;
width: 20px;
height: 10px;
cursor: pointer;
}
/*icone de aplicar*/
.tic {
background-image: url(../imagens/sprite.png);
background-position: 0px -650px;
background-repeat: no-repeat;
cursor: pointer;
height: 14px;
text-align: center;
width: 25px;
box-shadow: 1px 1px 3px 0px lightgray;
margin-left: 1px;
}
.ticfind {
background-image: url("../imagens/ic_zoom.png");
background-repeat: no-repeat;
cursor: pointer;
width: 14px;
text-align: center;
}
.x {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -675px;
width: 9px;
height: 9px;
cursor: pointer;
}
.sobe {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -700px;
width: 9px;
height: 9px;
cursor: pointer;
}
.desce {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -725px;
width: 9px;
height: 9px;
cursor: pointer;
}
.extent {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -750px;
width: 9px;
height: 9px;
cursor: pointer;
}
.menuarrow {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -775px;
width: 16px;
height: 16px;
cursor: pointer;
left: 3px;
top: 2px;
}
.mais {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -800px;
width: 17px;
height: 9px;
cursor: pointer;
}
.menos {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -825px;
width: 17px;
height: 9px;
cursor: pointer;
}
.ponto {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -850px;
width: 17px;
height: 9px;
cursor: pointer;
}
.quadro {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -875px;
width: 13px;
height: 13px;
cursor: pointer;
}
.quadro1 {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -900px;
width: 13px;
height: 13px;
cursor: pointer;
}
.slider {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -925px;
width: 20px;
height: 9px;
}
#vertMenosZoom {
cursor: pointer;
position: relative;
top: -1px;
width: 18px;
background: url('../imagens/sprite.png');
background-position: 0px -950px;
height: 18px;
}
#vertMaisZoom {
cursor: pointer;
position: relative;
top: 2px;
width: 18px;
background: url('../imagens/sprite.png');
background-position: 0px -975px;
height: 18px;
}
#zoomli {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1000px;
}
.foldermapa1 {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1025px;
width: 17px;
height: 15px;
}
.foldermapa {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1050px;
width: 17px;
height: 15px;
}
#i3geo_lixeira, .i3geo_lixeira {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1078px;
width: 18px;
height: 18px;
}
#i3geo_refresh, .i3geo_refresh {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2205px;
width: 18px;
height: 18px;
cursor: pointer;
}
.upload {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1099px;
width: 16px;
border: 1px solid #DCDCDC;
}
.download {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1124px;
width: 16px;
border: 1px solid #DCDCDC;
}
.conectarwms {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 1px -1149px;
width: 16px;
border: 1px solid #DCDCDC;
}
.conectargeorss {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 1px -1174px;
width: 16px;
border: 1px solid #DCDCDC;
}
.conectarservidor {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1200px;
width: 14px;
height: 14px;
border-left: 1px solid gray;
border-bottom: 1px solid gray;
border-top: 1px solid #F8F8F8;
border-right: 1px solid #F8F8F8;
}
.folder {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1225px;
width: 17px;
height: 15px;
}
.rosanorte {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1250px;
width: 14px;
height: 14px;
}
.rosasul {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1275px;
width: 14px;
height: 14px;
}
.rosaleste {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1300px;
width: 14px;
height: 14px;
}
.rosaoeste {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1325px;
width: 14px;
height: 14px;
}
.rosamais {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1350px;
width: 10px;
height: 20px;
}
.rosamenos {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1375px;
width: 10px;
height: 20px;
}
#desceferramentas {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1450px;
cursor: pointer;
width: 22px;
height: 20px;
margin: 2px;
}
#sobeferramentas {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1475px;
cursor: pointer;
width: 22px;
height: 20px;
margin: 2px;
}
/*marcador de lista das propriedades do mapa*/
.ticPropriedades {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1500px;
width: 9px;
height: 10px;
cursor: pointer;
margin-right: 3px;
}
/*marcador de lista das opcoes do tema*/
.ticOpcoesTemas {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1500px;
width: 9px;
height: 10px;
cursor: pointer;
margin-right: 3px;
}
.uploaddbf {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 1px -1523px;
width: 16px;
border: 1px solid #DCDCDC;
}
.rosanordeste {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1550px;
width: 14px;
height: 14px;
}
.rosasudeste {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1575px;
width: 14px;
height: 14px;
}
.rosanoroeste {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1600px;
width: 14px;
height: 14px;
}
.rosasudoeste {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1625px;
width: 14px;
height: 14px;
}
.nuvemtags {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 1px -1648px;
width: 16px;
border: 1px solid #DCDCDC;
}
.zoomAnterior {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1675px;
width: 10px;
height: 11px;
cursor: pointer;
}
.zoomProximo {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1700px;
width: 10px;
height: 11px;
cursor: pointer;
}
.i3geo_refresh2 {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1749px;
width: 18px;
height: 20px;
cursor: pointer;
}
.conectarwmst {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 1px -1824px;
width: 16px;
border: 1px solid #DCDCDC;
}
.fonte {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1850px;
width: 9px;
height: 9px;
cursor: pointer;
}
#zoomiauto {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1875px;
cursor: pointer;
}
#zoomoauto {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1900px;
cursor: pointer;
}
#olhoAberto, .olhoAberto {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1925px;
cursor: pointer;
width: 25px;
height: 20px;
}
#olhoFechado, .olhoFechado {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -1949px;
width: 25px;
height: 20px;
cursor: pointer;
}
.carouselTemas {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2000px;
width: 16px;
border: 1px solid #DCDCDC;
cursor: pointer;
}
.uploadgpx {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2052px;
width: 16px;
border: 1px solid #DCDCDC;
cursor: pointer;
}
#i3geo_filtro, .i3geo_filtro {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2073px;
width: 18px;
height: 18px;
}
#abreJanelaLegenda, .abreJanelaLegenda {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2100px;
cursor: pointer;
width: 22px;
height: 22px;
}
#soltaLeg, .soltaLeg {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2100px;
cursor: pointer;
width: 22px;
height: 22px;
}
#soltaLeg2, .soltaLeg2 {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2125px;
cursor: pointer;
width: 20px;
height: 16px;
}
#soltaleg2, .soltaleg2 {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2123px;
cursor: pointer;
width: 18px;
height: 18px;
}
#opacidadeMapa, .opacidadeMapa {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2173px;
cursor: pointer;
width: 18px;
height: 18px;
}
#imprimirMapa, .imprimirMapa {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2250px;
cursor: pointer;
width: 18px;
height: 18px;
}
#ajudaMapa, .ajudaMapa {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 1px -500px;
cursor: pointer;
width: 18px;
height: 18px;
}
#ferramentasMapa, .ferramentasMapa {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2272px;
cursor: pointer;
width: 18px;
height: 18px;
}
#animaMapa, .animaMapa {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2187px;
cursor: pointer;
width: 18px;
height: 18px;
}
.importarwmc {
background-image: URL('../imagens/sprite.png');
background-repeat: no-repeat;
background-position: 0px -2140px;
border: 1px solid #DCDCDC;
cursor: pointer;
width: 16px;
}
button { //
background: url(../imagens/tic2.png) 99% 50% no-repeat;
}
#encolheFerramentas {
background-image: URL('../imagens/encolhe.png');
background-repeat: no-repeat;
background-position: center;
cursor: pointer;
}
.iconeGuiaMovel {
padding: 2px;
border-radius: 5px 5px 5px 5px;
background-image: none;
border: solid 1px gray;
box-shadow: 0px 1px 3px lightgray;
cursor: pointer;
widh: 40px;
height: 40px;
background-color: rgba(0,60,136,.5);
}
#i3GEOguiaMovel .iconeGuiaMovel{
padding: 3px 0px;
}
.iconeMini {
border-radius: 5px 5px 5px 5px;
border: solid 1px gray;
margin: 2px;
}
.iconeGuiaMovelMouseOver {
box-shadow: 0px 1px 3px #3CA5EB;
}
.iconeGuiaMovelMouseOut {
box-shadow: 0px 1px 3px gray;
}
#euDock_euImage_2 {
border: 0px solid lightgray;
border-radius: 35px 0px 0px 5px;
opacity: 0.6;
background: black;
background: rgb(181, 189, 200);
background: -moz-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(181,
189, 200, 1)), color-stop(36%, rgba(130, 140, 149, 1)),
color-stop(100%, rgba(40, 52, 59, 1)));
background: -webkit-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -o-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -ms-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: linear-gradient(to bottom, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient(  startColorstr='#b5bdc8',
endColorstr='#28343b', GradientType=0);
}
#euDock_euImage_3 {
border: 0px solid lightgray;
opacity: 0.6;
background: black;
background: rgb(181, 189, 200);
background: -moz-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(181,
189, 200, 1)), color-stop(36%, rgba(130, 140, 149, 1)),
color-stop(100%, rgba(40, 52, 59, 1)));
background: -webkit-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -o-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -ms-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: linear-gradient(to bottom, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient(  startColorstr='#b5bdc8',
endColorstr='#28343b', GradientType=0);
}
#euDock_euImage_4 {
border: 0px solid lightgray;
border-radius: 0px 35px 5px 0px;
opacity: 0.6;
background: black;
background: rgb(181, 189, 200);
background: -moz-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(181,
189, 200, 1)), color-stop(36%, rgba(130, 140, 149, 1)),
color-stop(100%, rgba(40, 52, 59, 1)));
background: -webkit-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -o-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: -ms-linear-gradient(top, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
background: linear-gradient(to bottom, rgba(181, 189, 200, 1) 0%,
rgba(130, 140, 149, 1) 36%, rgba(40, 52, 59, 1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient(  startColorstr='#b5bdc8',
endColorstr='#28343b', GradientType=0);
}
#euDock_0 img {
}
#euDockMensagem {
font-weight: bold;
color: white;
margin-top: 5px;
font-size: 11px;
top: 33px;
}
.eudockImagemBottom {
box-shadow: 0 10px 5px -10px gray;
}
.eudockImagemTop {
}
/* icones das ferramentas utilizado nas janelas flutuantes e menu suspenso */
.i3GEOiconeFerramenta {
display: block;
height: 16px;
width: 16px;
position: absolute;
left: 2px;
}
.hd .i3GEOiconeFerramenta{
top: 5px;
}
.i3GEOiconeMais{
background-image: url("../imagens/oxygen/16x16/draw-cross.png");
width: 16px;
height: 16px;
float: left;
cursor: pointer;
}
.i3GEOiconeFerramentas{
background-image: url("../imagens/oxygen/16x16/configure-shortcuts.png");
width: 16px;
height: 16px;
float: left;
cursor: pointer;
}
.i3GEOiconeAberto {
background-image: URL('../imagens/oxygen/16x16/document-decrypt.png');
cursor: pointer;
background-repeat: no-repeat;
width: 16px;
height: 16px;
float: left;
}
.i3GEOiconeFechado {
background-image: URL('../imagens/oxygen/16x16/document-encrypt.png');
cursor: pointer;
background-repeat: no-repeat;
width: 16px;
height: 16px;
float: left;
}
.i3GEOiconeXis {
background-image: url("../imagens/oxygen/16x16/edit-delete.png");
cursor: pointer;
}
.i3GEOiconewkt2layer{
background-image: URL('../imagens/gisicons/layer.png');
background-size: 16px;
}
.i3GEOiconeMascara{
background-image: URL('../imagens/gisicons/layer-show.png');
background-size: 16px;
}
.i3GEOiconemmscale{
background-image: URL('../imagens/oxygen/16x16/graphics-viewer-document.png');
}
.i3GEOiconeOpacidadeMapa {
background-image: URL('../imagens/oxygen/16x16/show-menu.png');
}
.i3GEOiconeAnimacao {
background-image: URL('../imagens/oxygen/16x16/tool-animator.png');
}
.i3GEOiconeSelecao {
background-image: URL('../imagens/oxygen/16x16/edit-select.png');
}
.i3GEOiconeCatalogo {
background-image: URL('../imagens/oxygen/16x16/x-office-address-book.png');
}
.i3GEOiconeFiltro {
background-image: URL('../imagens/oxygen/16x16/view-filter.png');
}
.i3GEOiconeBusca {
background-image: URL('../imagens/oxygen/16x16/edit-find.png');
}
.i3GEOiconeCongela {
background-image: URL('../imagens/oxygen/16x16/knotes.png');
}
.i3GEOiconeAutoredesenha {
background-image: URL('../imagens/oxygen/16x16/user-away.png');
}
.i3GEOiconeVinde {
background-image: URL('../imagens/oxygen/16x16/application-x-smb-workgroup.png');
}
.i3GEOiconeGeoLocal {
background-image: URL('../imagens/oxygen/16x16/pda.png');
}
.i3GEOiconeInserexy {
background-image: URL('../imagens/oxygen/16x16/edit-node.png');
}
.i3GEOiconeCliqueTexto {
background-image: URL('../imagens/oxygen/16x16/preferences-desktop-font.png');
}
.i3GEOiconeImprimir {
background-image: URL('../imagens/oxygen/16x16/document-print.png');
}
.i3GEOiconeTipoImg {
background-image: URL('../imagens/oxygen/16x16/image-x-generic.png');
}
.i3GEOiconeColorchooser {
background-image: URL('../imagens/oxygen/16x16/kcolorchooser.png');
}
.i3GEOiconeGraticule {
background-image: URL('../imagens/gisicons/graticule.png');
}
.i3GEOiconeTabela {
background-image: URL('../imagens/oxygen/16x16/view-form-table.png');
}
.i3GEOiconeToponimia {
background-image: URL('../imagens/oxygen/16x16/draw-text.png');
}
.i3GEOiconeEtiqueta {
background-image: URL('../imagens/oxygen/16x16/feed-subscribe.png');
}
.i3GEOiconeLegenda {
background-image: URL('../imagens/oxygen/16x16/format-list-unordered.png');
}
.i3GEOiconeCortina {
background-image: URL('../imagens/oxygen/16x16/kmix-master.png');
}
.i3GEOiconeGrTema {
background-image: URL('../imagens/gisicons/layer-vector-chart-add.png');
background-size: 16px;
}
.i3GEOiconeGrafico {
background-image: URL('../imagens/oxygen/16x16/view-statistics.png');
}
.i3GEOiconeCartograma {
background-image: URL('../imagens/gisicons/layer-vector-thematic-add.png');
background-size: 16px;
}
.i3GEOiconeAplicStat {
background-image: URL('../imagens/oxygen/16x16/text-mathml.png');
}
.i3GEOiconeTme {
background-image: URL('../imagens/3d.png');
background-size: 16px;
}
.i3GEOiconeStorymap {
background-image: URL('../imagens/oxygen/16x16/kmplayer.png');
background-size: 16px;
}
.i3GEOiconeAnimagif {
background-image: URL('../imagens/oxygen/16x16/tool-animator.png');
background-size: 16px;
}
.i3GEOiconeCliqueGrafico {
background-image: URL('../imagens/oxygen/16x16/flag-red.png');
background-size: 16px;
}
.i3GEOiconeAdd {
background-image: URL('../imagens/gisicons/layer-add.png');
background-size: 16px;
}
.i3GEOiconeImport {
background-image: URL('../imagens/gisicons/layer-import.png');
background-size: 16px;
}
.i3GEOiconeUpload {
background-image: URL('../imagens/oxygen/16x16/svn-commit.png');
}
.i3GEOiconeEditar {
width: 16px;
height: 16px;
border: 0;
box-shadow: none;
line-height: 1.5;
-webkit-appearance: none;
-moz-appearance: none;
text-indent: 0.01px;
text-overflow: '';
font-size: 12px;
appearance: none;
background: transparent url("../imagens/gisicons/edit2.png") no-repeat scroll;
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
background: transparent url("../imagens/gisicons/edit2.png") no-repeat scroll;
background-size: 16px 16px;
}
}
#i3GEOiconeEditarHover:hover + div{
display: block;
}
/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
body{font:13px/1.231 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small}select,input,textarea,button{font:99% arial,helvetica,clean,sans-serif}table{font-size:inherit;font:100%}pre,code,kbd,samp,tt{font-family:monospace;*font-size:108%;line-height:100%}
/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
.yui-overlay,.yui-panel-container{visibility:hidden;position:absolute;z-index:2}.yui-panel{position:relative}.yui-panel-container form{margin:0}.mask{z-index:1;display:none;position:absolute;top:0;left:0;right:0;bottom:0}.mask.block-scrollbars{overflow:auto}.masked select,.drag select,.hide-select select{_visibility:hidden}.yui-panel-container select{_visibility:inherit}.hide-scrollbars,.hide-scrollbars *{overflow:hidden}.hide-scrollbars select{display:none}.show-scrollbars{overflow:auto}.yui-panel-container.show-scrollbars,.yui-tt.show-scrollbars{overflow:visible}.yui-panel-container.show-scrollbars .underlay,.yui-tt.show-scrollbars .yui-tt-shadow{overflow:auto}.yui-panel-container.shadow .underlay.yui-force-redraw{padding-bottom:1px}.yui-effect-fade .underlay,.yui-effect-fade .yui-tt-shadow{display:none}.yui-tt-shadow{position:absolute}.yui-override-padding{padding:0!important}.yui-panel-container .container-close{overflow:hidden;text-indent:-10000em;text-decoration:none}.yui-overlay.yui-force-redraw,.yui-panel-container.yui-force-redraw{margin-bottom:1px}.yui-skin-sam .mask{background-color:#000;opacity:.25;filter:alpha(opacity=25)}.yui-skin-sam .yui-panel-container{padding:0 1px;*padding:2px}.yui-skin-sam .yui-panel{position:relative;left:0;top:0;border-style:solid;border-width:1px 0;border-color:#808080;z-index:1;*border-width:1px;*zoom:1;_zoom:normal}.yui-skin-sam .yui-panel .hd,.yui-skin-sam .yui-panel .bd,.yui-skin-sam .yui-panel .ft{border-style:solid;border-width:0 1px;border-color:#808080;margin:0 -1px;*margin:0;*border:0}.yui-skin-sam .yui-panel .hd{border-bottom:solid 1px #ccc}.yui-skin-sam .yui-panel .bd,.yui-skin-sam .yui-panel .ft{background-color:#f2f2f2}.yui-skin-sam .yui-panel .hd{padding:0 10px;font-size:93%;line-height:2;*line-height:1.9;font-weight:bold;color:#000;background:url(../../../../assets/skins/sam/sprite.png) repeat-x 0 -200px}.yui-skin-sam .yui-panel .bd{padding:10px}.yui-skin-sam .yui-panel .ft{border-top:solid 1px #808080;padding:5px 10px;font-size:77%}.yui-skin-sam .container-close{position:absolute;top:5px;right:6px;width:25px;height:15px;background:url(../../../../assets/skins/sam/sprite.png) no-repeat 0 -300px;cursor:pointer}.yui-skin-sam .yui-panel-container .underlay{right:-1px;left:-1px}.yui-skin-sam .yui-panel-container.matte{padding:9px 10px;background-color:#fff}.yui-skin-sam .yui-panel-container.shadow{_padding:2px 4px 0 2px}.yui-skin-sam .yui-panel-container.shadow .underlay{position:absolute;top:2px;left:-3px;right:-3px;bottom:-3px;*top:4px;*left:-1px;*right:-1px;*bottom:-1px;_top:0;_left:0;_right:0;_bottom:0;_margin-top:3px;_margin-left:-1px;background-color:#000;opacity:.12;filter:alpha(opacity=12)}.yui-skin-sam .yui-dialog .ft{border-top:0;padding:0 10px 10px 10px;font-size:100%}.yui-skin-sam .yui-dialog .ft .button-group{display:block;text-align:right}.yui-skin-sam .yui-dialog .ft button.default{font-weight:bold}.yui-skin-sam .yui-dialog .ft span.default{border-color:#304369;background-position:0 -1400px}.yui-skin-sam .yui-dialog .ft span.default .first-child{border-color:#304369}.yui-skin-sam .yui-dialog .ft span.default button{color:#fff}.yui-skin-sam .yui-dialog .ft span.yui-button-disabled{background-position:0 -1500px;border-color:#ccc}.yui-skin-sam .yui-dialog .ft span.yui-button-disabled .first-child{border-color:#ccc}.yui-skin-sam .yui-dialog .ft span.yui-button-disabled button{color:#a6a6a6}.yui-skin-sam .yui-simple-dialog .bd .yui-icon{background:url(../../../../assets/skins/sam/sprite.png) no-repeat 0 0;width:16px;height:16px;margin-right:10px;float:left}.yui-skin-sam .yui-simple-dialog .bd span.blckicon{background-position:0 -1100px}.yui-skin-sam .yui-simple-dialog .bd span.alrticon{background-position:0 -1050px}.yui-skin-sam .yui-simple-dialog .bd span.hlpicon{background-position:0 -1150px}.yui-skin-sam .yui-simple-dialog .bd span.infoicon{background-position:0 -1200px}.yui-skin-sam .yui-simple-dialog .bd span.warnicon{background-position:0 -1900px}.yui-skin-sam .yui-simple-dialog .bd span.tipicon{background-position:0 -1250px}.yui-skin-sam .yui-tt .bd{position:relative;top:0;left:0;z-index:1;color:#000;padding:2px 5px;border-color:#d4c237 #A6982b #a6982b #A6982B;border-width:1px;border-style:solid;background-color:#ffee69}.yui-skin-sam .yui-tt.show-scrollbars .bd{overflow:auto}.yui-skin-sam .yui-tt-shadow{top:2px;right:-3px;left:-3px;bottom:-3px;background-color:#000}.yui-skin-sam .yui-tt-shadow-visible{opacity:.12;filter:alpha(opacity=12)}
div.olMap {
z-index: 0;
padding: 0px!important;
margin: 0px!important;
cursor: default;
}
div.olMapViewport {
text-align: left;
}
div.olLayerDiv {
-moz-user-select: none;
}
.olLayerGoogleCopyright {
left: 2px;
bottom: 2px;
}
.olLayerGooglePoweredBy {
left: 2px;
bottom: 15px;
}
.olControlAttribution {
font-size: smaller;
right: 3px;
bottom: 4.5em;
position: absolute;
display: block;
}
.olControlScale {
right: 3px;
bottom: 3em;
display: block;
position: absolute;
font-size: smaller;
}
.olControlScaleLine {
left: 10px;
bottom: 15px;
font-size: xx-small;
}
.olControlScaleLineBottom {
border: solid 2px black;
border-bottom: none;
margin-top:-2px;
text-align: center;
}
.olControlScaleLineTop {
border: solid 2px black;
border-top: none;
text-align: center;
}
.olControlPermalink {
right: 3px;
bottom: 1.5em;
display: block;
position: absolute;
font-size: smaller;
}
div.olControlMousePosition {
bottom: 0em;
right: 3px;
display: block;
position: absolute;
font-family: Arial;
font-size: smaller;
}
.olControlOverviewMapContainer {
position: absolute;
bottom: 0px;
right: 0px;
}
.olControlOverviewMapElement {
padding: 10px 18px 10px 10px;
background-color: #00008B;
-moz-border-radius: 1em 0 0 0;
}
.olControlOverviewMapMinimizeButton {
right: 0px;
bottom: 80px;
}
.olControlOverviewMapMaximizeButton {
right: 0px;
bottom: 80px;
}
.olControlOverviewMapExtentRectangle {
overflow: hidden;
background-image: url("img/blank.gif");
cursor: move;
border: 2px dotted red;
}
.olControlOverviewMapRectReplacement {
overflow: hidden;
cursor: move;
background-image: url("img/overview_replacement.gif");
background-repeat: no-repeat;
background-position: center;
}
.olLayerGeoRSSDescription {
float:left;
width:100%;
overflow:auto;
font-size:1.0em;
}
.olLayerGeoRSSClose {
float:right;
color:gray;
font-size:1.2em;
margin-right:6px;
font-family:sans-serif;
}
.olLayerGeoRSSTitle {
float:left;font-size:1.2em;
}
.olPopupContent {
padding:5px;
overflow: auto;
}
.olControlNavToolbar {
width:0px;
height:0px;
}
.olControlNavToolbar div {
display:block;
width:  28px;
height: 28px;
top: 300px;
left: 6px;
position: relative;
}
.olControlNavigationHistory {
background-image: url("img/navigation_history.png");
background-repeat: no-repeat;
width:  24px;
height: 24px;
}
.olControlNavigationHistoryPreviousItemActive {
background-position: 0px 0px;
}
.olControlNavigationHistoryPreviousItemInactive {
background-position: 0px -24px;
}
.olControlNavigationHistoryNextItemActive {
background-position: -24px 0px;
}
.olControlNavigationHistoryNextItemInactive {
background-position: -24px -24px;
}
.olControlNavToolbar .olControlNavigationItemActive {
background-image: url("img/panning-hand-on.png");
background-repeat: no-repeat;
}
.olControlNavToolbar .olControlNavigationItemInactive {
background-image: url("img/panning-hand-off.png");
background-repeat: no-repeat;
}
.olControlNavToolbar .olControlZoomBoxItemActive {
background-image: url("img/drag-rectangle-on.png");
background-color: orange;
background-repeat: no-repeat;
}
.olControlNavToolbar .olControlZoomBoxItemInactive {
background-image: url("img/drag-rectangle-off.png");
background-repeat: no-repeat;
}
.olControlEditingToolbar  {
float:right;
right: 0px;
height: 30px;
width: 200px;
}
.olControlEditingToolbar div {
background-image: url("img/editing_tool_bar.png");
background-repeat: no-repeat;
float:right;
width:  24px;
height: 24px;
margin: 5px;
}
.olControlEditingToolbar .olControlNavigationItemActive {
background-position: -103px -23px;
}
.olControlEditingToolbar .olControlNavigationItemInactive {
background-position: -103px -0px;
}
.olControlEditingToolbar .olControlDrawFeaturePointItemActive {
background-position: -77px -23px;
}
.olControlEditingToolbar .olControlDrawFeaturePointItemInactive {
background-position: -77px -0px;
}
.olControlEditingToolbar .olControlDrawFeaturePathItemInactive {
background-position: -51px 0px;
}
.olControlEditingToolbar .olControlDrawFeaturePathItemActive {
background-position: -51px -23px;
}
.olControlEditingToolbar .olControlDrawFeaturePolygonItemInactive {
background-position: -26px 0px;
}
.olControlEditingToolbar .olControlDrawFeaturePolygonItemActive {
background-position: -26px -23px ;
}
.olControlSaveFeaturesItemActive {
background-image: url(img/save_features_on.png);
background-repeat: no-repeat;
background-position: 0px 1px;
}
.olControlSaveFeaturesItemInactive {
background-image: url(img/save_features_off.png);
background-repeat: no-repeat;
background-position: 0px 1px;
}
.olHandlerBoxZoomBox {
border: 2px solid red;
position: absolute;
background-color: white;
opacity: 0.50;
font-size: 1px;
filter: alpha(opacity=50);
}
.olHandlerBoxSelectFeature {
border: 2px solid blue;
position: absolute;
background-color: white;
opacity: 0.50;
font-size: 1px;
filter: alpha(opacity=50);
}
.olControlPanPanel {
top: 10px;
left: 5px;
}
.olControlPanPanel div {
background-image: url(img/pan-panel.png);
height: 18px;
width: 18px;
cursor: pointer;
position: absolute;
}
.olControlPanPanel .olControlPanNorthItemInactive {
top: 0px;
left: 9px;
background-position: 0px 0px;
}
.olControlPanPanel .olControlPanSouthItemInactive {
top: 36px;
left: 9px;
background-position: 18px 0px;
}
.olControlPanPanel .olControlPanWestItemInactive {
position: absolute;
top: 18px;
left: 0px;
background-position: 0px 18px;
}
.olControlPanPanel .olControlPanEastItemInactive {
top: 18px;
left: 18px;
background-position: 18px 18px;
}
.olControlZoomPanel {
top: 71px;
left: 14px;
}
.olControlZoomPanel div {
background-image: url(img/zoom-panel.png);
position: absolute;
height: 18px;
width: 18px;
cursor: pointer;
}
.olControlZoomPanel .olControlZoomInItemInactive {
top: 0px;
left: 0px;
background-position: 0px 0px;
}
.olControlZoomPanel .olControlZoomToMaxExtentItemInactive {
top: 18px;
left: 0px;
background-position: 0px -18px;
}
.olControlZoomPanel .olControlZoomOutItemInactive {
top: 36px;
left: 0px;
background-position: 0px 18px;
}
.olPopupCloseBox {
background: url("img/close.gif") no-repeat;
cursor: pointer;
}
.olFramedCloudPopupContent {
padding: 5px;
overflow: auto;
}
.olControlNoSelect {
-moz-user-select: none;
}
/**
* Cursor styles
*/
.olCursorWait {
cursor: wait;
}
.olDragDown {
cursor: move;
}
.olDrawBox {
cursor: crosshair;
}
.olControlDragFeatureOver {
cursor: move;
}
.olControlDragFeatureActive.olControlDragFeatureOver.olDragDown {
cursor: -moz-grabbing;
}
/**
* Layer switcher
*/
.olControlLayerSwitcher {
position: absolute;
top: 35px;
right: 0px;
width: 20em;
font-family: sans-serif;
font-weight: bold;
margin-top: 3px;
margin-left: 3px;
margin-bottom: 3px;
font-size: smaller;
color: white;
background-color: transparent;
text-align:left;
}
.olControlLayerSwitcher .layersDiv {
padding-top: 5px;
padding-left: 10px;
padding-bottom: 5px;
padding-right: 75px;
background-color: black;
width: 100%;
height: 100%;
text-align:left;
}
.olControlLayerSwitcher .layersDiv .baseLbl,
.olControlLayerSwitcher .layersDiv .dataLbl {
margin-top: 3px;
margin-left: 3px;
margin-bottom: 3px;
text-align:left;
}
.olControlLayerSwitcher .layersDiv .baseLayersDiv,
.olControlLayerSwitcher .layersDiv .dataLayersDiv {
padding-left: 10px;
text-align:left;
}
.olControlLayerSwitcher .maximizeDiv,
.olControlLayerSwitcher .minimizeDiv {
top: 5px;
right: 0px;
text-align:left;
}
.olControlEditingToolbar1 .editorOLpanItemInactive {
background-position:-0px 0;
}
.olControlEditingToolbar1 .editorOLpanItemActive {
background-position:-0px -28px;
}
.olControlEditingToolbar1 .editorOLzoomboxItemInactive {
background-position:-29px 0;
}
.olControlEditingToolbar1 .editorOLzoomboxItemActive {
background-position:-29px -28px;
}
.olControlEditingToolbar1 .editorOLzoomtotItemInactive {
background-position:-58px 0;
}
.olControlEditingToolbar1 .editorOLzoomtotItemActive {
background-position:-58px -28px;
}
.olControlEditingToolbar1 .editorOLlegendaItemInactive {
background-position:-87px 0;
}
.olControlEditingToolbar1 .editorOLlegendaItemActive {
background-position:-87px -28px;
}
.olControlEditingToolbar1 .editorOLdistanciaItemInactive {
background-position:-116px 0;
}
.olControlEditingToolbar1 .editorOLdistanciaItemActive {
background-position:-116px -28px;
}
.olControlEditingToolbar1 .editorOLareaItemInactive {
background-position:-145px 0;
}
.olControlEditingToolbar1 .editorOLareaItemActive {
background-position:-145px -28px;
}
.olControlEditingToolbar1 .editorOLidentificaItemInactive {
background-position:-174px 0;
}
.olControlEditingToolbar1 .editorOLidentificaItemActive {
background-position:-174px -28px;
}
.olControlEditingToolbar1 .editorOLlinhaItemInactive {
background-position:-203px 0;
}
.olControlEditingToolbar1 .editorOLlinhaItemActive {
background-position:-203px -28px;
}
.olControlEditingToolbar1 .editorOLpontoItemInactive {
background-position:-232px 0;
}
.olControlEditingToolbar1 .editorOLpontoItemActive {
background-position:-232px -28px;
}
.olControlEditingToolbar1 .editorOLpoligonoItemInactive {
background-position:-261px 0;
}
.olControlEditingToolbar1 .editorOLpoligonoItemActive {
background-position:-261px -28px;
}
.olControlEditingToolbar1 .editorOLeditaItemInactive {
background-position:-290px 0;
}
.olControlEditingToolbar1 .editorOLeditaItemActive {
background-position:-290px -28px;
}
.olControlEditingToolbar1 .editorOLapagaItemInactive {
background-position:-319px 0;
}
.olControlEditingToolbar1 .editorOLapagaItemActive {
background-position:-319px -28px;
}
.olControlEditingToolbar1 .editorOLselecaoItemInactive {
background-position:-348px 0;
}
.olControlEditingToolbar1 .editorOLselecaoItemActive {
background-position:-348px -28px;
}
.olControlEditingToolbar1 .editorOLcapturaItemInactive {
background-position:-377px 0;
}
.olControlEditingToolbar1 .editorOLcapturaItemActive {
background-position:-377px -28px;
}
.olControlEditingToolbar1 .editorOLprocuraItemInactive {
background-position:-406px 0;
}
.olControlEditingToolbar1 .editorOLprocuraItemActive {
background-position:-406px -28px;
}
.olControlEditingToolbar1 .editorOLsalvaItemInactive {
background-position:-435px 0;
}
.olControlEditingToolbar1 .editorOLsalvaItemActive {
background-position:-435px -28px;
}
.olControlEditingToolbar1 .editorOLfechaItemInactive {
background-position:-464px 0;
}
.olControlEditingToolbar1 .editorOLfechaItemActive {
background-position:-464px -28px;
}
.olControlEditingToolbar1 .editorOLajudaItemInactive {
background-position:-493px 0;
}
.olControlEditingToolbar1 .editorOLajudaItemActive {
background-position:-493px -28px;
}
.olControlEditingToolbar1 .editorOLpropriedadesItemInactive {
background-position:-522px 0;
}
.olControlEditingToolbar1 .editorOLpropriedadesItemActive {
background-position:-522px -28px;
}
.olControlEditingToolbar1 .editorOLuniaoItemInactive {
background-position:-551px 0;
}
.olControlEditingToolbar1 .editorOLuniaoItemActive {
background-position:-551px -28px;
}
.olControlEditingToolbar1 .editorOLtoolsItemInactive {
background-position:-580px 0;
}
.olControlEditingToolbar1 .editorOLtoolsItemActive {
background-position:-580px -28px;
}
.olControlEditingToolbar1 .editorOLundoItemInactive {
background-position:-609px 0;
}
.olControlEditingToolbar1 .editorOLundoItemActive {
background-position:-609px -28px;
}
.olControlEditingToolbar1 .editorOLfrenteItemInactive {
background-position:-638px 0;
}
.olControlEditingToolbar1 .editorOLfrenteItemActive {
background-position:-638px -28px;
}
.olControlEditingToolbar1 .editorOLtextoItemInactive {
background-position:-667px 0;
}
.olControlEditingToolbar1 .editorOLtextoItemActive {
background-position:-667px -28px;
}
.olControlEditingToolbar1 .editorOLcortaItemInactive {
background-position:-696px 0;
}
.olControlEditingToolbar1 .editorOLcortaItemActive {
background-position:-696px -28px;
}
.olControlEditingToolbar1 .editorOLlistagItemInactive {
background-position:-725px 0;
}
.olControlEditingToolbar1 .editorOLlistagItemActive {
background-position:-725px -28px;
}
.olControlEditingToolbar1 .editorOLzoominItemActive {
background-position:-754px -28px;
}
.olControlEditingToolbar1 .editorOLzoominItemInactive {
background-position:-754px -0px;
}
.olControlEditingToolbar1 .editorOLzoomoutItemActive {
background-position:-783px -28px;
}
.olControlEditingToolbar1 .editorOLzoomoutItemInactive {
background-position:-783px -0px;
}
.olControlEditingToolbar1 .editorOLselecaoTudoItemActive {
background-position:-812px -28px;
}
.olControlEditingToolbar1 .editorOLselecaoTudoItemInactive {
background-position:-812px -0px;
}
.olControlEditingToolbar1 .editorOLnovaabaItemActive {
background-position:-841px -28px;
}
.olControlEditingToolbar1 .editorOLnovaabaItemInactive {
background-position:-841px -0px;
}
.olControlEditingToolbar1 .editorOLgridItemActive {
background-position:-870px -28px;
}
.olControlEditingToolbar1 .editorOLgridItemInactive {
background-position:-870px -0px;
}
.olControlEditingToolbar1 .editorOLimprimirItemActive {
background-position:-900px -28px;
}
.olControlEditingToolbar1 .editorOLimprimirItemInactive {
background-position:-900px -0px;
}
.olControlEditingToolbar1 {
width:790px;
float:right;
right: 0px;
}
.olControlEditingToolbar1 div {
background-image:url(openlayers.png);
background-repeat:no-repeat;
float:right;
right: 0px;
height:29px;
margin:2px;
width:29px;
}
@media print {
.olControlEditingToolbar1 {display:none !important;}
.olControlPanZoomBar {display:none !important;}
.maximizeDiv {display:none !important;}
.olControlOverviewMapMaximizeButton {display:none !important;}
.olControlMousePosition {display:none !important;}
}
pre{
font-family: Verdana, Arial, Helvetica, sans-serif;
font-size: 9px;
}
.yui-skin-sam .container-close {
background:transparent url(../pacotes/yui290/build/assets/skins/sam/sprite.png) no-repeat scroll 0 -300px;
cursor:pointer;
height:25px;
position:absolute;
right:1px;
top:3px;
width:25px;
z-index:2001;
opacity:.80;
filter:alpha(opacity=80);
}
.yui-skin-sam .yui-panel .hd {
background: none;
background-color: #F2F2F2;
color: #000000;
font-size: 93%;
font-weight: bold;
line-height: 2;
padding: 0 10px;
}

<?php if(extension_loaded('zlib')){ob_end_flush();}?>