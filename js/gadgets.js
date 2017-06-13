/**
 * Title: Gadgets (objetos marginais do mapa)
 *
 * Inclui elementos especiais no mapa
 *
 * Os elementos s&atilde;o opcionais e adicionam funcionalidades ao mapa.
 *
 * Namespace:
 *
 * i3GEO.gadgets
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_gadgets.js>
 */

/**
 *
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUACAtilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.gadgets =
	{
		/**
		 * Propriedade: PARAMETROS
		 *
		 * Par&acirc;metros de inicializa&ccedil;&atilde;o dos gadgets.
		 *
		 * Essa vari&aacute;vel define os parametros individuais de cada gadget e o ID do elemento HTML onde o gadget ser&aacute;
		 * inclu&iacute;do (parametro "idhtml").
		 *
		 * Cada tipo de gadget pode ter parametros espec&iacute;ficos, descritos a seguir.
		 *
		 * Voc&ecirc; pode acessar os par&acirc;metros da seguinte forma:
		 *
		 * i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda = 400;
		 *
		 * Para evitar o funcionamento de um gadget experimente utilizar
		 *
		 * Exemplo:
		 *
		 * i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml = "";
		 *
		 * Default:
		 *
		 * (start code)
		 *
		 * i3GEO.gadgets.PARAMETROS = { "mostraInserirKml" : { idhtml : "inserirKml" }, "mostraEscalaNumerica" : { idhtml : "escala" },
		 * "mostraEscalaGrafica" : { idhtml : "escalaGrafica" }, "mostraBuscaRapida" : { idhtml : "buscaRapida", servicosexternos : true,
		 * temasmapa : false, google : true }, "mostraVisual" : { idhtml : "" }, "mostraHistoricoZoom" : { idhtml : "historicozoom" },
		 * "mostraMenuSuspenso" : { permiteLogin : true, marcadores : true, idhtml : "menus", deslocaEsquerda : 0, parametrosYUI : { iframe :
		 * false, autosubmenudisplay : false, showdelay : 200, hidedelay : 500, lazyload : false } }, "mostraMenuLista" : { idhtml :
		 * "menuLista" }, "mostraVersao" : { idhtml : "versaoi3geo" }, "mostraEmail" : { idhtml : "emailInstituicao" } };
		 *
		 * (end)
		 */
		PARAMETROS : {
			"mostraInserirKml" : {
				idhtml : "inserirKml"
			},
			"mostraEscalaNumerica" : {
				idhtml : "escala"
			},
			"mostraEscalaGrafica" : {
				idhtml : "escalaGrafica"
			},
			"mostraVisual" : {
				idhtml : ""
			},
			"mostraHistoricoZoom" : {
				idhtml : "historicozoom"
			},
			"mostraMenuSuspenso" : {
				permiteLogin : true,
				marcadores : true,
				idhtml : "menus",
				deslocaEsquerda : 0,
				menuUnico : false,
				parametrosYUI : {
					iframe : false,
					autosubmenudisplay : false,
					showdelay : 200,
					hidedelay : 500,
					lazyload : false
				}
			},
			"mostraVersao" : {
				idhtml : "versaoi3geo"
			},
			"mostraEmail" : {
				idhtml : "emailInstituicao"
			}
		},
		/**
		 * Function: mostraEmail
		 *
		 * Mostra o e-mail armazenado na vari&aacute;vel i3GEO.parametros.emailInstituicao
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraEmail : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraEmail()");

			if (arguments.length === 0 || id === "") {
				id = i3GEO.gadgets.PARAMETROS.mostraEmail.idhtml;
			} else {
				i3GEO.gadgets.PARAMETROS.mostraEmail.idhtml = id;
			}
			i3GEO.util.defineValor(id, "innerHTML", i3GEO.parametros.emailInstituicao);
		},
		/**
		 * Function: mostraVersao
		 *
		 * Mostra a vers&atilde;o atual do i3Geo armazenada na vari&aacute;vel i3GEO.parametros.mensageminicial
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraVersao : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraVers&atilde;o()");

			if (arguments.length === 0 || id === "") {
				id = i3GEO.gadgets.PARAMETROS.mostraVersao.idhtml;
			} else {
				i3GEO.gadgets.PARAMETROS.mostraVersao.idhtml = id;
			}
			i3GEO.util.defineValor(id, "innerHTML", i3GEO.parametros.mensageminicia);
		},
		/**
		 * Function: mostraInserirKml
		 *
		 * Mostra no mapa a a op&ccedil;&atilde;o para inserir kml.
		 *
		 * Essa op&ccedil;&atilde;o s&oacute; funciona com a API do Google carregada
		 *
		 * Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML existente no mapa que contenha o id
		 * definido em i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de
		 * i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
		 */
		mostraInserirKml : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraInserirKml()");

			var i, ins, temp;
			if (arguments.length === 0) {
				id = i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml;
			}
			if ($i(id)) {
				if (!$i("i3geo_urlkml")) {
					i = $inputText(id, "290", "i3geo_urlkml", "kml url", "35", "kml");
					ins = "<table><tr><td>" + i;
					temp = 'i3GEO.Interface.adicionaKml();';
					ins +=
						"</td><td><img src='" + i3GEO.configura.locaplic
							+ "/imagens/branco.gif"
							+ "' class='tic' onclick='"
							+ temp
							+ "' /></td></tr></table>";
					$i(id).innerHTML = ins;
				}
			}
		},

		/**
		 * Function: mostraHistoricoZoom
		 *
		 * Mostra na barra de zoom os &iacute;cones que controlam a visualiza&ccedil;&atilde;o do hist&oacute;rico da
		 * navega&ccedil;&atilde;o sobre o mapa
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de i3GEO.gadgets.PARAMETROS
		 */
		mostraHistoricoZoom : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.gadgets.mostraHistoricoZoom()");

			if (arguments.length === 0) {
				id = i3GEO.gadgets.PARAMETROS.mostraHistoricoZoom.idhtml;
			}
			if ($i(id)) {
				marcadorZoom = "";
				var ins = "<table style='text-align:center;position:relative;left:";
				if (navm) {
					ins += "0px;'>";
				} else {
					ins += "6px;'>";
				}
				ins +=
					"<tr><td><img  id='i3geo_zoomanterior' class='zoomAnterior' title='anterior' src='" + i3GEO.configura.locaplic
						+ "/imagens/branco.gif"
						+ "'  /></td>";
				ins += "<td>&nbsp;</td>";
				ins +=
					"<td><img  id='i3geo_zoomproximo' class='zoomProximo' title='proximo' src='" + i3GEO.configura.locaplic
						+ "/imagens/branco.gif"
						+ "'  /></td>";
				ins += "</tr></table>";
				$i(id).innerHTML = ins;
			}
		},
		/**
		 * i3GEO.gadgets.visual (depreciado)
		 *
		 * Gera os &iacute;cones e controla as op&ccedil;&otilde;es de modifica&ccedil;&atilde;o do visual do mapa.
		 *
		 * O visual consiste na defini&ccedil;&atilde;o dos &iacute;cones utilizados no mapa. O visual pode ser modificado na
		 * inicializa&ccedil;&atilde;o ou ent&atilde;o escolhido pelo usu&aacute;rio.
		 *
		 * Os visuais dispon&iacute;veis s&atilde;o definidos no servidor e consistem em diret&oacute;rios localizados em
		 * i3geo/imagens/visual. A lista de visuais dispon&iacute;veis &eacute; obtida na inicializa&ccedil;&atilde;o do i3geo.
		 *
		 * Os &iacute;cones para mudan&ccedil;a do visual s&atilde;o inclu&iacute;dos no elemento HTML definido em
		 * i3geo.gadgets.PARAMETROS.visual
		 */
		visual : {
			/**
			 * Constr&oacute;i os &iacute;cones de escolha do visual.
			 *
			 * Parametro:
			 *
			 * id {String} - id do elemento que receber&aacute; os &iacute;cones (opcional)
			 */
			inicia : function(id) {
				alert("A i3GEO.gadgets.visual foi depreciado");
			},
			/**
			 * Troca o visual atual. A lista de visuais dispon&iacute;veis &eacute; obtida em i3GEO.parametros.listavisual
			 *
			 * Parametro:
			 *
			 * visual {String} - nome do visual que ser&aacute; utilizado.
			 */
			troca : function(visual) {
				alert("A i3GEO.gadgets.visual foi depreciado");
			}
		}

	};