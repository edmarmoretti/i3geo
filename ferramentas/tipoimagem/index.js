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
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia: function(iddiv){
			if(i3GEOF.tipoimagem.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/tipoimagem/template_mst.html", function(template) {
					i3GEOF.tipoimagem.MUSTACHE = template;
					i3GEOF.tipoimagem.inicia(iddiv);
				});
				return;
			}
			var f;

			$i(iddiv).innerHTML = i3GEOF.tipoimagem.html();
			if(i3GEO.configura.tipoimagem != "nenhum"){
				var aplica = i3GEO.configura.tipoimagem.split(" ");
				$( "#tipoimagemForm input" ).each(function( index ) {
					if(jQuery.inArray($( this ).prop("name"), aplica) !== -1){
						$( this ).prop("checked",true);
					}
				});
			}
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
			if ($i("i3GEOF.tipoimagem")) {
				return;
			}
			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOF.tipoimagem",200);
			};
			//cria a janela flutuante
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p2") + "</span></div>";
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
					minimiza,
					"",
					true,
					"",
					"",
					"",
					"",
					"1"
			);
			divid = janela[2].id;
			$i("i3GEOF.tipoimagem_corpo").style.backgroundColor = "white";
			i3GEOF.tipoimagem.aguarde = $i("i3GEOF.tipoimagem_imagemCabecalho").style;
			i3GEOF.tipoimagem.inicia(divid);
		},
		/*
	Function: aplicar

	Aplica o filtro de imagem escolhido
		 */
		aplicar: function(){
			var f = [];
			$( "#tipoimagemForm input:checked" ).each(function( index ) {
				f.push($( this ).prop("name"));
			});
			if(f.length == 0){
				f.push("nenhum");
			}
			i3GEO.configura.tipoimagem = f.join(" ");
			i3GEO.Interface.alteraParametroLayers("TIPOIMAGEM",f.join(" "));
			i3GEO.Interface.atualizaMapa();
		}
};