if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
//os botoes sao inseridos em cada layer grafico na arvore de camadas
//veja em js/arvoredecamadas.js -> adicionaLayersGr
i3GEO.editor =
{
        _mascCompose: "",
        _interacoes: "",
        _idsSelecionados: [],
        _copia: [],
        _backup : new ol.layer.Vector({
            source : new ol.source.Vector({
                features : new ol.Collection(),
                useSpatialIndex : false,
                name : "Backup"
            }),
            //map : i3geoOL,
            visible : false
        }),
        _featuresBackup : [],
        _simbologia : {
            opacidade : 0.4,
            texto : "",
            fillColor : "250,180,15",
            strokeWidth : 5,
            strokeColor : "250,150,0",
            pointRadius : 6,
            graphicName : "square",
            fontSize : "12px",
            fontColor : "0,0,0",
            externalGraphic : "",
            graphicHeight : 25,
            graphicWidth : 25
        },
        _freehand : false,
        _snap : false,
        _snapInteraction: "",
        _tolerance: 10,
        blockIcons: function(btn){
            $(".editorIcon").removeClass("editorBlock");
            if (btn){
                $(btn).addClass("editorBlock");
            }
        },
        unblockIcons: function(){
            $(".editorIcon").removeClass("editorBlock");
        },
        toggleSnap: function(){
            if(i3GEO.editor._snap == true){
                i3geoOL.addInteraction(i3GEO.editor.getSnap());
            } else {
                i3geoOL.removeInteraction(i3GEO.editor._snapInteraction);
            }
        },
        getSnap: function(){
            if(i3GEO.editor._snapInteraction == ""){
                i3GEO.editor._snapInteraction = new ol.interaction.Snap({
                    source: i3GEO.desenho.layergrafico.getSource(),
                    pixelTolerance: i3GEO.editor._tolerance
                });
            }
            return i3GEO.editor._snapInteraction;
        },
        ativaIdentifica: function(){
            i3GEO.eventos.cliquePerm.ativa();
            i3GEO.eventos.cliquePerm.ativo = true;
            i3GEO.editor.removeInteracoes();
        },
        copy: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            var f = i3GEO.editor.sel.getFeatures(),
            n = f.length, i = 0, clone;
            i3GEO.editor._copia = [];
            for(i = 0; i < n; i++){
                clone = f[i].clone();
                clone.setId(i3GEO.util.uid());
                i3GEO.editor._copia.push(clone);
                i3GEO.janela.snackBar({content: $trad('copytomemory')});
            }
        },
        needSave: function(feature,save){
            if(feature != undefined){
                feature.set("needSave",save);
            }
        },
        paste: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            if(i3GEO.editor._copia.length == 0){
                i3GEO.janela.snackBar({content: $trad('nomemory'),style: "red"});
                return;
            }
            if (i3GEO.editor._idsSelecionados.length > 0) {
                i3GEO.janela.snackBar({content: $trad('pastetonew')});
                i3GEO.editor.pasteToSel();
            } else {
                i3GEO.editor.pasteNew();
            }
        },
        pasteToSel: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            i3GEO.janela.alerta({
                pergunta: $trad('pasteatt'),
                funcaoOk: function(){
                    if (typeof (console) !== 'undefined')
                        console.info("i3GEO.editor pasteToSel");

                    var features = i3GEO.editor.sel.getFeatures();
                    var att = i3GEO.editor._copia[i3GEO.editor._copia.length - 1].get("fat");
                    if(att){
                        for(var feature of features){
                            //para manter o mesmo id original
                            var colunaidunico = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[att.tema].colunaidunico;
                            if(feature.get("fat") != undefined){
                                att[colunaidunico].valor = feature.get("fat")[colunaidunico].valor;
                            } else {
                                att[colunaidunico].valor = "";
                            }
                            feature.set("fat",att);
                            i3GEO.editor.needSave(feature,true);
                        }
                    }
                    i3GEO.editor._copia = [];
                    i3GEO.editor.tableRefresh();
                }
            } );
        },
        pasteNew: function(){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.editor pasteNew");

            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            var n = i3GEO.editor._copia.length, i = 0, clone;
            for(i = 0; i < n; i++){
                i3GEO.editor._copia[i].setId(i3GEO.util.uid());
                //para forcar a inclusao do registro ao salvar.
                var fat = i3GEO.editor._copia[i].get("fat");
                if(fat){
                    if(fat.tema != ""){
                        var colunaidunico = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[fat.tema].colunaidunico;
                        fat[colunaidunico].valor = "";
                    }
                    fat.tema = "";
                    i3GEO.editor._copia[i].set("fat",fat);
                }
                i3GEO.editor.needSave(i3GEO.editor._copia[i],true);
            }
            i3GEO.desenho.layergrafico.getSource().addFeatures(i3GEO.editor._copia);
            for(i = 0; i < n; i++){
                i3GEO.editor._idsSelecionados.push(i3GEO.editor._copia[i].getId());
            }
            i3GEO.editor._copia = [];
            i3GEO.editor.tableRefresh();
        },
        masc: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            if(i3GEO.editor._mascCompose == ""){
                i3GEO.editor.addMasc();
            } else {
                i3GEO.editor.removeMasc();
            }
        },
        removeMasc: function(){
            ol.Observable.unByKey(i3GEO.editor._mascCompose);
            i3GEO.editor._mascCompose = "";
            i3geoOL.renderSync();
        },
        addMasc: function(){
            var nsel = i3GEO.editor._idsSelecionados.length,
            s = i3GEO.desenho.layergrafico.getSource(),
            feature;
            if(nsel != 1){
                i3GEO.janela.tempoMsg($trad("selum"));
            } else {
                feature = s.getFeatureById(i3GEO.editor._idsSelecionados[0]);
                var style = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(' + i3GEO.editor._simbologia.strokeColor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                        width: i3GEO.editor._simbologia.strokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba('0,0,0,0.1')"
                    })
                });
                var a = i3geoOL.on('precompose', function(event) {
                    var ctx = event.context;
                    var vecCtx = event.vectorContext;
                    ctx.save();
                    vecCtx.drawFeature(feature,style);
                    ctx.clip();
                });
                var b = i3geoOL.on('postcompose', function(event) {
                    var ctx = event.context;
                    ctx.restore();
                });
                i3geoOL.renderSync();
                i3GEO.editor.sel.deleteFeatures();
                i3GEO.editor._mascCompose = [a,b];
            }
        },
        restoreStyleDefault : function(feature){
            var p = feature.getProperties();
            if(p["styleDefault"]){
                feature.setStyle(p["styleDefault"].clone());
                }
        },
        setStyleDefault : function(feature){
            if(feature.getStyle()){
                var p = feature.getProperties();
                feature.setProperties({"styleDefault": feature.getStyle().clone()});
            }
        },
        importFeaturesLayer: function(layerName){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            var processData = function (layerName){
                if(layerName != ""){
                    var after = function(data){
                        i3GEO.mapa.addWktToGraphicLayer(data,layerName);
                    };
                    i3GEO.tema.queryByRect(after,layerName,true);
                }
            };
            if(layerName){
                processData(layerName);
            } else {
                i3GEO.janela.alerta({
                    pergunta: $trad("layerData"),
                    funcaoOk: function(){
                        var layerName = $i("editorOLcomboTemaEditavel").value;
                        processData(layerName);
                    },
                    parametros: {},
                    html: "<div id='editorOLondeComboTemaEditavel'></div>"
                } );
                i3GEO.util.comboTemas(
                        "editorOLcomboTemaEditavel",
                        function(obj){
                            $i("editorOLondeComboTemaEditavel").innerHTML = obj.dados;
                        },
                        "editorOLondeComboTemaEditavel",
                        "",
                        false,
                        "editavel",
                        " ",
                        false,
                        true,
                        "form-control comboTema"
                );
            }
        },
        sel: {
            unselFeature : function(id) {
                i3GEO.editor.sel.un(id);
            },
            confirmDelete: function(){
                i3GEO.editor.unblockIcons();
                i3GEO.editor.ativaIdentifica();
                var x, nsel = i3GEO.editor._idsSelecionados.length;
                i3GEO.editor._featuresBackup = [];
                if(nsel > 0){
                    x = window.confirm($trad("excsel") + "?");
                    if(x){
                        i3GEO.editor.sel.deleteFeatures();
                        i3GEO.desenho.layergrafico.getSource().changed();
                    }
                }
                else{
                    i3GEO.janela.tempoMsg($trad("selum"));
                }
            },
            getFeatures : function(){
                i3GEO.editor.unblockIcons();
                i3GEO.editor.ativaIdentifica();
                var s = i3GEO.desenho.layergrafico.getSource(),
                sel = [],
                f;
                for(const id of i3GEO.editor._idsSelecionados){
                    f = s.getFeatureById(id);
                    if (f) {
                        sel.push(f);
                    }
                }
                return sel;
            },
            getFeaturesByType : function(type) {
                var features = i3GEO.editor.sel.getFeatures(),
                lista = [];
                for(const f of features){
                    if (f.getGeometry().getType() == type) {
                        lista.push(f);
                    }
                }
                return lista;
            },
            deleteFeatures : function(){
                i3GEO.editor.unblockIcons();
                i3GEO.editor.ativaIdentifica();
                var features = i3GEO.editor.sel.getFeatures(),
                s = i3GEO.desenho.layergrafico.getSource();
                for(const f of features){
                    i3GEO.editor._featuresBackup.push(f.clone());
                    s.removeFeature(f);
                }
                i3GEO.editor._idsSelecionados = [];
                i3GEO.editor.tableRefresh();
            },
            all: function(idfeature){
                i3GEO.editor.unblockIcons();
                i3GEO.editor.ativaIdentifica();
                if(!idfeature){
                    i3GEO.editor.sel.un();
                }
                var features, n, f, i, id, st;
                features = i3GEO.desenho.layergrafico.getSource().getFeatures();
                n = features.length;
                for (i = 0; i < n; i++) {
                    f = features[i];
                    id = f.getId();
                    if(idfeature && idfeature != id){
                        continue;
                    }
                    if(!id || id == "" || id == undefined ){
                        id = i3GEO.util.uid();
                        f.setId(id);
                    }
                    if(i3GEO.editor._idsSelecionados.indexOf(id) < 0){
                        i3GEO.editor._idsSelecionados.push(id);
                    }
                    st = f.getStyle();
                    //para o caso de pontos
                    if(st && st.getImage && st.getImage()){
                        f.setStyle(
                                new ol.style.Style({
                                    image: new ol.style.Circle({
                                        radius: i3GEO.editor._simbologia.pointRadius,
                                        fill: new ol.style.Fill({
                                            color: 'rgba(255, 255, 255, 0.5)'
                                        }),
                                        stroke: new ol.style.Stroke({
                                            color: 'blue',
                                            width: i3GEO.editor._simbologia.pointRadius / 3
                                        })
                                    })
                                })
                        );
                    }
                    else if (st){
                        if(st.getFill && st.getFill()){
                            st.getFill().setColor('rgba(255, 255, 255, 0.5)');
                        }
                        if(st.getStroke && st.getStroke()){
                            st.getStroke().setColor('blue');
                        }
                    }
                }
                i3GEO.desenho.layergrafico.getSource().changed();
                i3GEO.editor.tableRefresh();
            },
            un: function(id){
                i3GEO.editor.unblockIcons();
                i3GEO.editor.ativaIdentifica();
                var i, n, f, s, st;
                s = i3GEO.desenho.layergrafico.getSource();
                n = i3GEO.editor._idsSelecionados.length;
                for(i=0; i<n; i++){
                    if(id && id != i3GEO.editor._idsSelecionados[i]){
                        continue;
                    }
                    f = s.getFeatureById(i3GEO.editor._idsSelecionados[i]);
                    if(f){
                        i3GEO.editor.restoreStyleDefault(f);
                    }
                }
                if(id){
                    i3GEO.editor._idsSelecionados.remove(id);
                } else {
                    i3GEO.editor._idsSelecionados = [];
                }
                i3GEO.desenho.layergrafico.getSource().changed();
                i3GEO.editor.tableRefresh();
            },
            one: function(btn){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.blockIcons(btn);
                var sel = new ol.interaction.Select();
                i3GEO.editor._interacoes = sel;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                sel.on("select", function(evt) {
                    var s,i, n, id, f;
                    n = evt.selected.length;
                    for(i=0; i<n; i++){
                        f = evt.selected[i];
                        id = f.getId();
                        if(!id || id == "" || id == undefined ){
                            id = i3GEO.util.uid();
                            f.setId(id);
                        }
                        if(id && i3GEO.util.in_array(id,i3GEO.editor._idsSelecionados)){
                            i3GEO.editor.sel.unselFeature(id);
                        }
                        else{
                            i3GEO.editor._idsSelecionados.push(id);
                            s = f.getStyle();
                            if(s && s.getImage && s.getImage()){
                                f.setStyle(
                                        new ol.style.Style({
                                            image: new ol.style.Circle({
                                                radius: i3GEO.editor._simbologia.pointRadius,
                                                fill: new ol.style.Fill({
                                                    color: 'rgba(255, 255, 255, 0.5)'
                                                }),
                                                stroke: new ol.style.Stroke({
                                                    color: 'blue',
                                                    width: i3GEO.editor._simbologia.pointRadius / 3
                                                })
                                            })
                                        })
                                );
                                if(!s.getImage().getSrc){
                                    f.setProperties({
                                        fillColor: s.getImage().getFill().getColor(),
                                        strokeColor: s.getImage().getStroke().getColor(),
                                        externalGraphic: "",
                                        graphicHeight : 25,
                                        graphicWidth : 25
                                    });
                                }
                                else{
                                    f.setProperties({
                                        fillColor: "",
                                        strokeColor: "",
                                        externalGraphic: s.getImage().getSrc(),
                                        graphicHeight : s.getImage().getSize()[1],
                                        graphicWidth : s.getImage().getSize()[0]
                                    });
                                }
                            }
                            else{
                                s = f.getStyle();
                                f.setProperties({
                                    externalGraphic: "",
                                    graphicHeight : 25,
                                    graphicWidth : 25
                                });
                                if(s && s.getFill()){
                                    f.setProperties({fillColor: s.getFill().getColor()});
                                    s.getFill().setColor('rgba(255, 255, 255, 0.5)');
                                }
                                if(s && s.getStroke()){
                                    f.setProperties({strokeColor: s.getStroke().getColor()});
                                    s.getStroke().setColor('blue');
                                }
                            }
                        }
                    }
                    if (n === 0){
                        i3GEO.editor.sel.un();
                    }
                    /*
                    i3GEO.editor.removeInteracoes();
                    setTimeout(function() {
                        i3GEO.editor.ativaIdentifica();
                    },1000);
                    */
                    i3GEO.desenho.layergrafico.getSource().changed();
                    i3GEO.editor.tableRefresh();
                });
                i3geoOL.addInteraction(sel);
            }
        },
        jsts: {
            run : function(geoms,process){
                if (typeof (console) !== 'undefined')
                    console.log("i3GEO.editor.jsts.run");

                var fwkt = new ol.format.WKT(),
                rwkt = new jsts.io.WKTReader(),
                wwkt = new jsts.io.WKTWriter(),
                n = geoms.length,
                g, i, uniao;
                //converte em wkt
                proc = fwkt.writeFeatures([geoms[0]]);
                //le na jsts
                proc = rwkt.read(proc);

                var substitui = function(proc){
                    proc = wwkt.write(proc);
                    proc = fwkt.readFeature(proc);
                    var g = proc.getGeometry();
                    proc = geoms[0].clone();
                    proc.setGeometry(g);
                    proc.setId(i3GEO.util.uid());
                    i3GEO.editor.needSave(proc,true);
                    return proc;
                };
                var adiciona = function(proc,style,operacao){
                    proc = wwkt.write(proc);
                    proc = fwkt.readFeature(proc);
                    if(!operacao){
                        operacao = "";
                    }
                    proc.setId(i3GEO.util.uid() + "_" + operacao);
                    if(style){
                        proc.setStyle(style);
                    }
                    i3GEO.editor.setStyleDefault(proc);
                    i3GEO.editor.needSave(proc,true);
                    return proc;
                };
                var polygon2geonjson = function (polygon) {
                    writer = new jsts.io.GeoJSONWriter();
                    var f = {
                            type: "Feature",
                            properties: {},
                            geometry: writer.write(polygon)
                    };
                    return f;
                };
                //https://github.com/focusnet/fi.simosol.focus.map/blob/master/EditToolbar.Split.js
                if(process == "split"){
                    var reader = new jsts.io.GeoJSONReader();
                    //converte em wkt
                    var a = fwkt.writeFeatures([geoms[0]]);
                    //le na jsts
                    a = rwkt.read(a);
                    var b = fwkt.writeFeatures([geoms[1]]);
                    b = rwkt.read(b);
                    var union = a.getExteriorRing().union(b);
                    var interiorRingNum = a.getNumInteriorRing();
                    var interiorRings = [];
                    for (var i = 0; i < interiorRingNum; ++i) {
                        var ir = a.getInteriorRingN(i);
                        var fact = new jsts.geom.GeometryFactory();
                        var poly = new jsts.geom.Polygon(ir, null, fact);
                        interiorRings.push(polygon2geonjson(poly));
                    }
                    var polygonizer = new jsts.operation.polygonize.Polygonizer();
                    polygonizer.add(union);
                    output = [];
                    var polygons = polygonizer.getPolygons();
                    polygons.toArray().forEach(function (poly) {
                        output.push(adiciona(poly,i3GEO.editor.getPolygonStyle()));
                    });
                    return output;
                }
                if(process == "union"){
                    for (i = 1; i < n; i++) {
                        g = fwkt.writeFeatures([geoms[i]]);
                        proc = proc.union(rwkt.read(g));
                    }
                    var estilo = geoms[0].getProperties()["styleDefault"].clone();
                    return adiciona(proc,estilo,"union");
                }
                if(process == "convexHull"){
                    var lista = [];
                    for (i = 0; i < n; i++) {
                        g = fwkt.writeFeatures([geoms[i]]);
                        lista.push(rwkt.read(g));
                    }
                    var colecao = new jsts.geom.GeometryFactory().createGeometryCollection(lista);
                    var geometria = colecao.convexHull();
                    var estilo = geoms[0].getProperties()["styleDefault"].clone();
                    return adiciona(geometria,estilo,"convexHull");
                }
                if(process == "boundary"){
                    var lista = [];
                    for (i = 0; i < n; i++) {
                        lista.push(geoms[i].getGeometry());
                    }
                    var colecao = new ol.geom.GeometryCollection(lista);
                    var geometria = ol.geom.Polygon.fromExtent(colecao.getExtent());
                    var estilo = geoms[0].getProperties()["styleDefault"].clone();
                    var feature = new ol.Feature({
                        geometry: geometria
                    });
                    feature.setId(i3GEO.util.uid() + "_" + "boundary");
                    feature.setStyle(estilo);
                    i3GEO.editor.setStyleDefault(feature);
                    i3GEO.editor.needSave(feature,true);
                    return feature;
                }
                if(process == "intersection"){
                    for (i = 1; i < n; i++) {
                        g = fwkt.writeFeatures([geoms[i]]);
                        proc = proc.intersection(rwkt.read(g));
                    }
                    var estilo = geoms[0].getProperties()["styleDefault"].clone();
                    return adiciona(proc,estilo,"intersection");
                }
                if(process == "symDifference"){
                    for (i = 1; i < n; i++) {
                        g = fwkt.writeFeatures([geoms[i]]);
                        proc = proc.symDifference(rwkt.read(g));
                    }
                    var estilo = geoms[0].getProperties()["styleDefault"].clone();
                    return adiciona(proc,estilo,"symDifference");
                }
                if(process == "difference"){
                    for (i = 1; i < n; i++) {
                        g = fwkt.writeFeatures([geoms[i]]);
                        proc = proc.difference(rwkt.read(g));
                    }
                    var estilo = geoms[0].getProperties()["styleDefault"].clone();
                    return adiciona(proc,estilo,"difference");
                }
                if(process == "fillRing"){
                    var linearring = proc.getExteriorRing();
                    var pol = new jsts.geom.GeometryFactory().createPolygon(linearring);
                    var diference = pol.difference(proc);
                    return adiciona(diference,i3GEO.editor.getPolygonStyle());
                }
            },
            split: function(polis){
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var temp = i3GEO.editor.jsts.run(polis,"split");
                if(temp){
                    return temp;
                } else {
                    return false;
                }
            },
            fillRing: function(){
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                if(i3GEO.editor._idsSelecionados.length != 1){
                    i3GEO.janela.tempoMsg($trad("selum"));
                    return;
                }
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                temp = i3GEO.editor.jsts.run(polis,"fillRing");
                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                    i3GEO.editor.sel.all(temp.getId());
                    i3GEO.editor.tableRefresh();
                }
            },
            union : function() {
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                if(polis.length < 2){
                    i3GEO.janela.tempoMsg($trad("selduas"));
                    return;
                }
                temp = i3GEO.editor.jsts.run(polis,"union");

                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                }
                i3GEO.editor.tableRefresh();
            },
            convexHull : function(){
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                if(polis.length < 1){
                    i3GEO.janela.tempoMsg($trad("selum"));
                    return;
                }
                temp = i3GEO.editor.jsts.run(polis,"convexHull");

                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                }
                i3GEO.editor.tableRefresh();
            },
            boundary : function(){
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                if(polis.length < 1){
                    i3GEO.janela.tempoMsg($trad("selum"));
                    return;
                }
                temp = i3GEO.editor.jsts.run(polis,"boundary");
                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                }
                i3GEO.editor.tableRefresh();
            },
            intersect : function() {
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                if(polis.length < 2){
                    i3GEO.janela.tempoMsg($trad("selduas"));
                    return;
                }
                temp = i3GEO.editor.jsts.run(polis,"intersection");

                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                }
                i3GEO.editor.tableRefresh();
            },
            symdif : function() {
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                if(polis.length < 2){
                    i3GEO.janela.tempoMsg($trad("selduas"));
                    return;
                }
                temp = i3GEO.editor.jsts.run(polis,"symDifference");
                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                }
                i3GEO.editor.tableRefresh();
            },
            dif : function() {
                i3GEO.editor.ativaIdentifica();
                i3GEO.editor.unblockIcons();
                var polis = i3GEO.editor.sel.getFeatures(),
                temp;
                if(polis.length < 2){
                    i3GEO.janela.tempoMsg($trad("selduas"));
                    return;
                }
                temp = i3GEO.editor.jsts.run(polis,"difference");
                if(temp){
                    i3GEO.editor.needSave(temp,true);
                    i3GEO.desenho.layergrafico.getSource().addFeatures([temp]);
                }
                i3GEO.editor.tableRefresh();
            }
        },
        draw: {
            editSplit: function(){
                var nsel = i3GEO.editor._idsSelecionados.length;
                if (nsel != 1) {
                    i3GEO.janela.tempoMsg($trad("selCorta"));
                } else {
                    i3GEO.eventos.cliquePerm.desativa();
                    i3GEO.editor.removeInteracoes();
                    i3GEO.editor.unblockIcons();
                    i3GEO.janela.tempoMsg($trad("desLin"));
                    var draw = new ol.interaction.Draw({
                        type : "LineString"
                    });
                    //adiciona a interacao para poder ser removida
                    i3GEO.editor._interacoes = draw;
                    i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                    draw.on("drawend", function(evt) {
                        var temp, f, c, format, fwkt, cwkt;
                        f = evt.feature;
                        c = i3GEO.desenho.layergrafico.getSource().getFeatureById(i3GEO.editor._idsSelecionados[nsel - 1]);
                        i3GEO.editor.removeInteracoes();
                        i3GEO.editor.ativaIdentifica();
                        if(f && c){
                            var split = i3GEO.editor.jsts.split([c,f]);
                            if(split.length > 1){
                                var original = split.shift();
                                c.setGeometry(original.getGeometry());
                                i3GEO.editor.needSave(split,true);
                                i3GEO.desenho.layergrafico.getSource().addFeatures(split);
                            }
                        }
                        i3GEO.editor.tableRefresh();
                    });
                    i3geoOL.addInteraction(draw);
                }
            },
            editCut: function(){
                var nsel = i3GEO.editor._idsSelecionados.length;
                if (nsel != 1) {
                    i3GEO.janela.tempoMsg($trad("selCorta"));
                } else {
                    i3GEO.eventos.cliquePerm.desativa();
                    i3GEO.editor.removeInteracoes();
                    i3GEO.editor.unblockIcons();
                    i3GEO.janela.tempoMsg($trad("desPol"));
                    var draw = new ol.interaction.Draw({
                        type : "Polygon"
                    });
                    //adiciona a interacao para poder ser removida
                    i3GEO.editor._interacoes = draw;
                    i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                    draw.on("drawend", function(evt) {
                        var temp, f, c, format, fwkt, cwkt;
                        f = evt.feature;
                        c = i3GEO.desenho.layergrafico.getSource().getFeatureById(i3GEO.editor._idsSelecionados[nsel - 1]);
                        i3GEO.editor._featuresBackup.push(c.clone());
                        //corta
                        format = new ol.format.WKT();
                        if(f && c){
                            fwkt = format.writeFeatures([f]);
                            cwkt = format.writeFeatures([c]);
                            if(fwkt && cwkt){
                                temp = function(data) {
                                    i3GEO.janela.fechaAguarde("i3GEO.cortador");
                                    if (data && data != "") {
                                        c.setGeometry(format.readGeometry(data));
                                        i3GEO.editor.tableRefresh();
                                    }
                                    i3GEO.editor.ativaIdentifica();
                                };
                                i3GEO.janela.abreAguarde("i3GEO.cortador", "Cortando");
                                i3GEO.editor.difference(temp, cwkt + "|" + fwkt, "difference");
                            }
                        }
                        i3GEO.editor.tableRefresh();

                    });
                    i3geoOL.addInteraction(draw);
                }
            },
            rectangle : function (btn,drawendcallback){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.blockIcons(btn);
                var draw = new ol.interaction.Draw({
                    type: "Circle",
                    geometryFunction: ol.interaction.Draw.createBox()
                });
                //adiciona a interacao para poder ser removida
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                draw.on("drawend", function(evt) {
                    evt.feature.setStyle(
                            i3GEO.editor.getPolygonStyle()
                    );
                    i3GEO.editor.setStyleDefault(evt.feature);
                    evt.feature.setId(i3GEO.util.uid() + "_rectangle");
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    i3GEO.editor.removeInteracoes();
                    setTimeout(function() {
                        i3GEO.editor.ativaIdentifica();
                    },1000);
                    i3GEO.editor.needSave(evt.feature,true);
                    i3GEO.editor.tableRefresh();
                });
                if(drawendcallback){
                    draw.on("drawend",drawendcallback);
                }
                i3geoOL.addInteraction(draw);
                i3GEO.editor.toggleSnap();
            },
            text : function(drawendcallback){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.unblockIcons();
                var draw = new ol.interaction.Draw({
                    type : "Point"
                });
                //adiciona a interacao para poder ser removida
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                draw.on("drawend", function(evt) {
                    var texto = window.prompt("Texto", "");
                    evt.feature.setStyle(
                            i3GEO.editor.getTextStyle(texto)
                    );
                    i3GEO.editor.setStyleDefault(evt.feature);
                    evt.feature.setId(i3GEO.util.uid() + "_text");
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    i3GEO.editor.removeInteracoes();
                    setTimeout(function() {
                        i3GEO.editor.ativaIdentifica();
                    },1000);
                    i3GEO.editor.tableRefresh();
                });
                if(drawendcallback){
                    draw.on("drawend",drawendcallback);
                }
                i3geoOL.addInteraction(draw);
            },
            gps : function(drawendcallback){
                i3GEO.editor.unblockIcons();
                i3GEO.geolocal.events.add("afterShowOrMovePoint",function(xy){
                    var feature = new ol.Feature({
                        geometry: i3GEO.util.extGeo2OSM(new ol.geom.Point(xy))
                    });
                    feature.setStyle(
                            i3GEO.editor.getPointStyle()
                    );
                    i3GEO.editor.setStyleDefault(feature);
                    feature.setId(i3GEO.util.uid()  + "_gps");
                    i3GEO.desenho.layergrafico.getSource().addFeature(feature);
                    i3GEO.editor.needSave(feature,true);
                    i3GEO.editor.tableRefresh();
                });
                i3GEO.geolocal.start();
            },
            point : function(btn,drawendcallback){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.blockIcons(btn);
                var draw = new ol.interaction.Draw({
                    type : "Point"
                });
                //adiciona a interacao para poder ser removida
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                draw.on("drawend", function(evt) {
                    evt.feature.setStyle(
                            i3GEO.editor.getPointStyle()
                    );
                    i3GEO.editor.setStyleDefault(evt.feature);
                    evt.feature.setId(i3GEO.util.uid() + "_point");
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    i3GEO.editor.removeInteracoes();
                    setTimeout(function() {
                        i3GEO.editor.ativaIdentifica();
                    },1000);
                    i3GEO.editor.needSave(evt.feature,true);
                    i3GEO.editor.tableRefresh();
                });
                if(drawendcallback){
                    draw.on("drawend",drawendcallback);
                }
                i3geoOL.addInteraction(draw);
                i3GEO.editor.toggleSnap();
            },
            lineString : function(btn,drawendcallback){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.blockIcons(btn);

                var draw = new ol.interaction.Draw({
                    type : "LineString"
                });
                //adiciona a interacao para poder ser removida
                i3GEO.editor._interacoes = draw;
                //desativa ol.interaction.DoubleClickZoom
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                draw.on("drawend", function(evt) {
                    evt.feature.setStyle(
                            i3GEO.editor.getLineStringStyle()
                    );
                    i3GEO.editor.setStyleDefault(evt.feature);
                    evt.feature.setId(i3GEO.util.uid() + "_line");
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    //i3GEO.editor.ativaIdentifica();
                    i3GEO.editor.needSave(evt.feature,true);
                    i3GEO.editor.tableRefresh();
                });
                if(drawendcallback){
                    draw.on("drawend",drawendcallback);
                }
                i3geoOL.addInteraction(draw);
                i3GEO.editor.toggleSnap();
            },
            polygon : function(btn,drawendcallback){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.blockIcons(btn);
                var draw = new ol.interaction.Draw({
                    type : "Polygon",
                    freehand : i3GEO.editor._freehand
                });
                //adiciona a interacao para poder ser removida
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                draw.on("drawend", function(evt) {
                    evt.feature.setStyle(
                            i3GEO.editor.getPolygonStyle()
                    );
                    i3GEO.editor.setStyleDefault(evt.feature);
                    evt.feature.setId(i3GEO.util.uid() + "_poly");
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    //i3GEO.editor.ativaIdentifica();
                    i3GEO.editor.needSave(evt.feature,true);
                    i3GEO.editor.tableRefresh();
                });
                if(drawendcallback){
                    draw.on("drawend",drawendcallback);
                }
                i3geoOL.addInteraction(draw);
                i3GEO.editor.toggleSnap();
            },
            circle : function(btn,drawendcallback){
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.blockIcons(btn);
                var draw = new ol.interaction.Draw({
                    type : "Circle"
                });
                //adiciona a interacao para poder ser removida
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                draw.on("drawend", function(evt) {
                    evt.feature.setStyle(
                            i3GEO.editor.getPolygonStyle()
                    );
                    i3GEO.editor.setStyleDefault(evt.feature);
                    evt.feature.setId(i3GEO.util.uid() + "_circle");
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    i3GEO.editor.needSave(evt.feature,true);
                    i3GEO.editor.tableRefresh();
                });
                if(drawendcallback){
                    draw.on("drawend",drawendcallback);
                }
                i3geoOL.addInteraction(draw);
                i3GEO.editor.toggleSnap();
            }
        },
        removeInteracoes: function(){
            i3GEO.editor.unblockIcons();
            if(i3GEO.editor._interacoes instanceof ol.interaction.Modify) {
                var s, i, nsel, f;
                nsel = i3GEO.editor._idsSelecionados.length;
                s = i3GEO.desenho.layergrafico.getSource();
                for(i=0; i<nsel; i++){
                    f = s.getFeatureById(i3GEO.editor._idsSelecionados[i]);
                    if(f){
                        i3GEO.editor.restoreStyleDefault(f);
                    }
                }
                i3GEO.editor._idsSelecionados = [];
                i3GEO.editor.tableRefresh();
            }
            i3geoOL.removeInteraction(i3GEO.editor._interacoes);
            i3GEO.editor._interacoes = "";
        },
        deleteFeatureById : function(id){
            var s = i3GEO.desenho.layergrafico.getSource(), f = s.getFeatureById(id);
            if(f){
                i3GEO.editor._featuresBackup.push(f.clone());
                s.removeFeature(f);
                i3GEO.editor._idsSelecionados.remove(id);
                i3GEO.editor.tableRefresh();
            }
        },
        edit: function(btn){
            if(i3GEO.editor._interacoes instanceof ol.interaction.Modify){
                i3GEO.editor.removeInteracoes();
                i3GEO.editor.ativaIdentifica();
                return;
            }
            i3GEO.editor.blockIcons(btn);
            i3GEO.editor._featuresBackup = [];
            var draw, nsel, f, c;
            nsel = i3GEO.editor._idsSelecionados.length;
            if(nsel == 1){
                i3GEO.janela.tempoMsg($trad("shiftdel"));
                i3GEO.editor.removeInteracoes();
                i3GEO.eventos.cliquePerm.desativa();
                f = i3GEO.desenho.layergrafico.getSource().getFeatureById(i3GEO.editor._idsSelecionados[nsel - 1]);
                i3GEO.editor._featuresBackup.push(f.clone());
                c = new ol.Collection();
                f.setStyle(
                        i3GEO.editor.getVerticeStyle("0,0,255")
                );
                c.push(f);
                draw = new ol.interaction.Modify({
                    features: c,
                    deleteCondition: function(event) {
                        return ol.events.condition.shiftKeyOnly(event) &&
                        ol.events.condition.singleClick(event);
                    }
                });
                draw.on("modifyend", function(evt) {
                    evt.features.forEach(function (f) {
                        i3GEO.editor.needSave(f,true);
                    });
                    i3GEO.editor.tableRefresh();
                });
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                i3geoOL.addInteraction(draw);
                i3GEO.editor.toggleSnap();
            }
            else{
                i3GEO.janela.tempoMsg($trad("seluma"));
            }
        },
        orderToFront: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            var nsel = i3GEO.editor._idsSelecionados.length;
            if(nsel > 0){
                var f, s, i, nsel, id, clone;
                s = i3GEO.desenho.layergrafico.getSource();
                nsel = i3GEO.editor._idsSelecionados.length;
                for(i=0; i<nsel; i++){
                    f = s.getFeatureById(i3GEO.editor._idsSelecionados[i]);
                    if(f){
                        clone = f.clone();
                        id = f.getId();
                        s.removeFeature(f);
                        clone.setId(id);
                        s.addFeature(clone);
                    }
                }
                s.changed();
            }
            else{
                i3GEO.janela.tempoMsg($trad("selum"));
            }
        },
        group: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            var features = i3GEO.editor.sel.getFeatures();
            if(features.length < 2){
                i3GEO.janela.tempoMsg($trad("selduas"));
                return;
            }
            var type = features[0].getGeometry().getType();
            features = i3GEO.editor.sel.getFeaturesByType(type);
            if(type == "Polygon"){
                var geometry = new ol.geom.MultiPolygon();
                for (const feature of features) {
                    geometry.appendPolygon(feature.getGeometry());
                }
            }
            if(type == "Point"){
                var geometry = new ol.geom.MultiPoint();
                for (const feature of features) {
                    geometry.appendPoint(feature.getGeometry());
                }
            }
            if(type == "LineString"){
                var geometry = new ol.geom.MultiLineString();
                for (const feature of features) {
                    geometry.appendLineString(feature.getGeometry());
                }
            }
            var feature = features[0].clone();
            feature.setGeometry(geometry);
            feature.set("fat",false);
            feature.setId(i3GEO.util.uid() + "_group");
            i3GEO.editor.restoreStyleDefault(feature);
            i3GEO.desenho.layergrafico.getSource().addFeature(feature);
            i3GEO.editor.needSave(feature,true);
            i3GEO.editor.tableRefresh();
        },
        ungroup: function(){
            i3GEO.editor.unblockIcons();
            i3GEO.editor.ativaIdentifica();
            var features = i3GEO.editor.sel.getFeatures();
            if(features.length != 1){
                i3GEO.janela.tempoMsg($trad("seluma"));
                return;
            }
            var geometry = features[0].getGeometry();
            var type = geometry.getType();
            var lista = [];
            if(type == "MultiPolygon"){
                var geoms = geometry.getPolygons();
            }
            if(type == "MultiPoint"){
                var geoms = geometry.getPoints();
            }
            if(type == "MultiLineString"){
                var geoms = geometry.getLineStrings();
            }
            if(geoms && geoms.length > 1){
                for (const geo of geoms) {
                    var f = features[0].clone();
                    f.setGeometry(geo);
                    f.set("fat",false);
                    i3GEO.editor.needSave(f,true);
                    f.setId(i3GEO.util.uid() + "_ungroup");
                    i3GEO.editor.restoreStyleDefault(f);
                    lista.push(f);
                }
                i3GEO.desenho.layergrafico.getSource().addFeatures(lista);
            }
            i3GEO.editor.tableRefresh();
        },
        tableRefresh: function(){
            if(i3GEO.editor.table.seletor && $(".layersGrForm button").length > 0){
                i3GEO.editor.table(i3GEO.editor.table.seletor);
            }
        },
        table: function(seletor){
            i3GEO.editor.table.seletor = seletor;
            var keys,propriedades = [],id, temp, f, geos = i3GEO.desenho.layergrafico.getSource().getFeatures(), n = geos.length, ins = "", botoes = [];
            while (n > 0) {
                n -= 1;
                f = geos[n];
                id = f.getId();
                if(!id || id == "" || id == undefined ){
                    id = i3GEO.util.uid();
                    f.setId(id);
                }
                if(id){
                    botoes = [];
                    propriedades = [];
                    botoes.push({
                        "onclick": "i3GEO.editor.deleteFeatureById('" + id + "')",
                        "title": "Remove",
                        "icone": "clear"
                    });
                    botoes.push({
                        "onclick": "i3GEO.editor.sel.un('" + id + "')",
                        "title": "Unsel",
                        "icone": "check_box_outline_blank",
                        "estiloicon": "color:orange"
                    });
                    botoes.push({
                        "onclick": "i3GEO.editor.sel.all('" + id + "')",
                        "title": "Sel",
                        "icone": "check_box_outline_blank",
                        "estiloicon": "color:blue"
                    });
                    botoes.push({
                        "onclick": "i3GEO.editor.exportFeatureById('" + id + "')",
                        "title": "Export",
                        "icone": "import_export"
                    });
                    var prop = f.getProperties();
                    if(prop.fat && prop.fat.tema && i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[prop.fat.tema].editavel == "SIM"){
                        botoes.push({
                            "onclick": "i3GEO.editor.formEditFeatureById('" + id + "')",
                            "title": "Form",
                            "icone": "message"
                        });
                        if(prop.needSave == true){
                            botoes.push({
                                "onclick": "i3GEO.editor.updateFeatureById('" + id + "')",
                                "title": "Save",
                                "icone": "save",
                                "estiloicon": "color:red"
                            });
                        } else {
                            botoes.push({
                                "onclick": "i3GEO.editor.updateFeatureById('" + id + "')",
                                "title": "Save",
                                "icone": "save"
                            });
                        }
                        botoes.push({
                            "onclick": "i3GEO.editor.deleteForeverFeatureById('" + id + "')",
                            "title": "Delete",
                            "icone": "delete_forever"
                        });
                    } else {
                        if(prop && prop.needSave == true){
                            botoes.push({
                                "onclick": "i3GEO.editor.insertFeatureById('" + id + "')",
                                "title": "Save",
                                "icone": "save",
                                "estiloicon": "color:red"
                            });
                        } else {
                            botoes.push({
                                "onclick": "i3GEO.editor.insertFeatureById('" + id + "')",
                                "title": "Save",
                                "icone": "save"
                            });
                        }
                    }
                    ins += Mustache.render("{{#data}}" + i3GEO.template.botoes.listaDeIcones + "{{/data}}", {data: botoes});
                    var color = "orange";
                    if(i3GEO.editor._idsSelecionados.indexOf(id) >= 0){
                        color = "blue";
                    }
                    ins += " <span style='color:" + color + "' >" + id + " ";
                    if(prop.fat && prop.fat.titulo){
                        ins += " " + prop.fat.titulo + " ";
                    }
                    ins += propriedades.join(" ") + "</span><hr></br>";
                }
            }
            if (geos.length === 0) {
                ins = $trad("meneditor2");
            }
            ins = '<div class="alert alert-info alert-dismissible" role="alert" style="background-color:#d3eaf5;">'
                + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + ins
                + "</div>";
            $(seletor).html(ins);
        },
        properties : function(seletor){
            i3GEO.editor.properties.seletor = seletor;
            var template = "<div class='form-group label-fixed condensed'>"
                + "<label class='control-label' >{{{label}}}</label>"
                + "<input id='{{{id}}}' value='{{{value}}}' name='{{{typesymbol}}}' onchange='i3GEO.editor.setPropertie(\"{{{id}}}\");return false;' class='form-control input-lg {{{class}}}' type='text' />"
                + "</div>";
            var hash = [
                {
                    "label": "Toler&acirc;ncia Snap",
                    "value": i3GEO.editor._tolerance,
                    "typesymbol":"pixelTolerance",
                    "class":"",
                    "id": "i3GEOeditorpixelTolerance"
                },
                {
                    "label": "Cor do contorno",
                    "value": i3GEO.editor._simbologia.strokeColor,
                    "typesymbol":"strokeColor",
                    "class":"i3geoFormIconeAquarela",
                    "id": "i3GEOeditorstrokeColor"
                },
                {
                    "label": "Cor do preenchimento",
                    "value": i3GEO.editor._simbologia.fillColor,
                    "typesymbol":"fillColor",
                    "class":"i3geoFormIconeAquarela",
                    "id": "i3GEOeditorfillColor"
                },
                {
                    "label": "Cor da fonte",
                    "value": i3GEO.editor._simbologia.fontColor,
                    "typesymbol":"fontColor",
                    "class":"i3geoFormIconeAquarela",
                    "id": "i3GEOeditorfontColor"
                },
                {
                    "label": "Tamanho da fonte",
                    "value": i3GEO.editor._simbologia.fontSize,
                    "typesymbol":"fontSize",
                    "class":"",
                    "id": "i3GEOeditorfontSize"
                },
                {
                    "label": "Opacidade (de 0 a 1)",
                    "value": i3GEO.editor._simbologia.opacidade,
                    "typesymbol":"opacidade",
                    "class":"",
                    "id": "i3GEOeditoropacidade"
                },
                {
                    "label": "Largura da linha/contorno",
                    "value": i3GEO.editor._simbologia.strokeWidth,
                    "typesymbol":"strokeWidth",
                    "class":"",
                    "id": "i3GEOeditorstrokeWidth"
                },
                {
                    "label": "Url de uma imagem",
                    "value": i3GEO.editor._simbologia.externalGraphic,
                    "typesymbol":"externalGraphic",
                    "class":"",
                    "id": "i3GEOeditorexternalGraphic"
                },
                {
                    "label": "Largura da imagem",
                    "value": i3GEO.editor._simbologia.graphicWidth,
                    "typesymbol":"graphicWidth",
                    "class":"",
                    "id": "i3GEOeditorgraphicWidth"
                },
                {
                    "label": "Altura da imagem",
                    "value": i3GEO.editor._simbologia.graphicHeight,
                    "typesymbol":"graphicHeight",
                    "class":"",
                    "id": "i3GEOeditorgraphicHeight"
                }
                ];
            ins = '<div class="alert alert-info alert-dismissible" role="alert" style="background-color:#d3eaf5;">'
                + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

            //ins += "<div class='checkbox text-left'><label><input " + (i3GEO.editor._snap == false ? "" : "checked") + " type='checkbox' onclick='javascript:i3GEO.editor._snap = this.checked; i3GEO.editor.toggleSnap();'><span class='checkbox-material noprint'><span class='check'></span></span> " + $trad("ativasnaptol") + " </label></div>";
            ins += "<div class='checkbox text-left'><label><input " + (i3GEO.editor._freehand == false ? "" : "checked") + " type='checkbox' onclick='javascript:i3GEO.editor._freehand = this.checked; '><span class='checkbox-material noprint'><span class='check'></span></span> " + $trad("freehand") + " </label></div>";

            ins += Mustache.render("{{#data}}" + template + "{{/data}}", {data: hash});

            ins += "</div>";
            $(seletor).html(ins);
            $(seletor).find(".i3geoFormIconeAquarela").click(function() {
                if(this.firstChild){
                    i3GEO.util.abreCor("", $(this).find("input")[0].id);
                } else {
                    i3GEO.util.abreCor("", this.id);
                }
            });
        },
        setPropertie: function(id){
            var obj = $i(id),s, i, nsel, f;
            if(obj.name == "pixelTolerance"){
                i3GEO.editor._snap.set("pixelTolerance",obj.value*1);
                return;
            }
            i3GEO.editor._simbologia[obj.name] = obj.value;
            nsel = i3GEO.editor._idsSelecionados.length;
            s = i3GEO.desenho.layergrafico.getSource();
            for(i=0; i<nsel; i++){
                f = s.getFeatureById(i3GEO.editor._idsSelecionados[i]);
                if(f){
                    if(obj.name === "externalGraphic" || obj.name === "graphicWidth" || obj.name === "graphicHeight"){
                        f.setProperties({
                            src: i3GEO.editor._simbologia.externalGraphic,
                            size: [
                                i3GEO.editor._simbologia.graphicWidth,
                                i3GEO.editor._simbologia.graphicHeight
                                ]
                        });
                    }
                    else{
                        f.setProperties({
                            fillColor: 'rgba(' + i3GEO.editor._simbologia.fillColor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                            strokeColor: 'rgba(' + i3GEO.editor._simbologia.strokeColor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                            width: i3GEO.editor._simbologia.strokeWidth,
                            fontSize: i3GEO.editor._simbologia.fontSize,
                            fontColor: i3GEO.editor._simbologia.fontColor
                        });
                    }
                }
            }
        },
        exportFeatureById: function(id){
            var s = i3GEO.desenho.layergrafico.getSource(),
            f = s.getFeatureById(id),
            //w = new Wkt.Wkt(),
            format = new ol.format.WKT();
            f = format.writeFeatures([f]);
            i3GEO.mapa.dialogo.wkt2layer(f);
        },
        insertFeatureById: function(id){
            var funcaoOk = function({id = id}){
                var s = i3GEO.desenho.layergrafico.getSource(),
                f = s.getFeatureById(id),
                format = new ol.format.WKT(),
                par = {};
                par["_tema"] = $i("editorOLcomboTemaEditavel").value;
                par["g_sid"] = i3GEO.configura.sid;
                par["funcao"] = "inserir";
                par["wkt"] = format.writeFeatures([f]);
                var p = i3GEO.editor.post({par: par, elblock: $(".layersGrForm"), id: id});
                if(p == true){
                    i3GEO.editor.needSave(f,true);
                }
            };
            i3GEO.janela.alerta({
                pergunta: $trad("selcomboeditavel"),
                funcaoOk: funcaoOk,
                parametros: {id: id},
                html: "<div id='editorOLondeComboTemaEditavel'></div>"
            } );
            i3GEO.util.comboTemas(
                    "editorOLcomboTemaEditavel",
                    function(obj){
                        $i("editorOLondeComboTemaEditavel").innerHTML = obj.dados;
                    },
                    "editorOLondeComboTemaEditavel",
                    "",
                    false,
                    "editavel",
                    " ",
                    false,
                    true,
                    "form-control comboTema"
            );
        },
        updateFeatureById: function(id){
            if (typeof (console) !== 'undefined')
                console.log("i3GEO.editor.updateFeatureById");

            var s = i3GEO.desenho.layergrafico.getSource(),
            f = s.getFeatureById(id),
            fat = f.getProperties().fat,
            itens = [],
            par = {},
            format = new ol.format.WKT();
            par["_tema"] = fat.tema;
            $.each(fat,function(i,e){
                if(e.item){
                    itens.push(e.item);
                    par[e.item] = e.valor;
                }
            });
            par["_itens"] = itens.join(",");
            par["g_sid"] = i3GEO.configura.sid;
            par["funcao"] = "salvar";
            par["wkt"] = format.writeFeatures([f]);
            var p = i3GEO.editor.post({par: par, elblock: $(".layersGrForm"), id: id});
            if(p == true){
                i3GEO.editor.needSave(f,true);
            }
        },
        deleteForeverFeatureById: function(id){
            if (typeof (console) !== 'undefined')
                console.log("i3GEO.editor.deleteForeverFeatureById");

            i3GEO.editor.ativaIdentifica();
            var funcaoOk = function({id = id}){
                var s = i3GEO.desenho.layergrafico.getSource(),
                f = s.getFeatureById(id),
                fat = f.getProperties().fat,
                par = {};
                par["_tema"] = fat.tema;
                $.each(fat,function(i,e){
                    if(e.item){
                        par[e.item] = e.valor;
                    }
                });
                par["g_sid"] = i3GEO.configura.sid;
                par["funcao"] = "excluir";
                i3GEO.editor.post({par: par, elblock: $(".layersGrForm"), id: id});
            };
            i3GEO.janela.alerta({pergunta: $trad("delfeature"), funcaoOk: funcaoOk, parametros: {id: id}} );
        },
        formEditFeatureById: function(id){
            var data = [],
            ins = "",
            idbtn = i3GEO.util.uid(),
            s = i3GEO.desenho.layergrafico.getSource(),
            f = s.getFeatureById(id),
            fat = f.getProperties().fat;
            $.each(fat,function(i,e){
                if(typeof e === 'object'){
                    //para efeitos de compatibilidade
                    if(e.item){
                        data.push({
                            "name": e.item,
                            "label": e.alias,
                            "value": e.valor
                        });
                    } else {
                        data.push({
                            "name": e.column,
                            "label": e.alias,
                            "value": e.value
                        });
                    }
                }
            });
            ins = "<div class='container-fluid'>"
                + "<form class='form-horizontal'>"
                + Mustache.render("{{#data}}" + i3GEO.template.forms.horizontaltextinput + "{{/data}}", {data: data})
                + "</div></div>";

            ins += Mustache.render(
                    i3GEO.template.botoes.padrao,
                    {
                        id: idbtn,
                        text: $trad("p14")
                    });

            i3GEO.janela.formModal({
                texto: ins,
                resizable: {
                    disabled: false,
                    ghost: true,
                    handles: "se,n"
                }
            });
            $("#"+idbtn).on("click", {feature: f}, function(e){
                var fat = f.getProperties().fat;
                var data = i3GEO.util.getFormData("#i3GEOToolFormModal form");
                $.each(Object.keys(data),function(i,e){
                    fat[e].valor = data[e];
                });
                i3GEO.janela.formModal();
                if(i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[prop.fat.tema].editavel == "SIM"){
                    i3GEO.janela.snackBar({content: $trad('editorsalvar')});
                }
            });
        },
        panSelection : function(btn){
            i3GEO.editor._featuresBackup = [];
            var draw, nsel, f, c;
            nsel = i3GEO.editor._idsSelecionados.length;
            if(nsel == 1){
                i3GEO.editor.removeInteracoes();
                i3GEO.eventos.cliquePerm.desativa();
                i3GEO.editor.blockIcons(btn);
                f = i3GEO.desenho.layergrafico.getSource().getFeatureById(i3GEO.editor._idsSelecionados[nsel - 1]);
                i3GEO.editor._featuresBackup.push(f.clone());
                c = new ol.Collection();
                c.push(f);
                draw = new ol.interaction.Translate({
                    features: c
                });
                draw.on("translateend",function(evt){
                });
                i3GEO.editor._interacoes = draw;
                i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
                i3geoOL.addInteraction(draw);
            }
            else{
                i3GEO.janela.tempoMsg($trad("seluma"));
            }
        },
        criaLayerBackup : function(){
            if (i3GEO.editor && !i3GEO.editor._backup) {
                i3GEO.editor._backup = new ol.layer.Vector({
                    source : new ol.source.Vector({
                        features : new ol.Collection(),
                        useSpatialIndex : false,
                        name : "Backup"
                    }),
                    visible: false
                });
                i3GEO.editor._backup.setMap(i3geoOL);
                i3GEO.editor._backup.getFeatures = function(){
                    return i3GEO.editor._backup.getSource().getFeatures();
                };
            }
        },
        setStyleByTypeFeature: function(feature){
            var tipo = feature.getGeometry().getType();
            //'Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString',
            //'MultiPolygon', 'GeometryCollection', 'Circle'
            if(tipo == "Point" || tipo == "MultiPoint"){
                feature.setStyle(i3GEO.editor.getPointStyle());
            } else if (tipo == "LineString" || tipo == "MultiLineString" || tipo == "LinearRing"){
                feature.setStyle(i3GEO.editor.getLineStringStyle());
            } else {
                feature.setStyle(i3GEO.editor.getPolygonStyle());
            }
        },
        getPolygonStyle: function(){
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(' + i3GEO.editor._simbologia.strokeColor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                    width: i3GEO.editor._simbologia.strokeWidth
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(' + i3GEO.editor._simbologia.fillColor + ',' + i3GEO.editor._simbologia.opacidade + ')'
                })
            });
        },
        getLineStringStyle: function(strokecolor){
            if(!strokecolor){
                strokecolor = i3GEO.editor._simbologia.strokeColor;
            }
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(' + strokecolor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                    width: i3GEO.editor._simbologia.strokeWidth
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(' + i3GEO.editor._simbologia.fillColor + ',' + i3GEO.editor._simbologia.opacidade + ')'
                })
            });
        },
        getVerticeStyle: function(strokecolor){
            if(!strokecolor){
                strokecolor = i3GEO.editor._simbologia.strokeColor;
            }
            var v = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: i3GEO.editor._simbologia.pointRadius,
                    fill: new ol.style.Fill({
                        color: 'rgba(' + i3GEO.editor._simbologia.fillColor + ',' + i3GEO.editor._simbologia.opacidade + ')'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(' + strokecolor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                        width: i3GEO.editor._simbologia.pointRadius / 3
                    })
                }),
                geometry: function(feature) {
                    // return the coordinates of the first ring of the polygon
                    var coordinates = feature.getGeometry().getCoordinates()[0];
                    return new ol.geom.MultiPoint(coordinates);
                }
            });
            return [i3GEO.editor.getLineStringStyle(strokecolor),v];
        },
        getPointStyle: function(){
            var simbolo, url;
            url = i3GEO.editor._simbologia.externalGraphic;
            if(url === ""){
                simbolo = new ol.style.Circle({
                    radius: i3GEO.editor._simbologia.pointRadius,
                    fill: new ol.style.Fill({
                        color: 'rgba(' + i3GEO.editor._simbologia.fillColor + ',' + i3GEO.editor._simbologia.opacidade + ')'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(' + i3GEO.editor._simbologia.strokeColor + ',' + i3GEO.editor._simbologia.opacidade + ')',
                        width: i3GEO.editor._simbologia.pointRadius / 3
                    })
                });
            }
            else{
                simbolo = new ol.style.Icon({
                    src : url,
                    size : [i3GEO.editor._simbologia.graphicWidth,i3GEO.editor._simbologia.graphicHeight]
                });
            }
            return new ol.style.Style({
                image: simbolo
            });
        },
        getTextStyle: function(texto){
            return new ol.style.Style({
                text: new ol.style.Text({
                    text: texto,
                    font: 'Bold ' + parseInt(i3GEO.editor._simbologia.fontSize,10) + 'px Arial',
                    textAlign: 'left',
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: i3GEO.editor._simbologia.strokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: i3GEO.editor._simbologia.fontColor
                    }),
                    zIndex: 2000
                })
            });
        },
        post : function({par = par,elblock = elblock,id = id}){
            if(i3GEO.login.verificaCookieLogin() == false){
                i3GEO.janela.snackBar({content: "Login !!!", style:'red'});
                return false;
            }
            i3GEO.janela.abreAguarde();
            elblock.find("button").prop("disabled",true);
            par.srid = i3geoOL.getView().getProjection().getCode().replace("EPSG:","");
            $.post(
                    i3GEO.configura.locaplic+"/ferramentas/editortema/exec.php",
                    par
            )
            .done(
                    function(data, status){
                        i3GEO.janela.fechaAguarde();
                        i3GEO.janela.snackBar({content: $trad('feito')});
                        elblock.find("button").prop("disabled",false);
                        i3GEO.Interface.atualizaTema("",par._tema);
                        if(par.funcao == "excluir" || par.funcao == "inserir"){
                            i3GEO.editor.deleteFeatureById(id);
                        }
                        return true;
                    }
            )
            .fail(
                    function(data){
                        i3GEO.janela.fechaAguarde();
                        i3GEO.janela.snackBar({content: data.statusText, style:'red'});
                        elblock.find("button").prop("disabled",false);
                    }
            );
        },
        difference : function(after, listaWkt) {
            i3GEO.editor.ativaIdentifica();
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    funcao: "difference",
                    geometry: listaWkt
                },
                prog: "/serverapi/geometry/",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        }
};