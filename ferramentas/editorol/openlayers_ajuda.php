<?php
include(dirname(__FILE__)."/../../versao.php");
include_once(dirname(__FILE__)."/../../classesphp/sani_request.php");
$completo = "block";
if(!empty($_GET["completo"]) && $_GET["completo"] == "none"){
	$completo = "none";
}
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<title></title>
<style>
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
	background-image:url(../../mashups/openlayers.png);
	background-repeat:no-repeat;
	float:right;
	right: 0px;
	height:29px;
	margin:2px;
	width:29px;
}
p,td
{
	text-align:left;
	border: 0px solid #FFFFFF;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	position:relative;
	font-size:14px;
	padding:2px;
}
.olControlEditingToolbar1 {
	height: 20px;
	left: 20px;
	position: relative;
	width: 90%;
	float: left;
}

</style>

</head>
<body>

<table class="olControlEditingToolbar1" >
	<tr>
		<td style=width:20px ><div class="editorOLprocuraItemInactive"></div></td>
		<td>Procure um elemento no tema que estiver ativo</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpanItemInactive"></div></td>
		<td>Clique e arraste um ponto no mapa para deslocar a regi&atilde;o vis&iacute;vel</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLzoomboxItemInactive"></div></td>
		<td>Desenhe um ret&acirc;ngulo no mapa para alterar a regi&atilde;o vis&iacute;vel</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLzoomtotItemInactive"></div></td>
		<td>Altere a abrang&ecirc;ncia do mapa para que a regi&atilde;o toda fique vis&iacute;vel</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLlegendaItemInactive"></div></td>
		<td>Veja a legenda do mapa</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLdistanciaItemInactive"></div></td>
		<td>Calcule a dist&acirc;ncia entre pontos indicados no mapa. Clique em v&aacute;rios lugares, tra&ccedil;ando uma linha. Para terminar, clique duas vezes sobre o mesmo ponto.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLareaItemInactive"></div></td>
		<td>Calcule a &aacute;rea de uma regi&atilde;o do mapa. Clique em v&aacute;rios pontos, tra&ccedil;ando uma figura. Para terminar, clique duas vezes sobre o mesmo ponto.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLidentificaItemInactive"></div></td>
		<td>Clique em um lugar no mapa para ver as informa&ccedil;&otilde;es descritivas. Ao ativar essa fun&ccedil;&atilde;o, se aberta uma telka com a lista de camadas, escolha qual camada do mapa ser&aacute; utilizada para obter os dados. No cabe&ccedil;alho dos resultados, aparecer&aacute; a op&ccedil;&atilde;o 'capturar'. Clique nela para obter a geometria encontrada. Essa geometria poder&aacute; ent&atilde;o ser editada.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLlinhaItemInactive"></div></td>
		<td>Digitalize uma nova linha. Clique em um nó inicial e nos v&eacute;rtices posteriores. Termine com um duplo clique.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpontoItemInactive"></div></td>
		<td>Digitalize um novo ponto</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpoligonoItemInactive"></div></td>
		<td>Digitalize um novo pol&iacute;gono. Clique em um nó inicial e nos v&eacute;rtices posteriores. Termine com um duplo clique. Pressione "shift" para desenhar com a m&atilde;o livre.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLeditaItemInactive"></div></td>
		<td>Edite uma geometria selecionada. Após ativar essa op&ccedil;&atilde;o, clique na geometria desejada para que as op&ccedil;&otilde;es de edi&ccedil;&atilde;o fiquem ativas. Clique e arraste o ponto ou v&eacute;rtice destacado ou pressione 'del' para apagar um ponto ou v&eacute;rtice indicado.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLtoolsItemInactive"></div></td>
		<td>Modifique as geometrias aplicando opera&ccedil;&otilde;es como uni&atilde;o, intersec&ccedil;&atilde;o, etc.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLselecaoItemInactive"></div></td>
		<td>Clique sobre uma geometria para selecion&aacute;-la. Utilize a tecla 'shift' para adicionar ou remover geometrias de um conjunto selecionado.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLapagaItemInactive"></div></td>
		<td>Clique para apagar as geometrias selecionadas.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLundoItemInactive"></div></td>
		<td>Recupere a &uacute;ltima geometria apagada ou modificada.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLsalvaItemInactive"></div></td>
		<td>Converta para shapefile, salve ou obtenha as coordenadas das geometrias selecionadas.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLfrenteItemInactive"></div></td>
		<td>Traz a figura selecionada para a frente das demais.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpropriedadesItemInactive"></div></td>
		<td>Defina as propriedades de edi&ccedil;&atilde;o, como a dist&acirc;ncia de aproxima&ccedil;&atilde;o e outros comportamentos das opera&ccedil;&otilde;es. Defina tamb&eacute;m o comportamento da ferramenta de edi&ccedil;&atilde;o, permitindo alterar uma figura ou rotacion&aacute;-la, mov&ecirc;-la ou redimensionar.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLajudaItemInactive"></div></td>
		<td>Abre essa p&aacute;gina de ajuda.</td>
	</tr>
</table>
</body>
</html>