/*
Title: Saiku

Formulario para obtencao de parametros para abertura do SAIKU

Veja:

<i3GEO.analise.dialogo.saiku>

Arquivo:

i3geo/ferramentas/saiku/index.js

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
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.saiku
 *
 */
i3GEOF.saiku =
	{
		/*
		 * Variavel: aguarde
		 *
		 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		/*
		 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
		 */
		criaJanelaFlutuante : function() {
			i3GEOF.saiku.iniciaDicionario();
		},
		/*
		 * Function: iniciaDicionario
		 *
		 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
		 *
		 * O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario : function() {
			if (typeof (i3GEOF.saiku.dicionario) === 'undefined') {
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic + "/ferramentas/saiku/dicionario.js",
					"i3GEOF.saiku.iniciaJanelaFlutuante()",
					"i3GEOF.saiku.dicionario_script");
			} else {
				i3GEOF.saiku.iniciaJanelaFlutuante();
			}
		},
		/*
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametro:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia : function(iddiv) {
			try {
				$i(iddiv).innerHTML = i3GEOF.saiku.html();
			} catch (erro) {
				i3GEO.janela.tempoMsg(erro);
			}
		},
		/*
		 * Function: html
		 *
		 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
		 *
		 * Retorno:
		 *
		 * String com o c&oacute;digo html
		 */
		html : function() {
			var ins =
				"<div class='container-fluid'>"
				+ "<h5>Saiku: <a href=http://meteorite.bi/saiku target=_blank >http://meteorite.bi/saiku</a></h4>"
					+ "<h5 class='alert alert-info'>" + $trad('ajuda', i3GEOF.saiku.dicionario) + "<h5>";
			if (i3GEO.parametros.saikuUrl !== "") {
				ins +=
					"<button onclick='i3GEOF.saiku.aplicar()' class='btn btn-primary btn-sm btn-raised'>"+$trad('abreSaikuNovaJanela', i3GEOF.saiku.dicionario)+"</button>"
					+ "<button onclick='i3GEOF.saiku.atualizaMapa()' class='btn btn-primary btn-sm btn-raised'>"+$trad('atualizaMapa', i3GEOF.saiku.dicionario)+"</button>";

			} else {
				ins += "<p class=paragrafo style=color:red >" + $trad('servidorNaoDisponivel', i3GEOF.saiku.dicionario) + "<p>";
			}

			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var janela, divid, titulo, cabecalho, minimiza;
			if ($i("i3GEOF.saiku")) {
				return;
			}
			cabecalho = function() {
			};
			minimiza = function() {
				i3GEO.janela.minimiza("i3GEOF.saiku");
			};
			// cria a janela flutuante
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >Saiku</span></div>";
			janela =
				i3GEO.janela.cria(
					"400px",
					"220px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.saiku",
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
					"117"
				);
			divid = janela[2].id;
			$i("i3GEOF.saiku_corpo").style.backgroundColor = "white";
			$i("i3GEOF.saiku_corpo").style.textAlign = "left";
			i3GEOF.saiku.aguarde = $i("i3GEOF.saiku_imagemCabecalho").style;
			i3GEOF.saiku.inicia(divid);
		},
		iniciaJanelaFlutuante2 : function() {
			var mapext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), url =
				i3GEO.configura.locaplic + "/ferramentas/saiku/startsaiku.php?origem=i3geo&g_sid=" + i3GEO.configura.sid + "&locaplic="
					+ i3GEO.configura.locaplic + "&mapext=" + mapext, cabecalho = function() {
			}, minimiza = function() {
				i3GEO.janela.iconiza("i3GEOF.saikuMapa",100);
			}, titulo =
				"<div id='i3GEOF.saikuMapaI' class='comboTemasCabecalho'><input id=i3GEOFsaikubotao3 type=button value='Atualiza o mapa' /></div>";

			i3GEO.janela.cria(
				(i3GEO.parametros.w / 1.2) - 50 + "px",
				(i3GEO.parametros.h / 1.1) - 50 + "px",
				url,
				"",
				"",
				titulo,
				"i3GEOF.saikuMapa",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true,
				i3GEO.configura.locaplic + "/imagens/saiku_free_min.png");
			b = new YAHOO.widget.Button("i3GEOFsaikubotao3", {
				onclick : {
					fn : i3GEOF.saiku.atualizaMapa
				}
			});
			b.addClass("rodar150");
		},
		aplicar : function() {
			var mapext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
			window.open(i3GEO.configura.locaplic + "/ferramentas/saiku/startsaiku.php?origem=i3geo&g_sid=" + i3GEO.configura.sid
				+ "&locaplic=" + i3GEO.configura.locaplic + "&mapext=" + mapext);
		},
		atualizaMapa : function() {
			i3GEO.mapa.refresh();
		}
	};
