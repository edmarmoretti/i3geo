/*
Title: opacidademapa

Altera a opacidade de todas as camadas existentes no mapa modificando o estilo.

O Mapfile n&atilde;o &eacute; alterado, apenas o estilo dos elementos HTML.

Veja:

<i3GEO.tema.dialogo.opacidademapa>

Arquivo:

i3geo/ferramentas/opacidademapa/index.js.php

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
Classe: i3GEOF.opacidademapa
*/
i3GEOF.opacidademapa = {
	tema : i3GEO.temaAtivo,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: janela

	Janela flutuante criada

	Type:
	{YAHOO.panel}
	*/
	janela: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opacidademapa.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.opacidademapa.MUSTACHE == ""){
			var t1 = i3GEO.configura.locaplic + "/ferramentas/opacidademapa/template_mst.html";

			$.get(t1).done(function(r1) {
				i3GEOF.opacidademapa.MUSTACHE = r1;
				i3GEOF.opacidademapa.inicia(iddiv);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		}

		try{
			$i(iddiv).innerHTML = i3GEOF.opacidademapa.html();
			if (!$i("i3GEOFopacidademapaComboCabecaSel")) {
				i3GEO.janela.comboCabecalhoTemasBs("i3GEOFopacidademapaComboCabeca","i3GEOFopacidademapaComboCabecaSel","opacidademapa","ligados",function(evt){
					var botao = evt.target;
					if (botao) {
						if (botao.value != "") {
							i3GEO.mapa.ativaTema(botao.value);
							i3GEOF.opacidademapa.tema = botao.value;
							$i(iddiv).innerHTML = "";
							i3GEOF.opacidademapa.inicia(iddiv);
						} else {
							//$i(iddiv).innerHTML = "";
						}
					}
				});
			}
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		i3GEOF.opacidademapa.criaslide();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = Mustache.render(i3GEOF.opacidademapa.MUSTACHE, i3GEOF.opacidademapa.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro:

	mx {numero} - (opcional) posi&ccedil;&atilde;o em x para onde a janela ser&aacute; movida ap&oacute;s ser criada

	my {numero} - (opcional) posi&ccedil;&atilde;o em y para onde a janela ser&aacute; movida ap&oacute;s ser criada
	*/
	iniciaJanelaFlutuante: function(mx,my){
		if ($i("i3GEOF.opacidademapa")) {
			return;
		}
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opacidademapa",200);
		};
		var janela,divid,titulo;
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("t20")+"</span></div>";
		janela = i3GEO.janela.cria(
			"360px",
			"120px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opacidademapa",
			false,
			"hd",
			"",
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"102"
		);
		divid = janela[2].id;
		i3GEOF.opacidademapa.janela = janela[0];
		if(mx != undefined){
		    janela[0].moveTo(mx,my);
		}
		$i("i3GEOF.opacidademapa_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opacidademapa_corpo").style.textAlign = "left";
		i3GEOF.opacidademapa.aguarde = $i("i3GEOF.opacidademapa_imagemCabecalho").style;
		i3GEOF.opacidademapa.inicia(divid);
	},
	/*
	Function: criaslide

	Cria a barra deslizante
	*/
	criaslide: function(){
	    var opacidade = 1,
	        s = $i("i3GEOFopacidademapaSlide");

	    if(i3GEOF.opacidademapa.tema != ""){
    	    if(i3GEO.Interface.ATUAL == "openlayers"){
    	        opacidade = i3geoOL.getLayersByName(i3GEOF.opacidademapa.tema)[0].getOpacity();
    	    } else {
                opacidade = $(i3GEO.Interface.googlemaps.retornaDivLayer(camada.name)).css("opacity");
    	    }
	    }
	    s.value = opacidade;
	    s.onchange = function(e){
	        i3GEO.Interface.aplicaOpacidade(e.target.value,i3GEOF.opacidademapa.tema);
	    };
	}
};