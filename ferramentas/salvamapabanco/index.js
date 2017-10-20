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
i3GEOF.salvaMapaBanco = {
		ID_MAPA: "",
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
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.salvaMapaBanco.dicionario);
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
			if(i3GEOF.salvaMapaBanco.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/salvamapabanco/template_mst.html", function(template) {
					i3GEOF.salvaMapaBanco.MUSTACHE = template;
					i3GEOF.salvaMapaBanco.inicia(iddiv);
				});
				return;
			}
			$i(iddiv).innerHTML = i3GEOF.salvaMapaBanco.html(iddiv);
		},

		/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
		 */
		html: function() {
			var ins = Mustache.render(i3GEOF.salvaMapaBanco.MUSTACHE, i3GEOF.salvaMapaBanco.mustacheHash());
			return ins;
		},
		/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante: function(id_mapa){
			i3GEOF.salvaMapaBanco.ID_MAPA = id_mapa;
			var janela,divid,titulo;
			if ($i("i3GEOF.salvaMapaBanco")) {
				return;
			}
			cabecalho = function(){};
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOF.salvaMapaBanco",200);
			};
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u17") + "</span></div>";
			janela = i3GEO.janela.cria(
					"300px",
					"180px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.salvaMapaBanco",
					false,
					"hd",
					cabecalho,
					minimiza,
					"",
					true,
					"",
					"",
					"",
					""
			);
			divid = janela[2].id;
			janela[0].moveTo(180,60);
			i3GEOF.salvaMapaBanco.aguarde = $i("i3GEOF.salvaMapaBanco_imagemCabecalho").style;
			i3GEOF.salvaMapaBanco.inicia(divid);
		},
		salva: function(){
			var texto,preferencias,geometrias,
			login = i3GEO.login.verificaCookieLogin(),
			graficos = "",
			tabelas = "";
			if(login === false){
				alert("Login!");
			}
			if(i3GEOF.salvaMapaBanco.ID_MAPA === ""){
				return;
			} else {
				var id_mapa = i3GEOF.salvaMapaBanco.ID_MAPA;
			}
			// pega as preferencias do usuario tambem
			try {
				preferencias = i3GEO.util.base64encode(i3GEO.util.pegaDadosLocal("preferenciasDoI3Geo"));
			} catch (e) {
				preferencias = "";
			}
			// pega as geometrias no layer grafico
			try {
				geometrias = i3GEO.mapa.compactaLayerGrafico();
				if (!geometrias) {
					geometrias = "";
				}
			} catch (e) {
				geometrias = "";
			}
			// pega as ferramentas do tipo grafico
			if (i3GEOF.graficointerativo1) {
				try {
					graficos = i3GEOF.graficointerativo1.compactaConfig();
					if (!graficos) {
						graficos = "";
					}
				} catch (e) {
					graficos = "";
				}
			}
			// pega as ferramentas do tipo tabela
			if (i3GEOF.tabela) {
				try {
					tabelas = i3GEOF.tabela.compactaConfig();
					if (!tabelas) {
						tabelas = "";
					}
				} catch (e) {
					tabelas = "";
				}
			}
			var url = (window.location.href.split("?")[0]),
			p = i3GEO.configura.locaplic + "/admin/php/salvamapabanco.php?";
			var par =
				"funcao=salvaMapfile"
				+ "&id_mapa="
				+ id_mapa
				+ "&ext="
				+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
				+ "&sid="
				+ i3GEO.configura.sid
				+ "&preferenciasbase64="
				+ preferencias
				+ "&geometriasbase64="
				+ geometrias
				+ "&graficosbase64="
				+ graficos
				+ "&tabelasbase64="
				+ tabelas
				+ "&url="
				+ i3GEO.configura.locaplic;
			$.post(
					p,
					par
			)
			.done(
					function(data, status){
						i3GEO.janela.tempoMsg($trad('msgMapaSalvo',i3GEOF.salvaMapaBanco.dicionario));

					}
			)
			.fail(
					function(data){
						i3GEO.janela.tempoMsg(retorno);
					}
			);
		},
		remove: function(){
			var login = i3GEO.login.verificaCookieLogin();
			if(login === false){
				alert("Login!");
			}
			if(i3GEOF.salvaMapaBanco.ID_MAPA === ""){
				return;
			} else {
				var id_mapa = i3GEOF.salvaMapaBanco.ID_MAPA;
			}

			p = i3GEO.configura.locaplic + "/admin/php/salvamapabanco.php?";
			var par =
				"funcao=removeMapfile"
				+ "&id_mapa="
				+ id_mapa
				+ "&sid="
				+ i3GEO.configura.sid;
			$.post(
					p,
					par
			)
			.done(
					function(data, status){
						i3GEO.janela.tempoMsg($trad('msgMapaSalvo',i3GEOF.salvaMapaBanco.dicionario));

					}
			)
			.fail(
					function(data){
						i3GEO.janela.tempoMsg(retorno);
					}
			);
		}
};