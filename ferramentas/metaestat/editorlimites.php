<?php
/*
Title: Editor de limites geograficos do sistema de metadados estatisticos

Interface de mapa interativo com as opcoes de edicao vetorial dos limites das regioes cadastradas

Arquivo:

i3geo/ferramentas/metaestat/editorlimites.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
//error_reporting(0);
include_once(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Category" content="i3Geo Mapa interativo geoprocessamento sig mobile">
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<title>i3GEO - Editor de limites</title>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&libraries=drawing "></script>
<script type="text/javascript" src="../../classesjs/i3geo.js"></script>
<link rel="stylesheet" type="text/css" href="../../css/black.css">
<script src="editorlimites_dependencias.php"></script>
</head>

<body id="i3geo" style='margin-left: 7px; background: white;'>
	<!-- inclui o nome do usuario logado -->
	<div id="i3GEONomeLogin" style="position: absolute; left: 10px; top: 12px; font-size: 11px; z-index: 50000"></div>
	<table id='mst' summary="" style='display: none;' width=100% cellspacing='0'>
		<tr>
			<td id="contemMenu" style="background: black; height: 30px; text-align: right; border-width: 0pt 0pt 1px; border-color: rgb(240, 240, 240)">
				<!--menu suspenso-->
				<div id="menus" style="height: 30px;"></div>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; border-width: 0px;">
				<table width="100%" style="vertical-align: top; border-width: 0px">
					<tr>
						<td class=verdeclaro id=contemImg>
							<div id=googlemapsdiv style="position: relative; background-image: url('../../imagens/i3geo1bw.jpg');"></div>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<table style="width: 100%; height: 28px">
					<tr>
						<td class=fundoRodape style="width: 25%">
							<!-- aqui ser&aacute; inclu&iacute;da a escala num&eacute;rica -->
							<div id=escala style="margin: auto; text-align: right; left: 15px;"></div>
						</td>
						<td class=fundoRodape style="width: 5%"></td>
						<td class=fundoRodape style="width: 40%">
							<!-- aqui ser&aacute; inclu&iacute;do o gadget que mostra a coordenada geogr&aacute;fica da posi&ccedil;&atilde;o do mouse -->
							<div id=localizarxy style="margin: auto; text-align: left; font-size: 10px; display: inline-table"></div>
						</td>
						<td class=fundoRodape style="width: 20%">
							<!-- bot&atilde;o de compartilhamento em redes sociais-->
							<!--<div id=i3GEOcompartilhar style="width: 170px; margin: auto; text-align: left; padding-top: 1px"></div> -->
							<!-- aqui ser&aacute; inclu&iacute;do o contador de tempo quando o temporizador de redesenho do mapa estiver ativo -->
							<div id=tempoRedesenho style="z-index: 100; position: absolute; top: 0px; color: green; background-color: black; width: 50px; display: none"></div>
						</td>
						<!-- aqui ser&atilde;o inclu&iacute;das as bandeiras que permitem a troca de idioma -->
						<td class=fundoRodape style="width: 10%;">
							<div id=seletorIdiomas style="right: 15px;"></div>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	<table id="i3GEOlogoMarca" style='margin: 0px auto; box-shadow: 0 1px 13px gray; border-radius: 5px;'>
		<tr>
			<td><div id=versaoi3geo></div>
				<h2 style="font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">i3Geo - Software livre para cria&ccedil;&atilde;o de mapas interativos e geoprocessamento</h2>
				<h3 style="font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">Baseado no Mapserver, &eacute; licenciado sob GPL e integra o Portal do Software P&uacute;blico Brasileiro</h3></td>
		</tr>
		<tr>
			<td style="padding: 10px;"><img style="width: 560px; height: 81px" alt="" src='../../imagens/logo_inicio.png'></td>
		</tr>
		<tr>
			<td>
				<!--
			<script id="ohloh" type="text/javascript" src="http://www.ohloh.net/p/150688/widgets/project_users.js?style=red"></script>
			-->
			</td>
		</tr>
	</table>

<div id="i3GEOguiaMovel" style="visibility:hidden;position:absolute;display:block;border:0px solid white;text-align:left;z-index:2000;background-color:none">
	<div style="cursor:pointer;position:absolute;top:50%;margin-top: -65px;width:30px;z-index:5000; left:18px;">
		<div id="iconeGuia_temas" ></div>
		<div id="iconeGuia_adiciona" style="margin-top:3px;" ></div>
		<div id="iconeGuia_legenda" style="margin-top:3px;"></div>
	</div>

	<!--
		<img id="i3GEOguiaMovelPuxador" onclick='i3GEO.guias.guiaMovel.abreFecha()' style='z-index:2;border:solid 0px white;left:0px;position:absolute;top:0px' width='0px' src='../../imagens/openbars.png' >
	-->
	<div id="i3GEOguiaMovelMolde" style="top:0px;box-shadow:0 2px 10px 0 #888888;border-radius:5px 0px 0px 5px;position:absolute;display:none;border:0px solid white;text-align:left;z-index:1000;background-color:gray">
		<!--
		<div id="i3GEOguiaMovelIcones" style='overflow:none;left:0px;display:none;position:absolute;top:0px;text-align:center;height:0px;width:0px;border:solid 0px white;background-color:white' ></div>
		-->
		<div id="i3GEOguiaMovelConteudo" style='top:10px;overflow:auto;display:none;position:absolute;border-color:gray;border-width:0px 0 0px 0px;left:0px;height:0px;background-color:white'>
			<div id='guia1obj' style='display:none;' >
				<!-- Esta div acrescenta a op&ccedil;&atilde;o de busca r&aacute;pida, caso vc queira coloc&aacute;-la em um lugar espec&iacute;fico -->
				<div style='left:5px;top:10px;width:150px;' id=buscaRapida ></div>
				<!--	Esta div acrescenta a lista de de camadas dispon&iacute;veis no mapa atual -->
				<div id=listaTemas style='top:15px;'></div>
			</div>
			<div id='guia2obj' style='display:none;'>Aguarde...<img alt="" src="../../imagens/branco.gif" width=248 /></div>
			<div id='guia4obj' style='display:none;text-align:left'><div id='legenda' style='text-align:left'></div>
			<!--
			<div id='guia5obj' style='display:none;text-align:left'><div id='banners' style='overflow:auto;text-align:left'>Aguarde...</div></div>
			 -->
		</div>
	</div>
</div>
</div>
<script type="text/javascript">
i3GEO.configura.locaplic = i3GEO.util.protocolo()+"://"+window.location.host+"/i3geo";
i3GEO.configura.mashuppar = "mapext=-76.5125927 -39.3925675209 -29.5851853 9.49014852081";
i3GEO.Interface.ATUAL = "googlemaps";
i3GEO.Interface.IDCORPO = "contemImg";
i3GEO.configura.diminuixN = 20;

i3GEO.configura.autotamanho = false;
i3GEO.Interface.openlayers.TILES = true;
i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.finaliza = 'if($i("omenudataInterface1")){i3GEOoMenuBar.getMenuItem("omenudataInterface1").cfg.setProperty("text", " ");}';
i3GEO.cria();
i3GEO.configura.mapaRefDisplay = "none";
//ajusta o deslocamento da barra de botoes
i3GEO.barraDeBotoes.OFFSET = 11;
//ajusta a posicao da barra de botoes no IE
if(navm){
	i3GEO.barraDeBotoes.OFFSET = 5;
}
if(chro){
	i3GEO.barraDeBotoes.OFFSET = 15;
}

i3GEO.configura.oMenuData["submenus"]["janelas"] = [];
i3GEO.ajuda.ATIVAJANELA = false;
i3GEO.idioma.IDSELETOR = "seletorIdiomas";

//i3GEO.arvoreDeTemas.TIPOBOTAO = "radio";
i3GEO.arvoreDeTemas.OPCOESADICIONAIS.comentarios = true;
i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS = true;
i3GEO.arvoreDeCamadas.MOSTRALISTAKML = false;
i3GEO.arvoreDeCamadas.MOSTRATITULO = false;
i3GEO.mapa.AUTORESIZE = true;
i3GEO.guias.TIPO = "movel";
i3GEO.guias.guiaMovel.config.topGuiaMovel = 36;
i3GEO.janela.ativaAlerta();

//i3GEO.Interface.googlemaps.TIPOMAPA = "satellite";

i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir = true;
i3GEO.janela.TRANSICAOSUAVE = true;

i3GEO.finaliza = function(){
	if($i("i3GEOlogoMarca")){
		$i("i3GEOlogoMarca").style.display = "none";
	}
	i3GEO.mapa.insereDobraPagina("openlayers","../../imagens/dobraopenlayers.png");
};
i3GEO.finalizaAPI = function(){
	var cabecalho, minimiza;
	cabecalho = function() {
	};
	minimiza = function() {
		i3GEO.janela.minimiza("janelaEditorLimites");
	};
	janela = i3GEO.janela.cria("300px", "100px", "", "", "",
		"<div class='i3GeoTituloJanela'>Editor</div>", "janelaEditorLimites", false, "hd",
		cabecalho, minimiza);
	$i("janelaEditorLimites_corpo").style.backgroundColor = "white";
	i3GEO.editorGM.inicia("janelaEditorLimites_corpo");
	i3GEOF.locregiao.iniciaJanelaFlutuante();
	YAHOO.i3GEO.janela.manager.find("i3GEOF.locregiao").moveTo(100,40);
};
i3GEO.login.recarrega = false;
i3GEO.eventos.cliquePerm.ativo = false;

i3GEO.inicia();
</script>
</body>
</html>