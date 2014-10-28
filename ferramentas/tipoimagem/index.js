/*
Title: Op&ccedil;&otilde;es de filtro de imagem

Abre janela de op&ccedil;&otilde;es para defini&ccedil;&atilde;o do tipo de filtro de imagem que ser&aacute; aplicado ao mapa.

Veja:

<i3GEO.mapa.dialogo.tipoimagem>

Arquivo:

i3geo/ferramentas/tipoimagem/index.js.php

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
Classe: i3GEOF.tipoimagem
*/
i3GEOF.tipoimagem = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.tipoimagem.iniciaDicionario();
	},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.tipoimagem.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["asp"] = '"';
		return dicionario;
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.tipoimagem.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/tipoimagem/dicionario.js",
				"i3GEOF.tipoimagem.iniciaJanelaFlutuante()",
				"i3GEOF.tipoimagem.dicionario_script"
			);
		}
		else{
			i3GEOF.tipoimagem.iniciaJanelaFlutuante();
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
			var temp,f,b;

			$i(iddiv).innerHTML += i3GEOF.tipoimagem.html();
			b = new YAHOO.widget.Button(
				"i3GEOFtipoImagemListaDeFiltrosOk",
				{onclick:{fn: i3GEOF.tipoimagem.aplicar}}
			);
			b.addClass("rodar");
			temp = $i("i3GEOFtipoImagemListaDeFiltrosOk-button").style;
			temp.minHeight = "1.5em";
			temp.padding = "0px 5px";

			f = i3GEO.configura.tipoimagem;
			if(f == 'nenhum')
			{f = "";}
			$i("i3GEOFtipoImagemListaDeFiltros").value = f;

			var temp = function(retorno){
				g_legendaHTML = retorno.data.legenda;
			};
			i3GEO.php.criaLegendaHTML(temp,"","legendaseminput.htm");
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}

	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.tipoimagem.MUSTACHE, i3GEOF.tipoimagem.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.tipoimagem");
		};
		//cria a janela flutuante
		titulo = $trad("p2")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=1' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"310px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.tipoimagem",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.tipoimagem_corpo").style.backgroundColor = "white";
		$i("i3GEOF.tipoimagem_corpo").style.textAlign = "left";
		i3GEOF.tipoimagem.aguarde = $i("i3GEOF.tipoimagem_imagemCabecalho").style;
		i3GEOF.tipoimagem.inicia(divid);
	},
	/*
	Function: aplicar

	Aplica o filtro de imagem escolhido
	*/
	aplicar: function(){
		var filtro = $i("i3GEOFtipoImagemListaDeFiltros").value;
		if(filtro == "")
		{filtro = 'nenhum';}
		i3GEO.configura.tipoimagem = filtro;
		g_operacao = "outras";
		i3GEO.Interface.alteraParametroLayers("TIPOIMAGEM",filtro);
		i3GEO.Interface.openlayers.atualizaMapa();
	},
	/*
	Function: adicionar

	Adiciona um filtro na lista de filtros que ser&atilde;o aplicados
	*/
	adicionar: function(filtro){
		$i("i3GEOFtipoImagemListaDeFiltros").value = $i("i3GEOFtipoImagemListaDeFiltros").value+" "+filtro;
	}
};