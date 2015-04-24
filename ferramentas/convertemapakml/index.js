/*
Title: Converte um mapa em kml

Converte o mapa atual em KML. A convers&atilde;o &eacute; baseada na gera&ccedil;&atilde;o de um KML com a imagem do mapa sendo mostrada como um WMS.
O Kml cont&eacute;m o elemento GroundOverlay.

Veja:

<i3GEO.mapa.convertekml>

Arquivo:

i3geo/ferramentas/converteMapaKml/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

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
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.converteMapaKml
*/
i3GEOF.converteMapaKml = {
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.converteMapaKml.dicionario);
		//lista;
		//lista = i3GEO.arvoreDeCamadas.CAMADAS;
		//tema = lista[0].name;
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["parametrosMapfile"] = i3GEO.parametros.mapfile;
		dicionario["tema"] = "";
		return dicionario;
	},

	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Parametros:

	divid {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	*/
	html:function(divid) {
		var ins = Mustache.render(i3GEOF.converteMapaKml.MUSTACHE, i3GEOF.converteMapaKml.mustacheHash());
		$i(divid).innerHTML += ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		if($i("i3GEOF.converteMapaKml")){
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.converteMapaKml");
		};
		titulo = "<div class='i3GeoTituloJanela'>Kml<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=13' ><b> </b></a></div>";
		janela = i3GEO.janela.cria(
			"440px",
			"325px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.converteMapaKml",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.converteMapaKml.html(divid);
	}
};
