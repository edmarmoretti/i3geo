
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Converte um mapa em kml

Converte o mapa atual em KML. A convers&atilde;o &eacute; baseada na gera&ccedil;&atilde;o de um KML com a imagem do mapa sendo mostrada como um WMS.
O Kml cont&eacute;m o elemento GroundOverlay.

Veja:

<i3GEO.mapa.convertekml>

Arquivo:

i3geo/ferramentas/convertemapakml/index.js.php

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

	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.converteMapaKml.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.converteMapaKml.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/convertemapakml/dicionario.js",
				"i3GEOF.converteMapaKml.iniciaJanelaFlutuante()",
				"i3GEOF.converteMapaKml.dicionario_script"
			);
		}
		else{
			i3GEOF.converteMapaKml.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Parametros:

	divid {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	*/
	html:function(divid){
		var ins = "",lista,tema;
		lista = i3GEO.arvoreDeCamadas.CAMADAS;
		tema = lista[0].name;
		ins = '<p class="paragrafo" >Voc&ecirc; pode utilizar os endere&ccedil;os para visualizar o mapa atual em softwares que aceitam o formato kml,' +
		'como o <a href="http://earth.google.com/intl/pt/" target="_blank" > Google Earth</a>. O endere&ccedil;o de acesso &eacute; tempor&aacute;rio, ficando dispon&iacute;vel por determinado per&iacute;odo de tempo conforme definido pelo administrador do i3Geo.' +
		'<p class="paragrafo" >Clique <a href="'+i3GEO.configura.locaplic+'/documentacao/ajuda/googleearth.htm" target="blank" >aqui</a> para mais detalhes sobre como usar o link kml no Google Earth.' +
		'<p class="paragrafo" ><b>Kml baseado em um servico WMS: </b></p>' +
		'<p class="paragrafo" > <textarea cols="55" rows="3" style=cursor:pointer onclick="javascript:this.select()">' +
		i3GEO.configura.locaplic + '/pacotes/kmlmapserver/kmlservice.php?map='+i3GEO.parametros.mapfile+'&typename='+tema+'&request=kml</textarea></p>';
		ins += '<p class="paragrafo" >Voc&ecirc; pode tamb&eacute;m utilizar o link abaixo para mostrar a &aacute;rvore completa de temas no GoogleEarth (incluindo dados vetoriais)' +
		'<p class="paragrafo" ><textarea cols="55" rows="2" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/kml.php </textarea></p>';
		$i(divid).innerHTML += ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.converteMapaKml");
		};
		titulo = "Kml <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=13' >&nbsp;&nbsp;&nbsp;</a>";
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
