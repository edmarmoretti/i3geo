
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Wikip&eacute;dia

Busca na Wikip&eacute;dia artigos relacionados à extensão geogr&aacute;fica do mapa atual.

A busca utiliza um Web Service do site Geonames. Para utilizar esse servi&ccedil;o &eacute; necess&aacute;rio cadastrar um usu&aacute;rio.
Por padrão, o i3Geo utiliza o usu&aacute;rio "i3geo", que pode ter sua cota de acesso di&aacute;rio ultrapassada.
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
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
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
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.wiki.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.wiki.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/wiki/dicionario.js",
				"i3GEOF.wiki.iniciaJanelaFlutuante()",
				"i3GEOF.wiki.dicionario_script"
			);
		}
		else{
			i3GEOF.wiki.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.wiki.html();
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

	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEOwikiLista style=display:block;background-color:white;text-align:left; ></div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.wiki.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.wiki");
		};
		//cria a janela flutuante
		titulo = "Wikip&eacute;dia <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=73' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"250px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.wiki",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.wiki.aguarde = $i("i3GEOF.wiki_imagemCabecalho").style;
		i3GEOF.wiki.inicia(divid);
		temp = function(){
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.wiki.lista()");
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
		g_operacao = "navega";
		var i = $i("i3GEOF.wiki_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
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
				$i("i3GEOwikiLista").innerHTML = "Erro. A opera&ccedil;ão demorou muito.";
				return;
			}
			$i("i3GEOwikiLista").innerHTML = retorno.data+"Navegue no mapa para atualizar a lista de resultados";
		};
		cp = new cpaint();
		cp.set_response_type("JSON");
		if(i3GEO.parametros.mapexten)
		{ext = i3GEO.parametros.mapexten;}
		else
		{ext = "-49.1774741355 -16.379556709 -47.2737662565 -14.9806872512";} //apenas para exemplo
		p = i3GEO.configura.locaplic+"/ferramentas/wiki/funcoes.php?funcao=listaartigos&ret="+ext;
		cp.call(p,"listaartigos",mostrar);

	}
};
