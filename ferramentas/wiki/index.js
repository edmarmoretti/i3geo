if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.wiki = {
	_parameters: {
	    snackbar: "",
	    marca: false,
	    startDate: 0
	},
	start: function(){
	    this.getData();
	    i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEOF.wiki.getData()"]);
	},
	show: function(data){
	    var html = [];
	    i3GEO.desenho.removePins("wikiresults");
	    for (const r of data) {
		html.push("<div onmouseover='i3GEOF.wiki.mostraxy(" + r.lon + "," + r.lat + ")' onmouseout='i3GEOF.wiki.escondexy()'><h4>" + r.title + "</h4>");
		var link = "<a onclick='window.open(\"http://pt.wikipedia.org/wiki?curid=" + r.pageid + "\");return false;' href='javascript:void(0);' target=blank >Abrir Wikpedia</a>";
		html.push(link);
		html.push("</div><hr>");
		i3GEO.desenho.addPin({
		    x: r.lon*1,
		    y: r.lat*1,
		    w: 32,
		    h: 37,
		    imagem: i3GEO.configura.locaplic+'/imagens/mapicons/information.png',
		    namespace: "wikiresults",
		    tooltiptext: r.title,
		    nameLayer: "Wikipedia",
		    fat: {"Link": link}
		});
	    }
	    if(data[0] == "aproxmais"){
		html = [$trad("aproxmais")];
	    }
	    if(html.length == 0){
		html = [$trad("nadaenc")];
	    }
	    if(!$i("wikiresults")){
		i3GEOF.wiki._parameters.snackbar = i3GEO.janela.snackBar({
		    content: "<div id='wikiresults' style='max-width: 220px;'></div>",
		    timeout: 0,
		    onClose: function(){
			i3GEO.desenho.removePins("wikiresults");
			i3GEO.desenho.removePins("wiki");
			i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.wiki.getData()"]);
		    }
		});
	    } else {
		$(i3GEOF.wiki._parameters.snackbar).snackbar("show");
	    }
	    $i("wikiresults").innerHTML = html.join(" ");
	    $( "#snackbar-container" ).find("a").click(function( event ) {
		event.stopPropagation();
	    });
	},
	getData: function(){
	    if(parseInt(i3GEOF.wiki._parameters.startDate / 2000,10) == parseInt(Date.now() / 2000,10)){
		return;
	    }
	    i3GEOF.wiki._parameters.startDate = Date.now();
	    var bbox = i3geoOL.getView().calculateExtent();
	    var line = new ol.geom.LineString([[bbox[0],bbox[1]],[bbox[0],bbox[3]]]);
	    if (i3GEO.Interface.openlayers.googleLike === false){
		line = line.transform("EPSG:4326","EPSG:3857");
	    }
	    var raio = line.getLength() / 2;
	    if(raio >= 10000){
		i3GEOF.wiki.show(["aproxmais"]);
	    } else {
		i3GEO.janela.abreAguarde();
		$.get(
			i3GEO.configura.locaplic + "/ferramentas/wiki/geosearch.php",
			{
			    g_sid: i3GEO.configura.sid,
			    funcao: "listaartigos",
			    ext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten),
			    raio: parseInt(raio,10)
			}
		).done(function(data) {
		    i3GEO.janela.fechaAguarde();
		    i3GEOF.wiki.show(data);
		}).fail(function() {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    return;
		});
	    }
	},
	escondexy: function(){
	    i3GEO.desenho.removePins("wiki");
	    i3GEOF.wiki._parameters.marca = false;
	},
	mostraxy: function(x,y){
	    if(i3GEOF.wiki._parameters.marca === false){
		i3GEOF.wiki._parameters.marca = i3GEO.desenho.addPin({
		    x: x*1,
		    y: y*1,
		    w: 32,
		    h: 37,
		    imagem: i3GEO.configura.locaplic+'/imagens/mapicons/smiley_happy.png',
		    namespace: "wiki"
		});
	    }
	    else{
		i3GEO.desenho.movePin(i3GEOF.wiki._parameters.marca,x,y);
	    }
	}
};