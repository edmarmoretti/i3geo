/*
Title: Salva mapa

Faz o download do mapfile atualmente em uso. Posteriormente, o mapfile pode ser enviado de volta ao servidor para restaurar o mapa

Veja:

<i3GEO.mapa.dialogo.salvaMapa>

Arquivo: i3geo/ferramentas/salvamapa/index.js.php

About: Licen&ccedil;a

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
Classe: i3GEOF.salvaMapa
 */
i3GEOF.salvaMapa = {
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
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.salvaMapa.dicionario);
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			dicionario["sid"] = i3GEO.configura.sid;
			return dicionario;
		},
		/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia: function(iddiv){
			if(i3GEOF.salvaMapa.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/salvamapa/template_mst.html", function(template) {
					i3GEOF.salvaMapa.MUSTACHE = template;
					i3GEOF.salvaMapa.inicia(iddiv);
				});
				return;
			}

			var temp = function(dados){
				$i(iddiv).innerHTML = i3GEOF.salvaMapa.html();
			},
			atualiza = true,
			geo = false;
			if(i3GEO.Interface.ATUAL === "googlemaps" || i3GEO.Interface.ATUAL === "googleearth"){
				atualiza = false;
				geo = true;
			}
			i3GEO.php.mudaext(temp,"nenhum",i3GEO.parametros.mapexten,i3GEO.configura.locaplic,i3GEO.configura.sid,atualiza,geo);
		},
		/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
		 */
		html: function() {
			var ins = Mustache.render(i3GEOF.salvaMapa.MUSTACHE, i3GEOF.salvaMapa.mustacheHash());
			return ins;
		},
		/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante: function(){
			var janela,divid,titulo;
			if ($i("i3GEOF.salvaMapa")) {
				return;
			}
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u17") + "</span></div>";
			janela = i3GEO.janela.cria(
					"300px",
					"180px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.salvaMapa",
					false,
					"hd",
					"",
					"",
					"",
					true,
					"",
					"",
					"",
					"",
					"10"
			);
			divid = janela[2].id;
			i3GEOF.salvaMapa.aguarde = $i("i3GEOF.salvaMapa_imagemCabecalho").style;
			i3GEOF.salvaMapa.inicia(divid);
		}
};
