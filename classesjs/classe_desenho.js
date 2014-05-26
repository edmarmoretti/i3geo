/*
Desenho de elementos gr&aacute;ficos

i3GEO.desenho

Funcoes de uso geral para desenho de elementos graficos.

As funcoes dependem de cada interface em uso no mapa.

Aqui estao apenas as funcoes de uso compartilhado. Para mais informacoes veja as opcoes nos editores vetoriais.

Arquivo:

i3geo/classesjs/classe_desenho.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
i3GEO.desenho = {
		layergrafico: null,
		/*
	Propriedade: estilos

	Estilos que podem ser utilizados para desenhar os elementos
		 */
		estilos: {
			"normal":{
				fillcolor: '#ffffff',
				linecolor: '#000000',
				linewidth: '2',
				circcolor: '#ffffff',
				textcolor: '#787A78'
			},
			"palido":{
				fillcolor: '#B5A8A8',
				linecolor: '#BAA4AE',
				linewidth: '1',
				circcolor: '#E0D7DC',
				textcolor: '#787A78'
			},
			"vermelho":{
				fillcolor: '#E8ACAC',
				linecolor: '#F50707',
				linewidth: '1',
				circcolor: '#F09EA6',
				textcolor: '#787A78'
			},
			"verde":{
				fillcolor: '#3CCC2F',
				linecolor: '#0C6642',
				linewidth: '1',
				circcolor: '#C7D9D2',
				textcolor: '#787A78'
			}
		},
		//@TODO remover apos refatorar codigo
		estilosOld: {
			"normal":{
				fillcolor: 'red',
				linecolor: 'black',
				linewidth: '1',
				circcolor: 'white',
				textcolor: 'gray'
			},
			"palido":{
				fillcolor: 'gray',
				linecolor: 'gray',
				linewidth: '1',
				circcolor: 'gray',
				textcolor: 'gray'
			},
			"vermelho":{
				fillcolor: 'gray',
				linecolor: 'red',
				linewidth: '1',
				circcolor: 'pink',
				textcolor: 'brown'
			},
			"verde":{
				fillcolor: 'gray',
				linecolor: 'green',
				linewidth: '1',
				circcolor: 'DarkGreen',
				textcolor: 'GreenYellow'
			}
		},
		/*
	Propriedade: estiloPadrao

	Estilo utilizado como padr&atilde;o
		 */
		estiloPadrao: "normal",
		/*
	Fun&ccedil;&otilde;es utilizadas quando o mapa baseia-se na interface OpenLayers
		 */
		openlayers: {
			/*
			 * Cria o layer onde os desenhos serao inseridos
			 */
			inicia: function(){
				if(!i3GEO.desenho.layergrafico){
					i3GEO.desenho.openlayers.criaLayerGrafico();
				}
			},
			//i3GEO.editorOL.layergrafico
			criaLayerGrafico: function(){
				if(!i3GEO.desenho.layergrafico){
					var	sketchSymbolizers = {
							"Point": {
								fillColor: "rgb(${fillColor})",
								fillOpacity: "${opacidade}",
								strokeWidth: "${strokeWidth}",
								strokeOpacity: "${opacidade}",
								strokeColor: "rgb(${strokeColor})",
								label: "${texto}",
								pointRadius: "${pointRadius}",
								graphicName: "${graphicName}",
								fontSize: "${fontSize}",
								fontColor: "rgb(${fontColor})",
								fontFamily: "Arial",
								fontWeight: "normal",
								labelAlign: "lb",
								labelXOffset: "3",
								labelYOffset: "3",
								externalGraphic: "${externalGraphic}"
							},
							"Line": {
								strokeWidth: "${strokeWidth}",
								strokeOpacity: "${opacidade}",
								strokeColor: "rgb(${strokeColor})"
							},
							"Polygon": {
								strokeWidth: "${strokeWidth}",
								strokeOpacity: "${opacidade}",
								strokeColor: "rgb(${strokeColor})",
								fillColor: "rgb(${fillColor})",
								fillOpacity: "${opacidade}",
								zIndex: 5000
							}
					},
					style = new OpenLayers.Style(),
					styleMap1 = new OpenLayers.StyleMap(
							{
								"default": style,
								"vertex": {
									strokeOpacity: 1,
									strokeWidth: 1,
									fillColor: "white",
									fillOpacity: 0.45,
									pointRadius: 4
								}
							},
							{
								extendDefault: false
							}
					);
					style.addRules(
							[new OpenLayers.Rule({symbolizer: sketchSymbolizers})]
					);
					i3GEO.desenho.layergrafico = new OpenLayers.Layer.Vector(
							"Graf",
							{
								styleMap: styleMap1,
								displayInLayerSwitcher:true,
								visibility:true,
								vertexRenderIntent: "vertex"
							}
					);
					//para efeitos de compatibilidade
					if(i3GEO.editorOL && i3GEO.editorOL.mapa){
						i3GEO.editorOL.mapa.addLayers([i3GEO.desenho.layergrafico]);
					}
					else{
						i3geoOL.addLayers([i3GEO.desenho.layergrafico]);
					}
				}
			}
		},
		googlemaps: {
			/**
			 * Array que guarda todos os objetos que estao atualmente no mapa
			 * E atualizado toda vez que uma figura e acrescentada ou removida
			 */
			shapes: [],
			inicia: function(){
			},
			getFeaturesByAttribute: function(atributo,valor){
				var i,s = [],
				n = i3GEO.desenho.googlemaps.shapes.length;
				for(i=0;i<n;i++){
					if(i3GEO.desenho.googlemaps.shapes[i] && i3GEO.desenho.googlemaps.shapes[i] != ""){
						if(i3GEO.desenho.googlemaps.shapes[i][atributo] == valor){
							s.push(i3GEO.desenho.googlemaps.shapes[i]);
						}
					}
				}
				return s;	
			},
			destroyFeatures: function(f){
				var i,n = f.length;
				for(i=0;i<n;i++){
					f[i].setMap(null);
					f[i] = "";
				}
			}
		},
		googleearth:{
			insereMarca: function(description,ddx,ddy,name,snippet){
				if(typeof(console) !== 'undefined'){console.info("i3GEO.Interface.googleearth.insereMarca()");}
				var placemark = i3GeoMap.createPlacemark(''),
				point = i3GeoMap.createPoint('');
				placemark.setName(name);
				point.setLatitude(ddy);
				point.setLongitude(ddx);
				placemark.setGeometry(point);
				if(description !== "")
				{placemark.setDescription(description);}
				placemark.setSnippet(snippet);
				i3GeoMap.getFeatures().appendChild(placemark);
			},
			//
			//c&oacute;digo obtido em http://code.google.com/intl/pt-BR/apis/earth/documentation/geometries.html
			//
			insereCirculo: function(centerLng,centerLat,radius,name,snippet){
				function makeCircle(centerLat, centerLng, radius) {
					var ring = i3GeoMap.createLinearRing(''),
					steps = 25,
					i,
					pi2 = Math.PI * 2,
					lat,
					lng;
					for (i = 0; i < steps; i++) {
						lat = centerLat + radius * Math.cos(i / steps * pi2);
						lng = centerLng + radius * Math.sin(i / steps * pi2);
						ring.getCoordinates().pushLatLngAlt(lat, lng, 0);
					}
					return ring;
				}
				var polygonPlacemark = i3GeoMap.createPlacemark(''),
				poly = i3GeoMap.createPolygon(''),
				polyStyle;
				poly.setAltitudeMode(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
				polygonPlacemark.setGeometry(poly);
				polygonPlacemark.getGeometry().setOuterBoundary(makeCircle(centerLat, centerLng, radius));
				polygonPlacemark.setName(name);
				polygonPlacemark.setSnippet(snippet);
				polygonPlacemark.setStyleSelector(i3GeoMap.createStyle(''));
				polyStyle = polygonPlacemark.getStyleSelector().getPolyStyle();
				polyStyle.setFill(0);
				i3GeoMap.getFeatures().appendChild(polygonPlacemark);
			},
			insereLinha: function(xi,yi,xf,yf,name,snippet){
				var lineStringPlacemark = i3GeoMap.createPlacemark(''),
				lineString,
				lineStyle;
				lineStringPlacemark.setName(name);
				lineString = i3GeoMap.createLineString('');
				lineString.setAltitudeMode(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
				lineStringPlacemark.setGeometry(lineString);
				lineString.getCoordinates().pushLatLngAlt(yi, xi, 0);
				lineString.getCoordinates().pushLatLngAlt(yf, xf, 0);

				lineStringPlacemark.setStyleSelector(i3GeoMap.createStyle(''));
				lineStringPlacemark.setSnippet(snippet);
				lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
				lineStyle.setWidth(3);

				i3GeoMap.getFeatures().appendChild(lineStringPlacemark);
			},
			removePlacemark: function(nome){
				var features = i3GeoMap.getFeatures(),
				n = features.getChildNodes().getLength(),
				i,
				nfeatures = [];
				for(i=0;i<n;i++){
					try{
						if(features.getChildNodes().item(i).getName() === nome || features.getChildNodes().item(i).getDescription() === nome || features.getChildNodes().item(i).getSnippet() === nome){
							//features.getChildNodes().item(i).setVisibility(false);
							nfeatures.push(features.getChildNodes().item(i));
							//features.removeChild(features.getChildNodes().item(i));
						}
					}
					catch(e){}
				}
				n = nfeatures.length;
				for(i=0;i<n;i++){
					features.removeChild(nfeatures[i]);
				}
			}
		},
		/*
	Cria uma caixa de sele&ccedil;&atilde;o para escolha do estilo a ser utilizado
		 */
		caixaEstilos: function(){
			var lista = i3GEO.util.listaChaves(i3GEO.desenho.estilos),
			n = lista.length,
			i,
			caixa,
			sel;
			caixa = "<select onchange='i3GEO.desenho.definePadrao(this.value)'>";
			for(i=0;i<n;i+=1){
				sel = "";
				if(lista[i] === i3GEO.desenho.estiloPadrao)
				{sel = "select";}
				caixa += "<option value='"+lista[i]+"'" + sel + ">"+lista[i]+"</option>";
			}
			caixa += "</select>";
			return caixa;
		}
};
//YAHOO.log("carregou classe desenho", "Classes i3geo");
