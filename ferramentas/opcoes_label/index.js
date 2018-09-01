/*
Title: Op&ccedil;&otilde;es de labels

Abre uma janela flutuante que permite definir as propriedades de elementos do tipo texto (LABELS)

Arquivo:

i3geo/ferramentas/opcoes_label/index.js.php

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
Classe: i3GEOF.proplabel
 */
i3GEOF.proplabel = {
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
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.proplabel.dicionario);
	    dicionario["locaplic"] = i3GEO.configura.locaplic;
	    dicionario["x15"] = $trad("x15");
	    dicionario["x14"] = $trad("x14");
	    return dicionario;
	},
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	 */
	criaJanelaFlutuante: function(conector){
	    i3GEOF.proplabel.iniciaDicionario(conector);
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia: function(iddiv,conector){
	    if(i3GEOF.proplabel.MUSTACHE == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_label/template_mst.html", function(template) {
		    i3GEOF.proplabel.MUSTACHE = template;
		    i3GEOF.proplabel.inicia(iddiv,conector);
		});
		return;
	    }
	    $i(iddiv).innerHTML = i3GEOF.proplabel.html(conector);
	    i3GEO.util.aplicaAquarela("i3GEOF.proplabel_corpo");
	    i3GEO.util.comboFontes("i3GEOproplabelListaFonte","i3GEOproplabelDivListaFonte","form-control");
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Parametros:

	conector - {boolean} insere ou n&atilde;o as op&ccedil;&otilde;es de conector de textos

	Retorno:

	String com o c&oacute;digo html
	 */
	html:function(conector){
	    var ins = Mustache.render(i3GEOF.proplabel.MUSTACHE, i3GEOF.proplabel.mustacheHash());
	    return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante: function(conector){
	    var minimiza,cabecalho,janela,divid,titulo;
	    if ($i("i3GEOF.proplabel")) {
		return;
	    }
	    //cria a janela flutuante
	    cabecalho = function(){
		i3GEOF.proplabel.ativaFoco();
	    };
	    minimiza = function(){
		i3GEO.janela.minimiza("i3GEOF.proplabel",200);
	    };
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad('propriedadesTexto',i3GEOF.proplabel.dicionario) + "</span></div>";
	    janela = i3GEO.janela.cria(
		    "360px",
		    "230px",
		    "",
		    "",
		    "",
		    titulo,
		    "i3GEOF.proplabel",
		    false,
		    "hd",
		    cabecalho,
		    minimiza,
		    "",
		    false,
		    "",
		    "",
		    "",
		    "",
		    ""
	    );
	    divid = janela[2].id;
	    i3GEOF.proplabel.aguarde = $i("i3GEOF.proplabel_imagemCabecalho").style;
	    $i("i3GEOF.proplabel_corpo").style.backgroundColor = "white";
	    i3GEOF.proplabel.inicia(divid,conector);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	 */
	ativaFoco: function(){
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	 */
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaPar

	Pega os parametros para montar a chamada ajax que cria ou testa a topon&iacute;mia
	 */
	pegaPar: function(){
	    if($i("i3GEOproplabelfundoc_i").value === "")
	    {$i("i3GEOproplabelfundoc_i").value = "off";}
	    if($i("i3GEOproplabelsombra_i").value === "")
	    {$i("i3GEOproplabelsombra_i").value = "off";}
	    if($i("i3GEOproplabelmascara_i").value === "")
	    {$i("i3GEOproplabelmascara_i").value = "off";}
	    if($i("i3GEOproplabelfrentes_i").value === "")
	    {$i("i3GEOproplabelfrentes_i").value = "off";}
	    var par = "&position="+$i("i3GEOproplabelposition_i").value +
	    "&partials="+$i("i3GEOproplabelpartials_i").value+
	    "&offsetx="+$i("i3GEOproplabeloffsetx_i").value+
	    "&offsety="+$i("i3GEOproplabeloffsety_i").value+
	    "&minfeaturesize="+$i("i3GEOproplabelminfeaturesize_i").value+
	    "&mindistance="+$i("i3GEOproplabelmindistance_i").value+
	    "&force="+$i("i3GEOproplabelforce_i").value+
	    "&shadowsizex="+$i("i3GEOproplabelfrentex_i").value+
	    "&shadowsizey="+$i("i3GEOproplabelfrentey_i").value+
	    "&cor="+$i("i3GEOproplabelfrente_i").value+
	    "&sombray="+$i("i3GEOproplabelsombray_i").value+
	    "&sombrax="+$i("i3GEOproplabelsombrax_i").value+
	    "&angulo="+$i("i3GEOproplabelangulo_i").value+
	    "&tamanho="+$i("i3GEOproplabeltamanho_i").value+
	    "&fonte="+$i("i3GEOproplabelListaFonte").value+
	    "&fundo="+$i("i3GEOproplabelfundoc_i").value+
	    "&sombra="+$i("i3GEOproplabelsombra_i").value+
	    "&outlinecolor="+$i("i3GEOproplabelmascara_i").value+
	    "&shadowcolor="+$i("i3GEOproplabelfrentes_i").value+
	    "&wrap="+$i("i3GEOproplabelwrap_i").value;
	    return par;
	},
	getParameters: function(){
	    var par = {
		    position: $i("i3GEOproplabelposition_i").value,
		    partials: $i("i3GEOproplabelpartials_i").value,
		    offsetx: $i("i3GEOproplabeloffsetx_i").value,
		    offsety: $i("i3GEOproplabeloffsety_i").value,
		    minfeaturesize: $i("i3GEOproplabelminfeaturesize_i").value,
		    mindistance: $i("i3GEOproplabelmindistance_i").value,
		    force: $i("i3GEOproplabelforce_i").value,
		    shadowsizex: $i("i3GEOproplabelfrentex_i").value,
		    shadowsizey: $i("i3GEOproplabelfrentey_i").value,
		    cor: $i("i3GEOproplabelfrente_i").value,
		    sombray: $i("i3GEOproplabelsombray_i").value,
		    sombrax: $i("i3GEOproplabelsombrax_i").value,
		    angulo: $i("i3GEOproplabelangulo_i").value,
		    tamanho: $i("i3GEOproplabeltamanho_i").value,
		    fonte: $i("i3GEOproplabelListaFonte").value,
		    fundo: $i("i3GEOproplabelfundoc_i").value,
		    sombra: $i("i3GEOproplabelsombra_i").value,
		    outlinecolor: $i("i3GEOproplabelmascara_i").value,
		    shadowcolor: $i("i3GEOproplabelfrentes_i").value,
		    wrap: $i("i3GEOproplabelwrap_i").value
	    };
	    if(par.i3GEOproplabelfundoc_i === "")
	    {par.i3GEOproplabelfundoc_i = "off";}
	    if(par.i3GEOproplabelsombra_i === "")
	    {par.i3GEOproplabelsombra_i = "off";}
	    if(par.i3GEOproplabelmascara_i === "")
	    {par.i3GEOproplabelmascara_i = "off";}
	    if(par.i3GEOproplabelfrentes_i === "")
	    {par.i3GEOproplabelfrentes_i = "off";}
	    return par;
	}
};