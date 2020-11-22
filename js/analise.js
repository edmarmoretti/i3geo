/**
 * Title: An&aacute;lise geogr&aacute;fica
 *
 * Fun&ccedil;oes de gera&ccedil;&atilde;o das analises e abertura dos dialogos das opcoes de analise espacial
 *
 * Em i3GEO.analise.dialogo estao as funcoes de abertura dos dialogos
 *
 * Namespace:
 *
 * i3GEO.analise
 *
 * Exemplo:
 *
 * Para abrir a janela de di&aacute;logo da ferramenta de mapa de calor
 *
 * i3GEO.analise.dialogo.markercluster();
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_analise.js>
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.analise =
{
		/**
		 * Armazena os pontos clicados da ultima linha
		 */
		pontos : {
			xpt : [],
			ypt : []
		},
		/**
		 * Classe: i3GEO.analise.dialogo
		 *
		 * Abre as telas de di&aacute;logo das op&ccedil;&otilde;es de an&aacute;lise
		 *
		 * Exemplo:
		 *
		 * Para abrir a mensagem de di&aacute;logo de gera&ccedil;&atilde;o de buffer, utilize
		 *
		 * i3GEO.analise.dialogo.buffer()
		 */
		dialogo : {
			/**
			 * Function: markercluster
			 *
			 * Ferramenta mapa agrupamento de pontos
			 */
			markercluster : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.markercluster()",
						"markercluster",
						"markercluster",
						"dependencias.php",
				"i3GEOF.markercluster.start()");
			},
			/**
			 * Function: heatmap
			 *
			 * Ferramenta mapa de calor
			 */
			heatmap : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.heatmap()",
						"heatmap",
						"heatmap",
						"dependencias.php",
				"i3GEOF.heatmap.start()");
			},
			/**
			 * Function: graficoInterativo1
			 *
			 * Ferramenta gr&aacute;fico interativo
			 */
			graficointerativo : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.graficointerativo()",
						"graficointerativo",
						"graficointerativo",
						"dependencias.php",
				"i3GEOF.graficointerativo.start()");
			},
			/**
			 * Function: linhaDoTempo
			 *
			 * Ferramenta linha do tempo
			 */
			linhadotempo : function(tema) {
				if(!tema){
					tema = "";
				}
				var temp = function(){
					i3GEOF.linhadotempo.start(tema);
				};
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.linhadotempo()",
						"linhadotempo",
						"linhadotempo",
						"dependencias.php",
						temp);
			},
			/**
			 * Function: gradePontos
			 *
			 * Ferramenta grade de pontos
			 */
			gradepontos : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.gradepontos()",
						"gradepontos",
						"gradepontos",
						"dependencias.php",
						"i3GEOF.gradepontos.start()"
				);
			},
			/**
			 * Function: gradePol
			 *
			 * Ferramenta grade de pol&iacute;gonos
			 */
			gradepol : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.gradepol()",
						"gradepol",
						"gradepol",
						"dependencias.php",
						"i3GEOF.gradepol.start()"
				);
			},
			/**
			 * Function: gradeHex
			 *
			 * Ferramenta grade de hex&aacute;gonos
			 */
			gradehex : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.gradehex()",
						"gradehex",
						"gradehex",
						"dependencias.php",
						"i3GEOF.gradehex.start()"
				);
			},
			/**
			 * Function: pontosdistri
			 *
			 * Ferramenta de c&aacute;lculo de distribui&ccedil;&atilde;o de pontos
			 */
			pontosdistri : function() {
				i3GEO.parametros.r === "nao" ? i3GEO.janela.tempoMsg($trad("x22")) : i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.pontosdistri()",
						"pontosdistri",
						"pontosdistri",
						"dependencias.php",
				"i3GEOF.pontosdistri.start()");
			},
			/**
			 * Function: pontoempoligono
			 *
			 * Ferramenta ponto em pol&iacute;gono
			 */
			pontoempoligono : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.pontoempoligono()",
						"pontoempoligono",
						"pontoempoligono",
						"dependencias.php",
				"i3GEOF.pontoempoligono.start()");
			},
			/**
			 * Function: centromassa
			 *
			 * Ferramenta centro m&eacute;dio
			 */
			centromassa : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.centromassa()",
						"centromassa",
						"centromassa",
						"dependencias.php",
				"i3GEOF.centromassa.start()");
			},
			/**
			 * Function: nptPol
			 *
			 * Ferramenta n&uacute;mero de pontos em pol&iacute;gono
			 */
			nptpol : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.nptpol()",
						"nptpol",
						"nptpol",
						"dependencias.php",
				"i3GEOF.nptpol.start()");
			},
			/**
			 * Function: buffer
			 *
			 * Ferramenta buffer
			 */
			buffer : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.buffer()",
						"buffer",
						"buffer",
						"dependencias.php",
				"i3GEOF.buffer.start()");
			},
			/**
			 * Function: distanciaptpt
			 *
			 * Ferramenta dist&acirc;ncia entre pontos
			 */
			distanciaptpt : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.distanciaptpt()",
						"distanciaptpt",
						"distanciaptpt",
						"dependencias.php",
				"i3GEOF.distanciaptpt.start()");
			},
			/**
			 * Function: centroide
			 *
			 * Ferramenta centr&oacute;ide
			 */
			centroide : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.centroide()",
						"centroide",
						"centroide",
						"dependencias.php",
				"i3GEOF.centroide.start()");
			},
			/**
			 * Function: dissolve
			 *
			 * Ferramenta dissolve bordas comuns
			 */
			dissolve : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.dissolve()",
						"dissolve",
						"dissolve",
						"dependencias.php",
				"i3GEOF.dissolve.start()");
			},
			/**
			 * Function: agrupaelementos
			 *
			 * Ferramenta agrupa elementos
			 */
			agrupaelementos : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.agrupaelementos()",
						"agrupaelementos",
						"agrupaelementos",
						"dependencias.php",
				"i3GEOF.agrupaelementos.start()");
			},
			distancia : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.distancia()",
						"distancia",
						"distancia",
						"dependencias.php",
				"i3GEOF.distancia.start()");
			},
			area : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.analise.dialogo.area()",
						"area",
						"area",
						"dependencias.php",
				"i3GEOF.area.start()");
			}
		}
};