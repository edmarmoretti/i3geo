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
		 * temasmapa : false, google : true }, "mostraHistoricoZoom" : { idhtml : "historicozoom" },
		 * "mostraMenuSuspenso" : { permiteLogin : true, marcadores : true, idhtml : "menus", deslocaEsquerda : 0, parametrosYUI : { iframe :
		 * false, autosubmenudisplay : false, showdelay : 200, hidedelay : 500, lazyload : false } }, "mostraMenuLista" : { idhtml :
		 * "menuLista" }, "mostraVersao" : { idhtml : "versaoi3geo" }, "mostraEmail" : { idhtml : "emailInstituicao" } };
		 *
		 * (end)
		 */
		PARAMETROS : {
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
		}
	};