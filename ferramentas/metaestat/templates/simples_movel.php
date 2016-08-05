<?php
include (dirname(__FILE__)."/../../../classesphp/sani_request.php");
/*
Template usado pelo sistema de publicacao de mapas do METAESTAT

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist�rio da Sa�de
Desenvolvedor: equipe da SAGE/MS http://189.28.128.178/sage/

Este programa � software livre; voc� pode redistribu�-lo
e/ou modific�-lo sob os termos da Licen�a P�blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa � distribu�do na expectativa de que seja �til,
por�m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl�cita
de COMERCIABILIDADE OU ADEQUA��O A UMA FINALIDADE ESPEC�FICA.
Consulte a Licen�a P�blica Geral do GNU para mais detalhes.
Voc� deve ter recebido uma c�pia da Licen�a P�blica Geral do
	GNU junto com este programa; se n�o, escreva para a
Free Software Foundation, Inc., no endere�o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
/*
 * Os seguintes elementos do mapa sao passados ao template
$dadosmapa = array(6) {
["id_mapa"]=>string(1) "1"
["titulo"]=>string(5) "teste"
["template"]=>string(0) ""
["logoesquerdo"]=>string(15) "escavadeira.png"
["logodireito"]=>string(0) ""
["publicado"]=>string(0) ""
}
*/
/*
 * Utilize <template>.php?id=
* Onde id � o identificador do mapa cadastrado no METAESTAT
*/

include("lib/dadosmapa.php");
$dadosmapa = dadosmapa("../../../");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Category"
	content="i3Geo Mapa interativo MS SAGE geoprocessamento sig mobile">
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=iso-8859-1">
<title>Cartogramas</title>
<style>
.banner {
	text-align: right;
	color: #004646;
	background-color: #F4F4F4;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	font-weight: bold;
	vertical-align: middle;
}
</style>
	<script src="../../../classesjs/i3geo.js"></script>
	<script src="../index.js"></script>
	<script src="../../../pacotes/openlayers/OpenLayers2131.js.php"></script>
	<script src="lib/configbasicoi3geo.js"></script>
	<script src="../dicionario.js"></script>
	<link rel="stylesheet" type="text/css" href="lib/default.css">
</head>
<body id="i3geo">
	<table width="100%" border="0" cellpadding="0" cellspacing="0"
		class="banner">
		<tr>
			<td class="banner"
				style="text-align: left; background-color: rgb(248, 248, 248)"><img
				src="logos/<?php echo $dadosmapa["logoesquerdo"];?>" height="70">
			</td>
		</tr>
	</table>
	<table id='mst' summary="" style='display: none;' width=100%
		cellspacing='0'>
		<tr style="border: 0px">
			<td height="2" id="barraSuperior"
				style="background-image: url('../../../imagens/cabeca.png'); height: 10px"></td>
		</tr>
		<tr>
			<td id="contemMenu"
				style="text-align: right; height: 0px; border-width: 0pt 0pt 1px; border-color: rgb(240, 240, 240)">
				<div id="menus"></div>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; border-width: 0px;">
				<table width="100%" style="vertical-align: top; border-width: 0px">
					<tr>
						<td class=verdeclaro id=contemImg>
							<div id=corpoMapa
								style="background-image: url('../../../imagens/i3geo1bw.jpg');"></div>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td class=tdbranca>
				<table width=100%>
					<tr>
						<td class=tdbranca style="width: 50%;">
							<div id=escala style="text-align: right; display: inline-table"></div>
						</td>
						<td class=tdbranca style="width: 50%;">
							<div id=localizarxy
								style="text-align: left; font-size: 10px; display: inline-table">Aguarde...</div>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr style="border: 0px">
			<td colspan=3 id="barraInferior"
				style="background-image: url('../../../imagens/rodape.png'); height: 10px"></td>
		</tr>
	</table>
	<table id="i3GEOlogoMarca"
		style='margin: 0px auto; box-shadow: 0 1px 13px gray; border-radius: 5px;'>
		<tr>
			<td><div id=versaoi3geo></div>
				<h2
					style="font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">i3Geo
					- Software livre para cria��o de mapas interativos e
					geoprocessamento</h2>
				<h3
					style="font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">Baseado
					no Mapserver, � licenciado sob GPL e integra o Portal do Software
					P�blico Brasileiro</h3></td>
		</tr>
		<tr>
			<td style="padding: 10px;"><img style="width: 560px; height: 81px"
				alt="" src='../../../imagens/logo_inicio.png'></td>
		</tr>
		<tr>
			<td></td>
		</tr>
	</table>
	<div id="i3geoCartoParametros_corpo"
		style="position: absolute; display: block; text-align: left; width: 248px;top: 110px;left: 80px;">
		<div id="i3geoCartoVariaveisContainer">
			<div class="paragrafo" id="i3geoCartoMedidasVariavel"></div>
			<div class="paragrafo" id="i3geoCartoParametrosMedidasVariavel"></div>
		</div>
		<input type="button" id="i3GEOcartoBotaoAdicionaCamada"
			value="Adicionar" class="paragrafo"
			style="width: 200px; cursor: pointer; color: blue" />
	</div>
	<div id="i3GEOguiaMovel"
		style="position: absolute; display: block; border: 0px solid white; text-align: left; z-index: 2000; background-color: none">
		<img id="i3GEOguiaMovelPuxador"
			onclick='i3GEO.guias.guiaMovel.abreFecha()'
			style='z-index: 2; border: solid 0px white; left: 0px; position: absolute; top: 0px'
			width='0px' src='../../../imagens/openbars.png'>
		<div id="i3GEOguiaMovelMolde"
			style="box-shadow: -2px 0 2px gray; border-radius: 5px 0px 0px 5px; position: absolute; display: none; border: 0px solid white; text-align: left; z-index: 1000; background-color: gray">
			<div id="i3GEOguiaMovelIcones"
				style='overflow: none; left: 0px; display: none; position: absolute; top: 0px; text-align: center; height: 0px; width: 0px; border: solid 0px white; background-color: white'></div>
			<div id="i3GEOguiaMovelConteudo"
				style='overflow: auto; display: none; position: absolute; border-color: gray; border-width: 0px 0 0px 0px; left: 0px; height: 0px; background-color: white'>
				<div id='guia1obj' style='display: none;'>
					<!-- Esta div acrescenta a op&ccedil;&atilde;o de busca r&aacute;pida, caso vc queira coloc&aacute;-la em um lugar espec&iacute;fico -->
					<div style='left: 5px; top: 10px;' id=buscaRapida></div>
					<!--	Esta div acrescenta a lista de propriedades do mapa -->
					<div id=listaPropriedades style='top: 15px;'></div>
					<!--	Esta div acrescenta a lista de de camadas do tipo 'baselayers' espec&iacute;ficas da interface Openlayers. Veja tamb&eacute;m a op&ccedil;&atilde;o i3GEO.Interface.openlayers.GADGETS.LayerSwitcher -->
					<div id=listaLayersBase style='top: 15px;'></div>
					<!--	Esta div acrescenta a lista de de camadas dispon&iacute;veis no mapa atual -->
					<div id=listaTemas style='top: 15px;'></div>
				</div>
				<div id='guia2obj' style='display: none;'>
					Aguarde...<img alt="" src="../imagens/branco.gif" width=248 />
				</div>
				<div id='guia4obj' style='display: none; text-align: left'>
					<div id='legenda' style='text-align: left'></div>
				</div>
				<div id='guia5obj' style='display: none; text-align: left'>
					<div id='banners' style='overflow: auto; text-align: left'>Aguarde...</div>
				</div>
			</div>
		</div>
	</div>

	<!-- utilizado pelo seletor de colourramp -->
	<input type=hidden value="" id="listaColourRampAnaliseMetaestat"
		onchange="i3GEOF.metaestat.analise.aplicaColourRamp()" />


	<script>
i3GEO.barraDeBotoes.OFFSET = 7;
i3GEO.barraDeBotoes.defBotao("localizar").funcaoonclick = function(){
	i3GEO.mapa.dialogo.locregiao();
};
i3GEO.configura.diminuiyN = 140;
i3GEO.configura.diminuiyM = 140;
i3GEO.cria();
i3GEO.configura.sid = "";
i3GEO.guias.TIPO = "movel";
i3GEO.guias.guiaMovel.config.topGuiaMovel = 0;
i3GEO.inicia();
//parametros especificos dos cartogramas
//ver i3geo/ferramentas/metaestat
i3GEOF.metaestat.CONEXAODEFAULT = 9;
i3GEOF.metaestat.TOP = 110;
i3GEOF.metaestat.LEFT = 100;

//i3GEOF.metaestat.LARGURA = 270;
//i3GEOF.metaestat.ALTURA = 300;
//
//define a funcao que sera executada ao clicar no mapa
//default (balao do tipo etiqueta)
i3GEO.eventos.MOUSECLIQUEPERM = [i3GEO.configura.funcaoTip];
//
//opcoes do publicador de mapas
//
i3GEOF.metaestat.INTERFACE = "";
i3GEOF.metaestat.publicador.IDMAPA = <?php echo $_GET["id"];?>;
i3GEOF.metaestat.inicia();
i3GEOF.metaestat.publicador.montaGrupos("i3geoCartoMedidasVariavel");
i3GEOF.metaestat.principal.botaoAdicionaCamada(150);
i3GEOF.metaestat.INTERFACE = "flutuante";
</script>
</body>
</html>
