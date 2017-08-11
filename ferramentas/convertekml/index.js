/*
Title: Converte um tema em kml

Mostra os endere&ccedil;os que permitem acessar o tema no formato KML. Essa ferramenta n&atilde;o processa os dados, apenas constr&oacute;i
os links para os programas que fazem a convers&atilde;o ou visualiza&ccedil;&atilde;o dos dados em KML vetorial ou do tipo GroundOverlay (via WMS)

Veja:

<i3GEO.tema.dialogo.abreKml>

Arquivo:

i3geo/ferramentas/converteKml/index.js.php

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
Classe: i3GEOF.converteKml
*/
i3GEOF.converteKml = {
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(tema,tipo){
		i3GEOF.converteKml.iniciaDicionario(tema,tipo);
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(tema,tipo){
		if(typeof(i3GEOF.converteKml.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/convertekml/dicionario.js",
				"i3GEOF.converteKml.iniciaJanelaFlutuante('"+tema+"','"+tipo+"')",
				"i3GEOF.converteKml.dicionario_script"
			);
		}
		else{
			i3GEOF.converteKml.iniciaJanelaFlutuante(tema,tipo);
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Parametros:

	divid {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	tema {String} - c&oacute;digo do tema

	tipo {String} - kml|kmz "kml" gera um link para acesso a um WMS e "kmz" gera um link que permite o acesso a um WMS e ao arquivo kmz vetorial

	*/
	html:function(divid,tema,tipo){
		var ins = '<p class="paragrafo" >'+$trad('ajuda',i3GEOF.converteKml.dicionario) +
		'<a href="http://earth.google.com/intl/pt/" target="_blank" > Google Earth</a>.' +
		'<p class="paragrafo" >Googleearth <a href="'+i3GEO.configura.locaplic+'/documentacao/ajuda/googleearth.htm" target="_blank" ></a> ' + $trad('ajuda2',i3GEOF.converteKml.dicionario) +
		'<p class="paragrafo" ><b>'+$trad('kmlWMS',i3GEOF.converteKml.dicionario) + '</b></p>' +
		'<p class="paragrafo" > <textarea cols="55" rows="3" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/pacotes/kmlmapserver/kmlservice.php?map='+tema+'&typename='+tema+'&request=kml</textarea></p>';
		if(tipo == "kmz"){
			ins += '<p class="paragrafo" ><b>'+$trad('kmzKML',i3GEOF.converteKml.dicionario)+' </b></p>' +
			'<p class="paragrafo" ><textarea cols="55" rows="3" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/pacotes/kmlmapserver/kmlservice.php?map='+tema+'&typename='+tema+'&request=kmz</textarea></p>';
		}
		ins += '<p class="paragrafo" >'+$trad('ajuda3',i3GEOF.converteKml.dicionario) +
		'<p class="paragrafo" ><textarea cols="55" rows="2" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/kml.php </textarea></p>';
		$i(divid).innerHTML += ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametros:

	tema {String} - c&oacute;digo do tema

	tipo {String} - kml|kmz "kml" gera um link para acesso a um WMS e "kmz" gera um link que permite o acesso a um WMS e ao arquivo kmz vetorial
	*/
	iniciaJanelaFlutuante: function(tema,tipo){
		var janela,divid,titulo;
		if($i("i3GEOF.converteKml")){
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.converteKml",200);
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >KML</span></div>";
		janela = i3GEO.janela.cria(
			"450px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.converteKml",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"81"
		);
		divid = janela[2].id;
		i3GEOF.converteKml.html(divid,tema,tipo);
	}
};
