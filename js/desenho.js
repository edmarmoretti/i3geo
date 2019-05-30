if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.desenho =
{
        /**
         * Constant: layergrafico
         *
         * Objeto LAYER para a interface openLayers criado com i3GEO.desenho.openlayers.criaLayerGrafico
         *
         * Tipo:
         *
         * {penLayers.Layer.Vector}
         *
         */
        layergrafico : null,
        /**
         * Propriedade: estilos
         *
         * Estilos que podem ser utilizados para desenhar os elementos
         *
         * Tipo:
         *
         * {objeto}
         */
        estilos : {
            "normal" : {
                fillcolor : '#ffffff',
                linecolor : '#ffcc33',
                linewidth : '2',
                circcolor : '#ffffff',
                textcolor : '#787A78'
            },
            "palido" : {
                fillcolor : '#B5A8A8',
                linecolor : '#BAA4AE',
                linewidth : '1',
                circcolor : '#E0D7DC',
                textcolor : '#787A78'
            },
            "vermelho" : {
                fillcolor : '#E8ACAC',
                linecolor : '#F50707',
                linewidth : '1',
                circcolor : '#F09EA6',
                textcolor : '#787A78'
            },
            "verde" : {
                fillcolor : '#3CCC2F',
                linecolor : '#0C6642',
                linewidth : '1',
                circcolor : '#C7D9D2',
                textcolor : '#787A78'
            }
        },
        // @TODO remover apos refatorar codigo
        estilosOld : {
            "normal" : {
                fillcolor : 'red',
                linecolor : 'black',
                linewidth : '1',
                circcolor : 'white',
                textcolor : 'gray'
            },
            "palido" : {
                fillcolor : 'gray',
                linecolor : 'gray',
                linewidth : '1',
                circcolor : 'gray',
                textcolor : 'gray'
            },
            "vermelho" : {
                fillcolor : 'gray',
                linecolor : 'red',
                linewidth : '1',
                circcolor : 'pink',
                textcolor : 'brown'
            },
            "verde" : {
                fillcolor : 'gray',
                linecolor : 'green',
                linewidth : '1',
                circcolor : 'DarkGreen',
                textcolor : 'GreenYellow'
            }
        },
        /**
         * Propriedade: estiloPadrao
         *
         * Estilo utilizado como padr&atilde;o
         */
        estiloPadrao : "normal",
        /**
         * Cria uma caixa de sele&ccedil;&atilde;o para escolha do estilo a ser utilizado
         */
        caixaEstilos : function() {
            var lista = i3GEO.util.listaChaves(i3GEO.desenho.estilos), n = lista.length, i, caixa, sel;
            caixa = "<select class='form-control' onchange='i3GEO.desenho.definePadrao(this.value)'>";
            for (i = 0; i < n; i += 1) {
                sel = "";
                if (lista[i] === i3GEO.desenho.estiloPadrao) {
                    sel = "select";
                }
                caixa += "<option value='" + lista[i] + "'" + sel + ">" + lista[i] + "</option>";
            }
            caixa += "</select>";
            return caixa;
        },
        definePadrao : function(valor){
            i3GEO.desenho.estiloPadrao = valor;
        },
        /**
         * Function: addBox
         *
         * Adiciona um retangulo
         *
         * Parameter:
         *
         * {numeric} - novo xmin
         *
         * {numeric} - novo ymin
         *
         * {numeric} - novo xmax
         *
         * {numeric} - novo ymax
         *
         * {string} - namespace que identifica o elemento grafico, permitindo busca
         *
         * {string} - cor do contorno
         *
         * {string} - expessura do contorno
         */
        addBox : function(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth) {
            var pol, f;
            if (!namespace) {
                namespace = "box";
            }
            if (!strokeColor) {
                strokeColor = "#FF0000";
            }
            if (!strokeWidth) {
                strokeWidth = 2;
            }
            i3GEO.desenho.inicia();
            xmin = xmin * 1;
            ymin = ymin * 1;
            xmax = xmax * 1;
            ymax = ymax * 1;
            pol = new ol.geom.Polygon([[[xmin,ymin],[xmin,ymax],[xmax,ymax],[xmax,ymin],[xmin,ymin]]]);
            pol = i3GEO.util.extGeo2OSM(pol);
            f = new ol.Feature({
                geometry: pol
            });
            f.setStyle(
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: strokeColor,
                            width: strokeWidth
                        })
                    })
            );
            f.setProperties({
                origem : namespace
            });
            f.setId(i3GEO.util.uid());
            i3GEO.editor.setStyleDefault(f);
            i3GEO.desenho.layergrafico.getSource().addFeature(f);
            i3GEO.editor.tableRefresh();
            return f;
        },
        /**
         * Function: moveBox
         *
         * Reposiciona um retangulo
         *
         * Parameter:
         *
         * {object} - box
         *
         * {numeric} - novo xmin
         *
         * {numeric} - novo ymin
         *
         * {numeric} - novo xmax
         *
         * {numeric} - novo ymax
         */
        moveBox : function(box, xmin, ymin, xmax, ymax) {
            pol = new ol.geom.Polygon([[[xmin,ymin],[xmin,ymax],[xmax,ymax],[xmax,ymin],[xmin,ymin]]]);
            pol = i3GEO.util.extGeo2OSM(pol);
            box.getGeometry().setCoordinates(pol.getCoordinates());
            return box;
        },
        /**
         * Function: removeBox
         *
         * Remove box do mapa (apenas alias para removePins)
         *
         * Parameter:
         *
         * {string} - namespace que identifica o grupo de marcas que serao removidas
         */
        removeBox : function(namespace) {
            i3GEO.desenho.removePins(namespace);
        },
        /**
         * Function: addPin
         *
         * Adiciona uma marca no mapa em uma determinada coordenada
         *
         * Parameters:
         *
         * {numeric} - longitude
         *
         * {numeric} - latitude
         *
         * {numeric} - largura da imagem
         *
         * {numeric} - altura da imagem
         *
         * {string} - namespace utilizado para agrupar a marca, permitindo sua remocao
         *
         * {boolean} - posiciona a marca no centro do ponto
         *
         * {fat} - atributos que serao adicionados a propriedade fat da feature
         *
         * {nameLayer} - string utilizada como nome do layer. Na opcao tooltip, se nao for vazio, sera utilizado como o titulo
         *
         * Return:
         *
         * {objeto}
         *
         */
        //addPin : function(x, y, w, h, imagem, namespace, centro, funcaoclick) {
        addPin : function({nameLayer = "", fat = false, x = 0, y = 0, w = 27, h = 27, imagem = "", namespace = "pin", centro = false, funcaoclick = false, tooltiptext = ""} = {}) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.desenho.addPin()");

            //para efeitos de compatibilidade
            if(!x){
                var x = arguments[0],
                y = arguments[1],
                w = arguments[2],
                h = arguments[3],
                imagem = arguments[4],
                namespace = arguments[5],
                centro = arguments[6],
                funcaoclick = arguments[7]
            }
            if(isNaN(x)){
                return;
            }
            if (!imagem || imagem === "") {
                imagem = i3GEO.configura.locaplic + "/imagens/google/confluence.png";
            }
            if(!nameLayer){
                nameLayer = "";
            }
            if (!funcaoclick) {
                funcaoclick = function() {
                    i3GEO.desenho.removePins(namespace);
                };
            }
            i3GEO.desenho.inicia();
            var point, f, ox, oy;
            if (centro === true) {
                ox = 0.5;
                oy = 0.5;
            } else {
                ox = 0.5;
                oy = 1;
            }
            point = i3GEO.util.extGeo2OSM(new ol.geom.Point([x, y]));
            f = new ol.Feature({
                geometry: point
            });
            f.setProperties({
                origem : namespace
            });
            //objeto com atributos
            if(fat){
                f.setProperties({
                    fat : fat,
                    nameLayer: nameLayer
                });
            }
            f.setStyle(
                    new ol.style.Style({
                        image: new ol.style.Icon({
                            src : imagem,
                            size: [w,h],
                            anchor: [ox,oy]
                        })
                    })
            );
            f.setId(i3GEO.util.uid());
            if (tooltiptext && tooltiptext != ""){
                f.set("tooltiptext", tooltiptext, true);
            }
            i3GEO.editor.setStyleDefault(f);
            i3GEO.desenho.layergrafico.getSource().addFeature(f);
            i3GEO.editor.tableRefresh();
            return f;
        },
        /**
         * Function: removePins
         *
         * Remove marcas do mapa
         *
         * Parameter:
         *
         * {string} - namespace que identifica o grupo de marcas que serao removidas
         */
        removePins : function(namespace) {
            if (!namespace) {
                namespace = "pin";
            }
            if (i3GEO.desenho.layergrafico) {
                var features, n, f, i, remover = [];
                features = i3GEO.desenho.layergrafico.getSource().getFeatures();
                n = features.length;
                for (i = 0; i < n; i++) {
                    if(features[i].get("origem") == namespace){
                        remover.push(features[i]);
                    }
                }
                n = remover.length;
                for (i = 0; i < n; i++) {
                    i3GEO.desenho.layergrafico.getSource().removeFeature(remover[i]);
                }
                i3GEO.editor.tableRefresh();
            }
        },
        /**
         * Function: movePin
         *
         * Reposiciona uma marca
         *
         * Parameter:
         *
         * {object} - marca
         *
         * {numeric} - novo x
         *
         * {numeric} - novo y
         */
        movePin : function(pin, x, y) {
            var point = i3GEO.util.extGeo2OSM(new ol.geom.Point([x, y]));
            pin.getGeometry().setCoordinates(point.getCoordinates());
        },
        criaLayerGrafico : function(){
            if (!i3GEO.desenho.layergrafico) {
                i3GEO.desenho.layergrafico = new ol.layer.Vector({
                    source : new ol.source.Vector({
                        features : new ol.Collection(),
                        useSpatialIndex : true
                    }),
                    style : new ol.style.Style({
                        fill : new ol.style.Fill({
                            color : 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke : new ol.style.Stroke({
                            color : '#ffcc33',
                            width : 4
                        }),
                        image : new ol.style.Circle({
                            radius : 7,
                            fill : new ol.style.Fill({
                                color : '#ffcc33'
                            })
                        })
                    })
                });
                i3GEO.desenho.layergrafico.setProperties(
                        {
                            "layerGr" : true,
                            "name" : "i3GEOdesenho",
                            "title" : $trad("layerDesenho"),
                            "isBaseLayer" : false
                        },
                        true);
                i3GEO.desenho.layergrafico.setMap(i3geoOL);
                i3GEO.desenho.layergrafico.getFeatures = function(){
                    return i3GEO.desenho.layergrafico.getSource().getFeatures();
                };
                i3GEO.editor.criaLayerBackup();
            }
        },
        /**
         * Function: inicia
         *
         * Cria o layer onde os desenhos serao inseridos
         */
        inicia : function() {
            if (!i3GEO.desenho.layergrafico) {
                i3GEO.desenho.criaLayerGrafico();
            }
        },
        adicionaFeatureWkt : function(wkt, atributos) {
            var f, fwkt = new OpenLayers.Format.WKT();

            if (atributos.externalGraphic && atributos.externalGraphic != "") {
                var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style_mark.externalGraphic = atributos.externalGraphic;
                style_mark.graphicWidth = atributos.graphicWidth;
                style_mark.graphicHeight = atributos.graphicHeight;
                style_mark.fillOpacity = atributos.opacidade;
                f = fwkt.read(wkt);
                f["attributes"] = atributos;
                f["style"] = style_mark;
            } else {
                f = fwkt.read(wkt);
                f["attributes"] = atributos;
            }
            i3GEO.desenho.layergrafico.addFeatures([
                f
                ]);
        }
};
