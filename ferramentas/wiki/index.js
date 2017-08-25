/*
Title: Wikip&eacute;dia

Busca na Wikip&eacute;dia artigos relacionados a extens&atilde;o geogr&aacute;fica do mapa atual.

A busca utiliza um Web Service do site Geonames. Para utilizar esse servi&ccedil;o &eacute; necess&aacute;rio cadastrar um usu&aacute;rio.
Por padr&atilde;o, o i3Geo utiliza o usu&aacute;rio "i3geo", que pode ter sua cota de acesso di&aacute;rio ultrapassada.
Para criar um usu&aacute;rio novo, utilize o site http://www.geonames.org/login e edite o programa i3geo/ferramentas/wiki/funcoes.php
para alterar a vari&aacute;vel $usuarioGeonames

Veja:

<i3GEO.navega.dialogo.wiki>

Arquivo:

i3geo/ferramentas/wiki/index.js.php

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
Classe: i3GEOF.wiki
*/
i3GEOF.wiki = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.wiki.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.wiki.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/wiki/template_mst.html", function(template) {
				i3GEOF.wiki.MUSTACHE = template;
				i3GEOF.wiki.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.wiki.html();
			i3GEOF.wiki.ativaFoco();
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.wiki.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
   				wikiDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {i3GEOF.wiki.lista();});
   				wikiZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {i3GEOF.wiki.lista();});
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
   				wikiDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.wiki.lista();});
			}
			i3GEOF.wiki.lista();
		}
		catch(erro){if(typeof(console) !== 'undefined'){console.error(erro);}}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.wiki.MUSTACHE, i3GEOF.wiki.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		if ($i("i3GEOF.wiki")) {
			return;
		}
		cabecalho = function(){
			i3GEOF.wiki.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.wiki",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >Wikip&eacute;dia</span></div>";
		janela = i3GEO.janela.cria(
			"450px",
			"220px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.wiki",
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
			"73"
		);
		divid = janela[2].id;
		i3GEOF.wiki.aguarde = $i("i3GEOF.wiki_imagemCabecalho").style;
		i3GEOF.wiki.inicia(divid);
		temp = function(){
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.wiki.lista()"]);
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				google.maps.event.removeListener(wikiDragend);
				google.maps.event.removeListener(wikiZoomend);
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				google.earth.removeEventListener(wikiDragend);
			}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
	},
	/*
	Function: lista

	Lista os artigos

	Veja:

	<LISTAARTIGOS>
	*/
	lista: function(){
		if(i3GEOF.wiki.aguarde.visibility === "visible")
		{return;}
		i3GEOF.wiki.aguarde.visibility = "visible";
		var mostrar,p,cp;
		mostrar = function(retorno){
			i3GEOF.wiki.aguarde.visibility = "hidden";
			if (retorno.data === 'undefined' ){
				$i("i3GEOwikiLista").innerHTML = "Erro.";
				return;
			}
			$i("i3GEOwikiLista").innerHTML = retorno.data+$trad('atualizaNavegacao',i3GEOF.wiki.dicionario);
		};
		cp = new cpaint();
		cp.set_response_type("JSON");
		if(i3GEO.parametros.mapexten){
			ext = i3GEO.parametros.mapexten;
		}
		else{
			ext = "-49.1774741355 -16.379556709 -47.2737662565 -14.9806872512";
		} //apenas para exemplo
		p = i3GEO.configura.locaplic+"/ferramentas/wiki/funcoes.php?funcao=listaartigos&ret="+ext;
		cp.call(p,"listaartigos",mostrar);

	}
};