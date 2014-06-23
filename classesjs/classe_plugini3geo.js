/**
 * Title: pluginI3geo
 * 
 * i3GEO.pluginI3geo
 * 
 * Implementam os plugins do i3Geo que adicionam camadas especiais ao mapa,
 * normalmente dados vetoriais.
 * 
 * Arquivo:
 * 
 * i3geo/classesjs/classe_plugini3geo.js
 * 
 * Licen&ccedil;a:
 * 
 * GPL2
 * 
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 * 
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente
 * Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 * 
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 * 
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja
 * &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE
 * ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para
 * mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */

if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.pluginI3geo = {
	/**
	 * Inicia a execucao de um plugin
	 * 
	 * Camada e um objeto gerado pelo i3Geo quando uma camada e adicionada ao
	 * mapa O objeto i3GEO.arvoreDeCamadas.CAMADAS guarda todas as camadas
	 * adicionadas ao mapa Ao adicionar uma camada pelo catalogo, o i3Geo
	 * verifica se a camada possui plugin e direciona para ca Os plugins sao
	 * definidos como metadados em cada mapfile de cada tema
	 * 
	 * Veja em i3geo/classesphp/classe_mapa.php funcao parametrostemas
	 */
	inicia : function(camada) {
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardePlugin","Calculando...");
		i3GEO.janela.AGUARDEMODAL = false;
		// chama a funcao conforme o tipo de plugin e a interface atual
		// para cada plugin deve haver um objeto com as funcoes especificas para
		// cada interface
		i3GEO.pluginI3geo[camada.plugini3geo.plugin][i3GEO.Interface.ATUAL]
				.call(null, camada);
	},
	/**
	 * Function: heatmap
	 * 
	 * Mapa de calor
	 * 
	 * Gera um layer do tipo mapa de calor e adiciona ao mapa
	 * 
	 * As depend&ecirc;ncias em javascript sao carregadas via script tag por
	 * meio de ferramentas/heatmap/openlayers_js.php
	 * 
	 * Esse programa tamb&eacute;m obt&eacute;m os dados necess&aacute;rios ao
	 * plugin
	 * 
	 * O layer existente no mapfile deve conter um metadata chamado PLUGINI3GEO
	 * 
	 * Esse matadado deve conter uma string que ser&aacute; transformada em um
	 * objeto javascript para uso no plugin
	 * 
	 * Exemplo:
	 * 
	 * "PLUGINI3GEO" '{"plugin":"heatmap","parametros":{"coluna":"teste"}}'
	 * 
	 * Coluna &eacute; a que cont&eacute;m os dados num&eacute;ricos que definem
	 * a quantidade de uma medida em cada ponto e &eacute; usada para gerar a
	 * representa&ccedil;&atilde;o. Se for vazia, considera-se o valor como 1
	 * 
	 * As cores das classes existentes no LAYER ser&atilde;o utilizadas para
	 * calcular as cores do mapa de calor. Se n&atilde;o existirem classes,
	 * ser&aacute; usado o default.
	 * 
	 */
	heatmap : {
		openlayers : function(camada) {
			var p = i3GEO.configura.locaplic
					+ "/ferramentas/heatmap/openlayers_js.php", carregaJs = "nao", crialayer;
			criaLayer = function() {
				var heatmap, g, datalen = heatmap_dados.length, features = [];
				if (i3GEO.Interface.openlayers.googleLike === true) {
					var sphericalMercatorProj = new OpenLayers.Projection(
							'EPSG:900913'), geographicProj = new OpenLayers.Projection(
							'EPSG:4326');
				}
				while (datalen--) {
					g = new OpenLayers.Geometry.Point(parseInt(
							heatmap_dados[datalen].lng, 10), parseInt(
									heatmap_dados[datalen].lat, 10));
					if(geographicProj){
						g.transform(geographicProj, sphericalMercatorProj);
					}
					features.push(new OpenLayers.Feature.Vector(g, {
						count : parseInt(heatmap_dados[datalen].count, 10)
					}));
				}

				// create our vectorial layer using heatmap renderer
				heatmap = new OpenLayers.Layer.Vector(camada.name, {
					opacity : 0.3,
					renderers : [ 'Heatmap' ],
					rendererOptions : {
						weight : 'count',
						heatmapConfig : {
							radius : 10
						}
					}
				});
				heatmap.addFeatures(features);
				i3geoOL.addLayer(heatmap);
				heatmap_dados = null;
				i3GEO.janela.fechaAguarde("aguardePlugin");
			};
			if (typeof (HeatmapOverlay) === 'undefined') {
				carregaJs = "sim";
			}
			p += "?carregajs=" + carregaJs + "&layer=" + camada.name
					+ "&coluna=" + camada.plugini3geo.parametros.coluna
					+ "&g_sid=" + i3GEO.configura.sid
					+ "&nomevariavel=heatmap_dados";

			i3GEO.util.scriptTag(p, criaLayer,
					"i3GEO.pluginI3geo.heatmap_script");

		}
	}
}